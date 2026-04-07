import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// ─── Request interceptor ───────────────────────────────────────────────────
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = []; // Hàng đợi các request bị lỗi 401 trong lúc đang refresh

const processQueue = (error, token = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(token);
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;
		const data = error.response?.data;

		// ── Xử lý 401: thử refresh token ──────────────────────────────────────
		if (status === 401 && !originalRequest._retry) {
			const refreshToken = localStorage.getItem('refresh_token');

			// Không có refresh token → logout luôn
			if (!refreshToken) {
				handleLogout();
				return Promise.reject({
					message: 'Phiên đăng nhập đã hết hạn.',
				});
			}

			// Đang refresh rồi → đẩy request vào hàng đợi, chờ token mới
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const res = await axios.post(
					`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
					{},
					{ headers: { Authorization: `Bearer ${refreshToken}` } },
				);

				const { access_token, refresh_token } = res.data.data;

				localStorage.setItem('access_token', access_token);
				localStorage.setItem('refresh_token', refresh_token);

				api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
				processQueue(null, access_token);

				// Retry request gốc với token mới
				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				handleLogout();
				return Promise.reject({
					message: 'Phiên đăng nhập đã hết hạn.',
				});
			} finally {
				isRefreshing = false;
			}
		}

		// ── Xử lý lỗi validation (message là object) ──────────────────────────
		if (
			data?.message &&
			typeof data.message === 'object' &&
			!Array.isArray(data.message)
		) {
			const fieldErrors = {};
			for (const [key, val] of Object.entries(data.message)) {
				fieldErrors[key] = Array.isArray(val) ? val[0] : val;
			}
			return Promise.reject({ fieldErrors });
		}

		// ── Lỗi thường ────────────────────────────────────────────────────────
		return Promise.reject({
			message: data?.message || 'Đã có lỗi xảy ra.',
		});
	},
);

function handleLogout() {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	window.location.href = '/login';
}

export default api;

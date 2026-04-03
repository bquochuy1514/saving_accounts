import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const data = error.response?.data;

		// Nếu message là object { email: [...], password: [...] }
		// thì lấy phần tử đầu tiên của mỗi mảng
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

		// Nếu message là string thường
		return Promise.reject({
			message: data?.message || 'Đã có lỗi xảy ra.',
		});
	},
);

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

export default api;

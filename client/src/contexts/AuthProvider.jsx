import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getUserProfile } from '../services/user';
import { loginService, logoutService } from '../services/auth';

export default function AuthProvider({ children }) {
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem('access_token');
			const refresh = localStorage.getItem('refresh_token');
			if (!token) {
				setLoading(false);
				return;
			}

			setAccessToken(token);
			setRefreshToken(refresh);

			try {
				const response = await getUserProfile(token); // dùng token local, không dùng state
				setUser(response.data);
			} catch {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (email, password) => {
		const response = await loginService(email, password);
		const { user, access_token, refresh_token } = response.data;

		localStorage.setItem('access_token', access_token);
		localStorage.setItem('refresh_token', refresh_token);
		setAccessToken(access_token);
		setRefreshToken(refresh_token);
		setUser(user);

		return response;
	};

	const logout = async () => {
		try {
			const data = await logoutService();
			return data;
		} catch {
			// kệ lỗi
		} finally {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			setAccessToken(null);
			setRefreshToken(null);
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				refreshToken,
				loading,
				isAuthenticated: !!user,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

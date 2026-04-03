import api from './api';

export const loginService = async (email, password) => {
	const response = await api.post('/auth/login', { email, password });
	return response;
};

export const logoutService = async () => {
	const response = await api.post('/auth/logout');
	return response;
};

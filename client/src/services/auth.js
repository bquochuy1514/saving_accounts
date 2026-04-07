import api from './api';

export const loginService = async (email, password) => {
	const response = await api.post('/auth/login', { email, password });
	return response;
};

export const registerService = async (
	fullName,
	email,
	password,
	confirmPassword,
) => {
	const response = await api.post('/auth/register', {
		fullName,
		email,
		password,
		confirmPassword,
	});
	return response;
};

export const logoutService = async () => {
	const response = await api.post('/auth/logout');
	return response;
};

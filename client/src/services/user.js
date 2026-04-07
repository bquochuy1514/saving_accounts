import api from './api';

export const getUserProfile = async () => {
	const response = await api.get('/users/profile');
	return response;
};

export const getAllUsers = async () => {
	const response = await api.get('/users');
	return response;
};

export const changeUserRole = async (userId, role) => {
	const response = await api.put('/users/change-user-role', { userId, role });
	return response;
};

export const toggleLockUser = async (userId) => {
	const response = await api.put(`/users/${userId}/toggle-lock`);
	return response;
};

import api from './api';

export const getUserProfile = async () => {
	const response = await api.get('/users/profile');
	return response;
};

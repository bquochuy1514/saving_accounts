import api from './api';

export const getSavingsTypes = async () => {
	const response = await api.get('/savings-type');
	return response;
};

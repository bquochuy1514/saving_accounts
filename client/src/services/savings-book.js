import api from './api';

export const getSavingsBooks = async () => {
	const response = await api.get('/savings-book');
	return response;
};

export const createSavingsBook = async (bookData) => {
	const response = await api.get('/savings-book', { bookData });
	return response;
};

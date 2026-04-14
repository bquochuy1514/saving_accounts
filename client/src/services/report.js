import api from './api';

export const getDailyActivity = async (date) => {
	const response = await api.get(`/reports/daily-activity?date=${date}`);
	return response;
};

export const getMonthlyBooks = async (savingsTypeId, month, year) => {
	const response = await api.get(
		`/reports/monthly-books?savingsTypeId=${savingsTypeId}&month=${month}&year=${year}`,
	);
	return response;
};

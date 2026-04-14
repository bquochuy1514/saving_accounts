import { useEffect, useState } from 'react';
import { LuBookOpen, LuRefreshCw } from 'react-icons/lu';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from 'recharts';
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';
import { getActiveSavingsTypes } from '../../../services/savings-type';
import { getMonthlyBooks } from '../../../services/report';

function formatDate(isoString) {
	if (!isoString) return '—';
	return new Date(isoString).toLocaleDateString('vi-VN');
}

function getMonthOptions() {
	return Array.from({ length: 12 }, (_, i) => ({
		value: i + 1,
		label: `Tháng ${i + 1}`,
	}));
}

function getYearOptions() {
	const current = new Date().getFullYear();
	return Array.from({ length: 5 }, (_, i) => current - i);
}

export default function MonthlyBooksPage() {
	const now = new Date();

	const [savingsTypes, setSavingsTypes] = useState([]);
	const [selectedTypeId, setSelectedTypeId] = useState('');
	const [month, setMonth] = useState(now.getMonth() + 1);
	const [year, setYear] = useState(now.getFullYear());

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Load danh sách loại tiết kiệm
	useEffect(() => {
		getActiveSavingsTypes()
			.then((res) => {
				const active = res.data.filter((t) => t.isActive);
				setSavingsTypes(active);
				if (active.length > 0) setSelectedTypeId(active[0].id);
			})
			.catch(() => {});
	}, []);

	const fetchData = async () => {
		if (!selectedTypeId) return;
		try {
			setLoading(true);
			setError(null);
			const res = await getMonthlyBooks(selectedTypeId, month, year);
			setData(res.data);
		} catch (err) {
			console.error(err);
			setError('Không thể tải dữ liệu báo cáo.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [selectedTypeId, month, year]);

	const rows = data?.rows ?? [];
	const totalOpened = rows.reduce((s, r) => s + r.opened, 0);
	const totalClosed = rows.reduce((s, r) => s + r.closed, 0);
	const totalDiff = totalOpened - totalClosed;

	const statCards = [
		{
			label: 'Loại tiết kiệm',
			value: data?.savingsTypeName ?? '—',
		},
		{
			label: 'Tháng / Năm',
			value: data
				? `${String(data.month).padStart(2, '0')} / ${data.year}`
				: '—',
		},
		{
			label: 'Tổng sổ mở',
			value: totalOpened,
			color: 'text-blue-600',
		},
		{
			label: 'Tổng sổ đóng',
			value: totalClosed,
			color: 'text-red-500',
		},
	];

	const chartData = rows.map((r) => ({
		date: new Date(r.date).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
		}),
		'Sổ mở': r.opened,
		'Sổ đóng': r.closed,
	}));

	return (
		<div className="p-6">
			<PageHeader
				title="Báo cáo sổ tiết kiệm theo tháng"
				subtitle="Thống kê số sổ mở/đóng theo từng ngày trong tháng"
				icon={LuBookOpen}
				badge="BM5.2"
				action={
					<div className="flex items-center gap-2">
						{/* Dropdown loại tiết kiệm */}
						<select
							value={selectedTypeId}
							onChange={(e) =>
								setSelectedTypeId(Number(e.target.value))
							}
							className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
						>
							{savingsTypes.map((t) => (
								<option key={t.id} value={t.id}>
									{t.name}
								</option>
							))}
						</select>

						{/* Dropdown tháng */}
						<select
							value={month}
							onChange={(e) => setMonth(Number(e.target.value))}
							className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
						>
							{getMonthOptions().map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>

						{/* Dropdown năm */}
						<select
							value={year}
							onChange={(e) => setYear(Number(e.target.value))}
							className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
						>
							{getYearOptions().map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>

						<button
							onClick={fetchData}
							className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
						>
							<LuRefreshCw size={14} />
							Làm mới
						</button>
					</div>
				}
			/>

			{/* Stat cards */}
			<div className="grid grid-cols-4 gap-4 mb-6">
				{statCards.map((card) => (
					<StatCard
						key={card.label}
						label={card.label}
						value={card.value}
					/>
				))}
			</div>

			{/* Line chart */}
			{!loading && !error && rows.length > 0 && (
				<div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
					<p className="text-xs font-medium text-gray-400 mb-3">
						Biến động sổ theo ngày
					</p>
					<ResponsiveContainer width="100%" height={220}>
						<LineChart
							data={chartData}
							margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f0f0f0"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								tick={{ fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11 }}
								axisLine={false}
								tickLine={false}
								allowDecimals={false}
							/>
							<Tooltip />
							<Legend wrapperStyle={{ fontSize: 12 }} />
							<Line
								type="monotone"
								dataKey="Sổ mở"
								stroke="#378ADD"
								strokeWidth={2}
								dot={{ r: 4, fill: '#378ADD' }}
								activeDot={{ r: 5 }}
							/>
							<Line
								type="monotone"
								dataKey="Sổ đóng"
								stroke="#E24B4A"
								strokeWidth={2}
								dot={{ r: 4, fill: '#E24B4A' }}
								activeDot={{ r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}

			{/* Table */}
			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-16 text-sm text-gray-400">
						Đang tải dữ liệu...
					</div>
				) : error ? (
					<div className="flex items-center justify-center py-16 text-sm text-red-400">
						{error}
					</div>
				) : rows.length === 0 ? (
					<div className="flex items-center justify-center py-16 text-sm text-gray-400">
						Không có dữ liệu trong tháng này.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-200">
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400 w-12">
									STT
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Ngày
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Sổ mở
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Sổ đóng
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Chênh lệch
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{rows.map((row) => {
								const diff = row.opened - row.closed;
								return (
									<tr
										key={row.stt}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-4 py-3 text-gray-400">
											{row.stt}
										</td>
										<td className="px-4 py-3 text-gray-700">
											{formatDate(row.date)}
										</td>
										<td className="px-4 py-3 text-right font-medium text-blue-600">
											{row.opened}
										</td>
										<td className="px-4 py-3 text-right font-medium text-red-500">
											{row.closed}
										</td>
										<td
											className={`px-4 py-3 text-right font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}
										>
											{diff >= 0 ? '+' : ''}
											{diff}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr className="bg-gray-50 border-t border-gray-200">
								<td
									colSpan={2}
									className="px-4 py-3 text-xs font-medium text-gray-500"
								>
									Tổng cộng
								</td>
								<td className="px-4 py-3 text-right font-medium text-blue-600">
									{totalOpened}
								</td>
								<td className="px-4 py-3 text-right font-medium text-red-500">
									{totalClosed}
								</td>
								<td
									className={`px-4 py-3 text-right font-medium ${totalDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}
								>
									{totalDiff >= 0 ? '+' : ''}
									{totalDiff}
								</td>
							</tr>
						</tfoot>
					</table>
				)}
			</div>
		</div>
	);
}

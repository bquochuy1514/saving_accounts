import { useEffect, useState } from 'react';
import { LuCalendarDays, LuRefreshCw } from 'react-icons/lu';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts';
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';
import Input from '../../../components/ui/Input';
import { getDailyActivity } from '../../../services/report';

const PIE_COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E', '#7F77DD'];

function formatCurrency(amount) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(amount);
}

function formatMillions(value) {
	return `${(value / 1_000_000).toFixed(0)}tr`;
}

function toLocalDate(date) {
	// tránh lệch timezone khi format thành yyyy-mm-dd
	const d = new Date(date);
	return d.toISOString().split('T')[0];
}

export default function DailyActivityPage() {
	const today = toLocalDate(new Date());

	const [date, setDate] = useState(today);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await getDailyActivity(date);
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
	}, [date]);

	const rows = data?.rows ?? [];

	const totalDeposit = rows.reduce((s, r) => s + r.totalDeposit, 0);
	const totalWithdrawal = rows.reduce((s, r) => s + r.totalWithdrawal, 0);
	const totalDiff = totalDeposit - totalWithdrawal;

	const statCards = [
		{ label: 'Loại tiết kiệm', value: rows.length },
		{
			label: 'Tổng gửi',
			value: formatCurrency(totalDeposit),
			color: 'text-blue-600',
		},
		{
			label: 'Tổng rút',
			value: formatCurrency(totalWithdrawal),
			color: 'text-red-500',
		},
		{
			label: 'Chênh lệch',
			value: formatCurrency(totalDiff),
			color: totalDiff >= 0 ? 'text-green-600' : 'text-red-500',
		},
	];

	const chartData = rows.map((r) => ({
		name: r.savingsTypeName,
		Gửi: r.totalDeposit,
		Rút: r.totalWithdrawal,
	}));

	const pieData = rows
		.filter((r) => r.totalDeposit > 0)
		.map((r) => ({ name: r.savingsTypeName, value: r.totalDeposit }));

	return (
		<div className="p-6">
			<PageHeader
				title="Báo Cáo Doanh Số Hoạt Động Ngày"
				subtitle="Tổng hợp giao dịch gửi/rút theo loại tiết kiệm"
				icon={LuCalendarDays}
				badge="BM5.1"
				action={
					<div className="flex items-center gap-2">
						<Input
							type="date"
							value={date}
							max={today}
							onChange={(e) => setDate(e.target.value)}
						/>

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

			{/* Charts */}
			{!loading && !error && rows.length > 0 && (
				<div className="grid grid-cols-2 gap-4 mb-6">
					{/* Bar chart */}
					<div className="bg-white border border-gray-200 rounded-xl p-4">
						<p className="text-xs font-medium text-gray-400 mb-3">
							Gửi vs rút theo loại
						</p>
						<ResponsiveContainer width="100%" height={200}>
							<BarChart
								data={chartData}
								margin={{
									top: 4,
									right: 8,
									left: -10,
									bottom: 0,
								}}
							>
								<XAxis
									dataKey="name"
									tick={{ fontSize: 11 }}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									tickFormatter={formatMillions}
									tick={{ fontSize: 11 }}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip formatter={(v) => formatCurrency(v)} />
								<Bar
									dataKey="Gửi"
									fill="#378ADD"
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="Rút"
									fill="#E24B4A"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Pie chart */}
					<div className="bg-white border border-gray-200 rounded-xl p-4">
						<p className="text-xs font-medium text-gray-400 mb-3">
							Tỷ trọng gửi theo loại
						</p>
						<ResponsiveContainer width="100%" height={200}>
							<PieChart>
								<Pie
									data={pieData}
									cx="40%"
									cy="50%"
									innerRadius={50}
									outerRadius={75}
									dataKey="value"
									paddingAngle={2}
								>
									{pieData.map((_, i) => (
										<Cell
											key={i}
											fill={
												PIE_COLORS[
													i % PIE_COLORS.length
												]
											}
										/>
									))}
								</Pie>
								<Legend
									layout="vertical"
									align="right"
									verticalAlign="middle"
									iconType="circle"
									iconSize={10}
									wrapperStyle={{ fontSize: 12 }}
								/>
								<Tooltip formatter={(v) => formatCurrency(v)} />
							</PieChart>
						</ResponsiveContainer>
					</div>
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
						Không có dữ liệu phát sinh trong ngày này.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-200">
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400 w-12">
									STT
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Loại tiết kiệm
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Tổng gửi
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Tổng rút
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Chênh lệch
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{rows.map((row) => {
								const diff =
									row.totalDeposit - row.totalWithdrawal;
								return (
									<tr
										key={row.stt}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-4 py-3 text-gray-400">
											{row.stt}
										</td>
										<td className="px-4 py-3 font-medium text-gray-800">
											{row.savingsTypeName}
										</td>
										<td className="px-4 py-3 text-right text-blue-600 font-medium">
											{formatCurrency(row.totalDeposit)}
										</td>
										<td className="px-4 py-3 text-right text-red-500 font-medium">
											{formatCurrency(
												row.totalWithdrawal,
											)}
										</td>
										<td
											className={`px-4 py-3 text-right font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}
										>
											{diff >= 0 ? '+' : ''}
											{formatCurrency(diff)}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr className="bg-gray-50 border-t border-gray-200 font-medium">
								<td
									colSpan={2}
									className="px-4 py-3 text-xs text-gray-500"
								>
									Tổng cộng
								</td>
								<td className="px-4 py-3 text-right text-blue-600">
									{formatCurrency(totalDeposit)}
								</td>
								<td className="px-4 py-3 text-right text-red-500">
									{formatCurrency(totalWithdrawal)}
								</td>
								<td
									className={`px-4 py-3 text-right ${totalDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}
								>
									{totalDiff >= 0 ? '+' : ''}
									{formatCurrency(totalDiff)}
								</td>
							</tr>
						</tfoot>
					</table>
				)}
			</div>
		</div>
	);
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch, LuFilePlus, LuRefreshCw } from 'react-icons/lu';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';

const STATUS_LABEL = {
	OPEN: {
		label: 'Đang hoạt động',
		className: 'bg-green-50 text-green-700',
	},
	CLOSED: { label: 'Đã đóng', className: 'bg-gray-100 text-gray-500' },
};

function formatCurrency(amount) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(amount);
}

function formatDate(isoString) {
	if (!isoString) return '—';
	return new Date(isoString).toLocaleDateString('vi-VN');
}

export default function SavingsList() {
	const navigate = useNavigate();

	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [search, setSearch] = useState('');
	const [filterStatus, setFilterStatus] = useState('ALL');
	const [filterType, setFilterType] = useState('ALL');

	const statCards = [
		{ label: 'Tổng số sổ', value: books.length },
		{
			label: 'Đang hoạt động',
			value: books.filter((b) => b.status === 'ACTIVE').length,
			color: 'text-green-600',
		},
		{
			label: 'Đã đóng',
			value: books.filter((b) => b.status === 'CLOSED').length,
			color: 'text-gray-400',
		},
		{
			label: 'Tổng số dư',
			value: formatCurrency(books.reduce((sum, b) => sum + b.balance, 0)),
			color: 'text-blue-600',
		},
	];

	const fetchBooks = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.get('/savings-book', {
				headers: {
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb3RpZXRraWVtLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NTIwMTY1OSwiZXhwIjoxNzc1MjA1MjU5fQ.9BiZTVl4h-A0gzfECzeBWSN_W14mdiuaBmoWlKLupoI',
				},
			});
			setBooks(data.data);
		} catch (err) {
			setError('Không thể tải danh sách sổ tiết kiệm.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	// Lấy danh sách loại tiết kiệm duy nhất để build filter
	const savingsTypes = [
		...new Map(
			books.map((b) => [b.savingsType.id, b.savingsType]),
		).values(),
	];

	const filtered = books.filter((book) => {
		const keyword = search.toLowerCase();
		const matchSearch =
			!keyword ||
			book.customer.fullName.toLowerCase().includes(keyword) ||
			book.customer.idNumber.includes(keyword) ||
			String(book.id).includes(keyword);
		const matchStatus =
			filterStatus === 'ALL' || book.status === filterStatus;
		const matchType =
			filterType === 'ALL' || String(book.savingsType.id) === filterType;
		return matchSearch && matchStatus && matchType;
	});

	return (
		<div className="p-6">
			{/* Header */}
			<PageHeader
				title={'Tra cứu sổ tiết kiệm'}
				subtitle={'Danh sách tất cả sổ tiết kiệm trong hệ thống'}
				action={
					<button
						onClick={() => navigate('/mo-so')}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
					>
						<LuFilePlus size={15} />
						Mở sổ mới
					</button>
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

			{/* Filter bar */}
			<div className="flex items-center gap-3 mb-4">
				<div className="relative flex-1 max-w-xs">
					<LuSearch
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						placeholder="Tìm tên KH, CMND, mã sổ..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
					/>
				</div>

				<select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600"
				>
					<option value="ALL">Tất cả trạng thái</option>
					<option value="ACTIVE">Đang hoạt động</option>
					<option value="CLOSED">Đã đóng</option>
				</select>

				<select
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600"
				>
					<option value="ALL">Tất cả loại</option>
					{savingsTypes.map((t) => (
						<option key={t.id} value={String(t.id)}>
							{t.name}
						</option>
					))}
				</select>

				<button
					onClick={fetchBooks}
					className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
				>
					<LuRefreshCw size={14} />
					Làm mới
				</button>

				<span className="ml-auto text-xs text-gray-400">
					{filtered.length} kết quả
				</span>
			</div>

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
				) : filtered.length === 0 ? (
					<div className="flex items-center justify-center py-16 text-sm text-gray-400">
						Không tìm thấy sổ nào phù hợp.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-200">
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400 w-10">
									STT
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Mã sổ
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Loại tiết kiệm
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Khách hàng
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									CMND / CCCD
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Ngày mở
								</th>
								<th className="text-right px-4 py-3 text-xs font-medium text-gray-400">
									Số dư
								</th>
								<th className="text-center px-4 py-3 text-xs font-medium text-gray-400">
									Trạng thái
								</th>
								<th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
									Người mở
								</th>
								<th className="px-4 py-3 text-xs font-medium text-gray-400"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filtered.map((book, index) => {
								const status = STATUS_LABEL[book.status] ?? {
									label: book.status,
									className: 'bg-gray-100 text-gray-500',
								};
								return (
									<tr
										key={book.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-4 py-3 text-gray-400">
											{index + 1}
										</td>
										<td className="px-4 py-3 font-medium text-gray-700">
											#{book.id}
										</td>
										<td className="px-4 py-3 text-gray-600">
											{book.savingsType.name}
										</td>
										<td className="px-4 py-3 text-gray-800 font-medium">
											{book.customer.fullName}
										</td>
										<td className="px-4 py-3 text-gray-500">
											{book.customer.idNumber}
										</td>
										<td className="px-4 py-3 text-gray-500">
											{formatDate(book.openDate)}
										</td>
										<td className="px-4 py-3 text-right font-medium text-gray-800">
											{formatCurrency(book.balance)}
										</td>
										<td className="px-4 py-3 text-center">
											<span
												className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
											>
												{status.label}
											</span>
										</td>
										<td className="px-4 py-3 text-gray-500 text-xs">
											{book.openedByUser?.fullname ?? '—'}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												{book.status === 'ACTIVE' && (
													<>
														<button
															onClick={() =>
																navigate(
																	'/gui-tien',
																	{
																		state: {
																			bookId: book.id,
																		},
																	},
																)
															}
															className="text-xs text-blue-600 hover:underline whitespace-nowrap"
														>
															Gởi thêm
														</button>
														<button
															onClick={() =>
																navigate(
																	'/rut-tien',
																	{
																		state: {
																			bookId: book.id,
																		},
																	},
																)
															}
															className="text-xs text-orange-500 hover:underline whitespace-nowrap"
														>
															Rút tiền
														</button>
													</>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}

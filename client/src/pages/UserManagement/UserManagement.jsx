import { useState, useEffect } from 'react';
import {
	LuUserPlus,
	LuSearch,
	LuRefreshCw,
	LuPencil,
	LuLock,
} from 'react-icons/lu';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import CreateUserModal from './CreateUserModal';
import { getAllUsers, toggleLockUser } from '../../services/user';
import ChangeUserRoleModal from './ChangeUserRoleModal';
import LockUserModal from './LockUserModal';
import { toast } from 'react-toastify';

const ROLE_LABEL = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	STAFF: 'Nhân viên',
};

const ROLE_BADGE = {
	ADMIN: 'bg-purple-50 text-red-500',
	MANAGER: 'bg-blue-50 text-blue-700',
	STAFF: 'bg-gray-100 text-purple-700',
};

const STATUS_BADGE = {
	true: { label: 'Hoạt động', className: 'bg-green-50 text-green-700' },
	false: { label: 'Bị khóa', className: 'bg-red-50 text-red-500' },
};

const TABLE_HEADERS = [
	'STT',
	'Họ và tên',
	'Email',
	'Vai trò',
	'Trạng thái',
	'Ngày tạo',
	'Hành động',
];

function formatDate(isoString) {
	return new Date(isoString).toLocaleDateString('vi-VN');
}

function getInitials(fullName) {
	return fullName
		.split(' ')
		.slice(-2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();
}

export default function UserManagement() {
	// ── Data state ────────────────────────────────────────────
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [lockLoading, setLockLoading] = useState(false);
	const [error, setError] = useState('');

	// ── Filter state ──────────────────────────────────────────
	const [search, setSearch] = useState('');

	// ── Modal state ───────────────────────────────────────────
	const [showModal, setShowModal] = useState(false);
	const [roleModalUser, setRoleModalUser] = useState(null);
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		user: null,
	});

	// ── Fetch ─────────────────────────────────────────────────
	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await getAllUsers();
			setUsers(response.data);
		} catch (err) {
			setError(err.message || 'Không thể tải danh sách người dùng.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// ── Derived ───────────────────────────────────────────────
	const filtered = users.filter((u) => {
		const keyword = search.toLowerCase();
		return (
			!keyword ||
			u.fullName.toLowerCase().includes(keyword) ||
			u.email.toLowerCase().includes(keyword)
		);
	});

	const statCards = [
		{ label: 'Tổng tài khoản', value: users.length },
		{
			label: 'Quản trị viên',
			value: users.filter((u) => u.role === 'ADMIN').length,
		},
		{
			label: 'Quản lý',
			value: users.filter((u) => u.role === 'MANAGER').length,
		},
		{
			label: 'Nhân viên',
			value: users.filter((u) => u.role === 'STAFF').length,
		},
	];

	// ── Handlers ──────────────────────────────────────────────
	const handleCreateSuccess = () => {
		setShowModal(false);
		fetchUsers();
	};

	const handleChangeRole = (user) => setRoleModalUser(user);

	const handleToggleLock = (user) => {
		setConfirmModal({ open: true, user });
	};

	const handleChangeRoleSuccess = () => {
		setRoleModalUser(null);
		fetchUsers();
	};

	const handleConfirmToggleLock = async () => {
		try {
			setLockLoading(true);
			await toggleLockUser(confirmModal.user.id);
			toast.info('Thao tác thành công!');
			setConfirmModal({ open: false, user: null });
			fetchUsers();
		} catch (err) {
			console.error(err);
		} finally {
			setLockLoading(false);
		}
	};

	// ── Render ────────────────────────────────────────────────
	return (
		<div className="p-6">
			<PageHeader
				title="Quản lý người dùng"
				subtitle="Tạo và quản lý tài khoản nhân viên trong hệ thống"
				action={
					<Button
						onClick={() => setShowModal(true)}
						icon={<LuUserPlus size={15} />}
					>
						Tạo tài khoản
					</Button>
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
						placeholder="Tìm tên, email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
					/>
				</div>

				<button
					onClick={fetchUsers}
					className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
				>
					<LuRefreshCw size={14} />
					Làm mới
				</button>

				<span className="ml-auto text-xs text-gray-400">
					{filtered.length} tài khoản
				</span>
			</div>

			{/* Error */}
			{error && (
				<div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-500">
					{error}
				</div>
			)}

			{/* Table */}
			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-200">
							{TABLE_HEADERS.map((h, i) => (
								<th
									key={i}
									className={`px-4 py-3 text-xs font-medium text-gray-400 ${
										i === 0
											? 'text-left w-10'
											: i <= 2
												? 'text-left'
												: i <= 4
													? 'text-center'
													: 'text-left'
									}`}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-10 text-center text-sm text-gray-400"
								>
									Đang tải...
								</td>
							</tr>
						) : filtered.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-10 text-center text-sm text-gray-400"
								>
									Không có tài khoản nào.
								</td>
							</tr>
						) : (
							filtered.map((u, index) => {
								const status = STATUS_BADGE[u.isActive];
								return (
									<tr
										key={u.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-4 py-3 text-gray-400">
											{index + 1}
										</td>

										<td className="px-4 py-3">
											<div className="flex items-center gap-2.5">
												<div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
													{getInitials(u.fullName)}
												</div>
												<span className="font-medium text-gray-800">
													{u.fullName}
												</span>
											</div>
										</td>

										<td className="px-4 py-3 text-gray-500">
											{u.email}
										</td>

										<td className="px-4 py-3 text-center">
											<span
												className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[u.role]}`}
											>
												{ROLE_LABEL[u.role]}
											</span>
										</td>

										<td className="px-4 py-3 text-center">
											<span
												className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
											>
												{status.label}
											</span>
										</td>

										<td className="px-4 py-3 text-gray-500 text-xs">
											{formatDate(u.createdAt)}
										</td>

										<td className="px-4 py-3">
											{u.role !== 'ADMIN' && (
												<div className="flex items-center gap-3">
													<button
														onClick={() =>
															handleChangeRole(u)
														}
														className="flex items-center gap-1 text-xs text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
													>
														<LuPencil size={12} />
														Đổi role
													</button>
													<button
														onClick={() =>
															handleToggleLock(u)
														}
														className={`flex items-center gap-1 text-xs hover:underline cursor-pointer whitespace-nowrap ${u.isActive ? 'text-red-500' : 'text-green-600'}`}
													>
														<LuLock size={12} />
														{u.isActive
															? 'Khóa'
															: 'Mở khóa'}
													</button>
												</div>
											)}
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{showModal && (
				<CreateUserModal
					onClose={() => setShowModal(false)}
					onSuccess={handleCreateSuccess}
					fetchUsers={fetchUsers}
				/>
			)}

			{roleModalUser && (
				<ChangeUserRoleModal
					user={roleModalUser}
					onClose={() => setRoleModalUser(null)}
					onSuccess={handleChangeRoleSuccess}
				/>
			)}

			{confirmModal.open && (
				<LockUserModal
					isOpen={confirmModal.open}
					onClose={() => setConfirmModal({ open: false, user: null })}
					onConfirm={handleConfirmToggleLock}
					type={confirmModal.user?.isActive ? 'lock' : 'unlock'}
					userName={confirmModal.user?.fullName}
					loading={lockLoading}
				/>
			)}
		</div>
	);
}

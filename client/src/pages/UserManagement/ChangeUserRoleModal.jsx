// src/pages/UserManagement/ChangeUserRoleModal.jsx

import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import Button from '../../components/ui/Button';
import { changeUserRole } from '../../services/user';
import { toast } from 'react-toastify';
import PageHeader from '../../components/ui/PageHeader';

const ROLES = [
	{
		value: 'MANAGER',
		label: 'Quản lý',
		description: 'Quản lý sổ tiết kiệm và giao dịch',
	},
	{
		value: 'STAFF',
		label: 'Nhân viên',
		description: 'Thực hiện các giao dịch cơ bản',
	},
];

export default function ChangeUserRoleModal({ user, onClose, onSuccess }) {
	const [selectedRole, setSelectedRole] = useState(user.role);
	const [loading, setLoading] = useState(false);

	const isUnchanged = selectedRole === user.role;

	const handleSubmit = async () => {
		if (isUnchanged) return;
		try {
			setLoading(true);
			const response = await changeUserRole(user.id, selectedRole);
			toast.success(response.message);
			onSuccess(response.data);
		} catch (err) {
			toast.error(err.message || 'Đổi vai trò thất bại.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
			<div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<div>
						<h2 className="text-sm font-semibold text-gray-800">
							Đổi vai trò
						</h2>
						<p className="text-xs text-gray-400 mt-0.5">
							{user.fullName}
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
					>
						<LuX size={16} />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-4 space-y-2">
					{ROLES.map((role) => {
						const isSelected = selectedRole === role.value;
						return (
							<button
								key={role.value}
								onClick={() => setSelectedRole(role.value)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
									isSelected
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200 hover:bg-gray-50'
								}`}
							>
								{/* Radio circle */}
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
										isSelected
											? 'border-blue-500'
											: 'border-gray-300'
									}`}
								>
									{isSelected && (
										<div className="w-2 h-2 rounded-full bg-blue-500" />
									)}
								</div>

								<div>
									<p
										className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}
									>
										{role.label}
									</p>
									<p className="text-xs text-gray-400 mt-0.5">
										{role.description}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose}>
						Huỷ
					</Button>
					<Button
						onClick={handleSubmit}
						isLoading={loading}
						disabled={isUnchanged}
					>
						Lưu thay đổi
					</Button>
				</div>
			</div>
		</div>
	);
}

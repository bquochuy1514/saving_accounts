import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import Input from '../../components/ui/Input';
import { registerService } from '../../services/auth';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

export default function CreateUserModal({ onClose, fetchUsers }) {
	const [fieldErrors, setFieldErrors] = useState({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { fullName, email, password, confirmPassword } = form;
		try {
			setLoading(true);
			setError('');
			setFieldErrors({});
			const response = await registerService(
				fullName,
				email,
				password,
				confirmPassword,
			);
			toast.success(response.message || 'Đăng ký thành công!');
			setForm({
				fullName: '',
				email: '',
				password: '',
				confirmPassword: '',
			});
			fetchUsers();
		} catch (err) {
			if (err.fieldErrors) {
				setFieldErrors(err.fieldErrors);
			} else {
				setError(err.message || 'Đăng nhập thất bại.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
			<div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
					<div>
						<h2 className="text-sm font-semibold text-gray-800">
							Tạo tài khoản mới
						</h2>
						<p className="text-xs text-gray-400 mt-0.5">
							Tạo tài khoản cho nhân viên
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
					>
						<LuX size={18} />
					</button>
				</div>

				{/* Body */}
				<div className="px-6 py-5 space-y-4">
					<Input
						label="Họ và tên *"
						value={form.fullName}
						name="fullName"
						onChange={handleChange}
						placeholder="Nguyễn Văn A"
						error={fieldErrors.fullName}
					/>

					<Input
						label="Email *"
						value={form.email}
						name="email"
						onChange={handleChange}
						placeholder="example@sotietkiem.com"
						error={fieldErrors.email}
					/>

					<Input
						label="Mật khẩu *"
						type="password"
						value={form.password}
						name="password"
						onChange={handleChange}
						placeholder="••••••••"
						error={fieldErrors.password}
						showTogglePassword
					/>

					<Input
						label="Xác nhận mật khẩu *"
						type="password"
						value={form.confirmPassword}
						name="confirmPassword"
						onChange={handleChange}
						placeholder="••••••••"
						error={fieldErrors.confirmPassword}
						showTogglePassword
					/>
					{/* Error */}
					{error && (
						<div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
							{error}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
					<Button onClick={onClose} variant="secondary">
						Hủy
					</Button>
					<Button onClick={handleSubmit} isLoading={loading}>
						Tạo tài khoản
					</Button>
				</div>
			</div>
		</div>
	);
}

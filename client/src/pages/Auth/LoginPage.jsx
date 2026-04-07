import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPiggyBank, LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { useAuth } from '../../contexts/UseAuth';
import { toast } from 'react-toastify';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [fieldErrors, setFieldErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setFieldErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError('');
			setFieldErrors({});
			const response = await login(form.email, form.password);
			toast.success(response.message);
			navigate('/tra-cuu');
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
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="w-full max-w-sm">
				{/* Logo */}
				<div className="flex flex-col items-center mb-8">
					<div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
						<LuPiggyBank size={24} className="text-white" />
					</div>
					<h1 className="text-xl font-semibold text-gray-800">
						Sổ Tiết Kiệm
					</h1>
					<p className="text-sm text-gray-400 mt-1">
						Đăng nhập để tiếp tục
					</p>
				</div>

				{/* Card */}
				<div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email */}
						<Input
							label="Email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="example@gmail.com"
							type="text"
							error={fieldErrors.email}
						/>

						{/* Password */}
						<Input
							label="Mật khẩu"
							name="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							placeholder="••••••••"
							error={fieldErrors.password}
							showTogglePassword
						/>

						{/* Error */}
						{error && (
							<div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
								{error}
							</div>
						)}

						{/* Submit */}
						<Button
							type="submit"
							disabled={loading}
							fullWidth
							isLoading={loading}
						>
							{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</form>
				</div>

				<p className="text-center text-xs text-gray-400 mt-6">
					Chưa có tài khoản? Hãy liên hệ quản trị viên.
				</p>
			</div>
		</div>
	);
}

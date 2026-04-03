import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPiggyBank, LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { useAuth } from '../../contexts/UseAuth';
import { toast } from 'react-toastify';

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
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
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1.5">
								Email
							</label>
							<input
								type="text"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="example@sotietkiem.com"
								autoComplete="email"
								className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors placeholder:text-gray-300"
							/>
							{fieldErrors.email && (
								<p className="text-xs text-red-500 mt-1">
									{fieldErrors.email}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1.5">
								Mật khẩu
							</label>
							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									name="password"
									value={form.password}
									onChange={handleChange}
									placeholder="••••••••"
									autoComplete="current-password"
									className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors placeholder:text-gray-300"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									{showPassword ? (
										<LuEyeOff size={15} />
									) : (
										<LuEye size={15} />
									)}
								</button>
							</div>
							{fieldErrors.password && (
								<p className="text-xs text-red-500 mt-1">
									{fieldErrors.password}
								</p>
							)}
						</div>

						{/* Error */}
						{error && (
							<div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
								{error}
							</div>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
						>
							{loading ? (
								<>
									<LuLoader
										size={14}
										className="animate-spin"
									/>
									Đang đăng nhập...
								</>
							) : (
								'Đăng nhập'
							)}
						</button>
					</form>
				</div>

				<p className="text-center text-xs text-gray-400 mt-6">
					Chưa có tài khoản? Liên hệ quản trị viên.
				</p>
			</div>
		</div>
	);
}

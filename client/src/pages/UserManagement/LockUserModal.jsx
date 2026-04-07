import { useEffect } from 'react';
import { LuLock, LuLockOpen, LuX, LuTriangleAlert } from 'react-icons/lu';

/**
 * LockUserModal
 *
 * Props:
 *  - isOpen       {boolean}   – controls visibility
 *  - onClose      {function}  – called when user cancels or clicks backdrop
 *  - onConfirm    {function}  – called when user clicks the confirm button
 *  - type         {'lock'|'unlock'}  – drives icon, colours & copy
 *  - userName     {string}    – displayed in the message
 *  - loading      {boolean}   – disables buttons while API is in-flight
 */
export default function LockUserModal({
	isOpen,
	onClose,
	onConfirm,
	type = 'lock',
	userName = '',
	loading = false,
}) {
	// Close on Escape key
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e) => e.key === 'Escape' && onClose();
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const config = {
		lock: {
			icon: <LuLock size={20} />,
			iconWrap: 'bg-red-50 text-red-500',
			title: 'Khoá tài khoản',
			message: (
				<>
					Bạn có chắc muốn <strong>khoá</strong> tài khoản của{' '}
					<strong>{userName}</strong>? Tài khoản này sẽ không thể đăng
					nhập cho đến khi được mở khoá.
				</>
			),
			confirmLabel: 'Khoá tài khoản',
			confirmClass:
				'bg-red-500 hover:bg-red-600 focus:ring-red-200 text-white',
		},
		unlock: {
			icon: <LuLockOpen size={20} />,
			iconWrap: 'bg-green-50 text-green-600',
			title: 'Mở khoá tài khoản',
			message: (
				<>
					Bạn có chắc muốn <strong>mở khoá</strong> tài khoản của{' '}
					<strong>{userName}</strong>? Tài khoản này sẽ có thể đăng
					nhập trở lại.
				</>
			),
			confirmLabel: 'Mở khoá',
			confirmClass:
				'bg-green-600 hover:bg-green-700 focus:ring-green-200 text-white',
		},
	};

	const { icon, iconWrap, title, message, confirmLabel, confirmClass } =
		config[type];

	return (
		/* Backdrop */
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			onClick={onClose}
		>
			{/* Dim overlay */}
			<div className="absolute inset-0 bg-black/30" />

			{/* Panel */}
			<div
				className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
					<div className="flex items-center gap-3">
						{/* Icon badge */}
						<span
							className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconWrap}`}
						>
							{icon}
						</span>
						<h2 className="text-sm font-semibold text-gray-800">
							{title}
						</h2>
					</div>
					<button
						onClick={onClose}
						disabled={loading}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
					>
						<LuX size={15} />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-4">
					{/* Warning strip */}
					<div className="flex items-start gap-2.5 mb-4 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
						<LuTriangleAlert
							size={14}
							className="text-amber-500 mt-0.5 flex-shrink-0"
						/>
						<p className="text-xs text-amber-700 leading-relaxed">
							Hành động này sẽ có hiệu lực ngay lập tức và có thể
							hoàn tác sau.
						</p>
					</div>

					{/* Message */}
					<p className="text-sm text-gray-600 leading-relaxed">
						{message}
					</p>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 px-5 pb-5">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
					>
						Huỷ
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${confirmClass}`}
					>
						{loading ? 'Đang xử lý...' : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

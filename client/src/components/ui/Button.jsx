// components/ui/Button.jsx

/**
 * Button Component - Tái sử dụng linh hoạt
 *
 * Props:
 * @param {React.ReactNode}  children   - Nội dung hiển thị trong button
 * @param {React.ReactNode}  icon       - Icon hiển thị bên trái (tuỳ chọn)
 * @param {'primary'|'secondary'|'danger'|'ghost'|'outline'} variant - Kiểu button
 * @param {'sm'|'md'|'lg'}   size       - Kích thước button
 * @param {boolean}          isLoading  - Hiển thị trạng thái loading
 * @param {boolean}          disabled   - Vô hiệu hoá button
 * @param {string}           className  - Class tuỳ chỉnh thêm
 * @param {function}         onClick    - Hàm xử lý click
 * @param {'button'|'submit'|'reset'} type - Loại button (mặc định 'button')
 */

const variantStyles = {
	primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
	secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
	danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
	ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100',
	outline:
		'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
};

const sizeStyles = {
	sm: 'px-3 py-1.5 text-xs gap-1.5',
	md: 'px-4 py-2 text-sm gap-2',
	lg: 'px-5 py-2.5 text-base gap-2.5',
};

function Button({
	children,
	icon,
	variant = 'primary',
	size = 'md',
	isLoading = false,
	disabled = false,
	fullWidth = false,
	className = '',
	onClick,
	type = 'button',
}) {
	const isDisabled = disabled || isLoading;

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isDisabled}
			className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150 
		${fullWidth ? 'w-full' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
		>
			{isLoading ? (
				<svg
					className="animate-spin h-4 w-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8v8z"
					/>
				</svg>
			) : (
				icon && <span className="shrink-0">{icon}</span>
			)}
			{children}
		</button>
	);
}

export default Button;

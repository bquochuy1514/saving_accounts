// components/ui/Input.jsx
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

/**
 * Input Component - Tái sử dụng linh hoạt
 *
 * Props:
 * @param {string}           label             - Nhãn hiển thị phía trên input
 * @param {string}           name              - Tên field (dùng cho handleChange)
 * @param {string}           value             - Giá trị hiện tại
 * @param {function}         onChange          - Hàm xử lý thay đổi
 * @param {string}           placeholder       - Placeholder text
 * @param {'text'|'password'|'email'|'number'} type - Kiểu input (mặc định 'text')
 * @param {string}           error             - Thông báo lỗi (nếu có)
 * @param {React.ReactNode}  suffix            - Element hiển thị bên phải
 * @param {boolean}          showTogglePassword - Tự động thêm nút hiện/ẩn mật khẩu khi type='password'
 * @param {string}           autoComplete      - Giá trị autocomplete
 * @param {string}           className         - Class tuỳ chỉnh thêm cho thẻ input
 */

function Input({
	label,
	name,
	value,
	onChange,
	placeholder,
	type = 'text',
	error,
	showTogglePassword = false,
	className = '',
}) {
	const [visible, setVisible] = useState(false);

	const resolvedType = showTogglePassword
		? visible
			? 'text'
			: 'password'
		: type;

	return (
		<div>
			{label && (
				<label className="block text-xs font-medium text-gray-600 mb-1.5">
					{label}
				</label>
			)}

			<div className="relative">
				<input
					type={resolvedType}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`
                        w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                        bg-gray-50 focus:bg-white focus:outline-none
                        focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                        transition-colors placeholder:text-gray-300
                        ${error ? 'border-red-300 focus:ring-red-100 focus:border-red-400' : ''}
                        ${className}
                    `}
				/>

				{showTogglePassword && (
					<button
						type="button"
						onClick={() => setVisible((p) => !p)}
						tabIndex={-1}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
					>
						{visible ? <LuEyeOff size={15} /> : <LuEye size={15} />}
					</button>
				)}
			</div>

			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
		</div>
	);
}

export default Input;

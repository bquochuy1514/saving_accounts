import {
	LuChevronRight,
	LuChevronLeft,
	LuBanknote,
	LuCalendar,
	LuHash,
	LuCheck,
	LuClock,
	LuTrendingUp,
	LuFileText,
} from 'react-icons/lu';

function formatVND(value) {
	if (!value) return '';
	const num = parseInt(value.replace(/\D/g, ''), 10);
	if (isNaN(num)) return '';
	return num.toLocaleString('vi-VN');
}

export default function Step2({
	bookData,
	setBookData,
	onNext,
	onBack,
	savingsTypes,
}) {
	const handleAmountChange = (e) => {
		const raw = e.target.value.replace(/\D/g, '');
		setBookData({ ...bookData, amountRaw: raw });
	};

	const selectedType = savingsTypes.find(
		(t) => t.id === bookData.savingsTypeId,
	);

	return (
		<div className="space-y-4">
			{/* Chọn loại tiết kiệm */}
			<div className="bg-white border border-gray-200 rounded-xl p-6">
				<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
					Loại tiết kiệm <span className="text-red-400">*</span>
				</p>
				<div className="grid grid-cols-3 gap-3">
					{savingsTypes.map((type) => {
						const isSelected = bookData.savingsTypeId === type.id;
						return (
							<button
								key={type.id}
								onClick={() =>
									setBookData({
										...bookData,
										savingsTypeId: type.id,
									})
								}
								className={`text-left p-4 rounded-xl border transition-all cursor-pointer
									${isSelected ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
							>
								<div className="flex items-start justify-between mb-2">
									<span
										className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}
									>
										{type.name}
									</span>
									{isSelected && (
										<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
											<LuCheck
												size={11}
												className="text-white"
											/>
										</div>
									)}
								</div>
								<div className="flex items-center gap-1 mb-1">
									<LuTrendingUp
										size={11}
										className={
											isSelected
												? 'text-blue-500'
												: 'text-gray-400'
										}
									/>
									<span
										className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}
									>
										{type.interestRate}% / năm
									</span>
								</div>
								<div className="flex items-center gap-1">
									<LuClock
										size={11}
										className="text-gray-400"
									/>
									<span className="text-xs text-gray-400">
										{type.termMonths === 0
											? 'Rút sau 15 ngày'
											: `Kỳ hạn ${type.termMonths} tháng`}
									</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Thông tin sổ */}
			<div className="bg-white border border-gray-200 rounded-xl p-6">
				<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
					Thông tin sổ
				</p>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-gray-500 mb-1.5">
								Mã sổ <span className="text-red-400">*</span>
							</label>
							<div className="relative">
								<LuHash
									size={13}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={bookData.bookCode || ''}
									onChange={(e) =>
										setBookData({
											...bookData,
											bookCode: e.target.value,
										})
									}
									className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
								/>
							</div>
							<p className="text-xs text-gray-400 mt-1">
								Tự động sinh, có thể chỉnh sửa
							</p>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 mb-1.5">
								Ngày mở sổ{' '}
								<span className="text-red-400">*</span>
							</label>
							<div className="relative">
								<LuCalendar
									size={13}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="date"
									value={bookData.openDate || ''}
									onChange={(e) =>
										setBookData({
											...bookData,
											openDate: e.target.value,
										})
									}
									className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
								/>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1.5">
							Số tiền gởi ban đầu{' '}
							<span className="text-red-400">*</span>
						</label>
						<div className="relative">
							<LuBanknote
								size={13}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								value={
									bookData.amountRaw
										? formatVND(bookData.amountRaw)
										: ''
								}
								onChange={handleAmountChange}
								placeholder="1.000.000"
								className="w-full pl-8 pr-14 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
								VNĐ
							</span>
						</div>
						{selectedType && (
							<p className="text-xs text-gray-400 mt-1">
								Tối thiểu{' '}
								{selectedType.minInitDeposit.toLocaleString(
									'vi-VN',
								)}
								đ
							</p>
						)}
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1.5">
							Ghi chú
						</label>
						<div className="relative">
							<LuFileText
								size={13}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<textarea
								value={bookData.note || ''}
								onChange={(e) =>
									setBookData({
										...bookData,
										note: e.target.value,
									})
								}
								placeholder="Ghi chú tuỳ chọn..."
								rows={2}
								className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
				>
					<LuChevronLeft size={14} /> Quay lại
				</button>
				<button
					onClick={onNext}
					disabled={
						!bookData.savingsTypeId ||
						!bookData.bookCode ||
						!bookData.openDate ||
						!bookData.amountRaw
					}
					className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
				>
					Xem xác nhận <LuChevronRight size={14} />
				</button>
			</div>
		</div>
	);
}

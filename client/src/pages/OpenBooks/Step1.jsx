import { useState } from 'react';
import {
	LuCheck,
	LuChevronRight,
	LuIdCard,
	LuMapPin,
	LuSearch,
	LuUser,
} from 'react-icons/lu';
import { getCustomerByIdNumber } from '../../services/customer';
import Button from '../../components/ui/Button';

export default function Step1({ data, setData, onNext }) {
	const [mode, setMode] = useState('new'); // 'new' | 'existing'
	const [searchId, setSearchId] = useState('');
	const [searchResult, setSearchResult] = useState(null);
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState(null);

	const handleSearch = async (idNumber) => {
		if (!searchId) return;
		setSearching(true);
		setSearchResult(null);
		setError(null);
		try {
			const res = await getCustomerByIdNumber(idNumber);
			const data = res.data;
			setSearchResult({ ...data, isExisting: true });
		} catch (err) {
			setError(err.message);
		} finally {
			setSearching(false);
		}
	};

	const handleSelectExisting = () => {
		if (searchResult) {
			setData({ ...searchResult, isExisting: true });
			onNext();
		}
	};

	const handleSubmitNew = () => {
		if (data.fullName && data.idNumber && data.address) onNext();
	};

	return (
		<div>
			{/* Toggle */}
			<div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
				{[
					{ key: 'new', label: 'Khách hàng mới' },
					{ key: 'existing', label: 'Khách hàng cũ' },
				].map((m) => (
					<Button
						variant="secondary"
						key={m.key}
						onClick={() => {
							setMode(m.key);
							if (m.key === 'new') {
								setData({
									fullName: '',
									idNumber: '',
									address: '',
									isExisting: false,
								});
							}
							if (m.key === 'existing') {
								setSearchResult(null);
								setError(null);
								setSearchId('');
							}
						}}
						className={`${mode === m.key ? 'bg-white text-gray-800 shadow-sm ' : 'text-gray-500 hover:text-gray-700'}`}
					>
						{m.label}
					</Button>
				))}
			</div>

			{mode === 'new' ? (
				<div className="bg-white border border-gray-200 rounded-xl p-6">
					<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
						Thông tin cá nhân
					</p>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-medium text-gray-500 mb-1.5">
									Họ và tên{' '}
									<span className="text-red-400">*</span>
								</label>
								<div className="relative">
									<LuUser
										size={13}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										value={data.fullName || ''}
										onChange={(e) =>
											setData({
												...data,
												fullName: e.target.value,
											})
										}
										placeholder="Nguyễn Văn A"
										className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
									/>
								</div>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 mb-1.5">
									Số CMND / CCCD{' '}
									<span className="text-red-400">*</span>
								</label>
								<div className="relative">
									<LuIdCard
										size={13}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										value={data.idNumber || ''}
										onChange={(e) =>
											setData({
												...data,
												idNumber: e.target.value,
											})
										}
										placeholder="012345678901"
										className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
									/>
								</div>
							</div>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 mb-1.5">
								Địa chỉ <span className="text-red-400">*</span>
							</label>
							<div className="relative">
								<LuMapPin
									size={13}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={data.address || ''}
									onChange={(e) =>
										setData({
											...data,
											address: e.target.value,
										})
									}
									placeholder="123 Đường ABC, Quận 1, TP.HCM"
									className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end mt-6">
						<Button
							onClick={handleSubmitNew}
							disabled={
								!data.fullName ||
								!data.idNumber ||
								!data.address
							}
						>
							Tiếp theo <LuChevronRight size={14} />
						</Button>
					</div>
				</div>
			) : (
				<div className="bg-white border border-gray-200 rounded-xl p-6">
					<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
						Tra cứu theo CMND / CCCD
					</p>
					<div className="flex gap-2 mb-5">
						<div className="relative flex-1">
							<LuSearch
								size={13}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								value={searchId}
								onChange={(e) => setSearchId(e.target.value)}
								placeholder="Nhập số CMND/CCCD..."
								className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
							/>
						</div>
						<Button
							onClick={() => {
								handleSearch(searchId);
							}}
							disabled={!searchId || searching}
							variant="primary"
						>
							{searching ? 'Đang tìm...' : 'Tìm kiếm'}
						</Button>
					</div>

					{error && (
						<div className="border border-red-200 bg-red-50 rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
							<span className="text-xs text-red-500 font-medium">
								{error}
							</span>
						</div>
					)}

					{searchResult && (
						<div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-5">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
									<LuCheck size={12} className="text-white" />
								</div>
								<span className="text-xs font-medium text-green-700">
									Tìm thấy khách hàng
								</span>
							</div>
							<div className="space-y-1.5 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-500">
										Họ và tên
									</span>
									<span className="font-medium text-gray-800">
										{searchResult.fullName}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">CMND</span>
									<span className="font-medium text-gray-800">
										{searchResult.idNumber}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">
										Địa chỉ
									</span>
									<span className="font-medium text-gray-800">
										{searchResult.address}
									</span>
								</div>
							</div>
						</div>
					)}

					<div className="flex justify-end">
						<Button
							onClick={handleSelectExisting}
							disabled={!searchResult}
						>
							Chọn khách hàng này
							<LuChevronRight size={14} />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

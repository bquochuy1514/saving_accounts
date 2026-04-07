import { useEffect, useState } from 'react';
import { LuChevronLeft, LuBookOpen, LuCheck } from 'react-icons/lu';
import PageHeader from '../../components/ui/PageHeader';
import Step1 from './Step1';
import Step2 from './Step2';
import { getSavingsTypes } from '../../services/savings-type';

function today() {
	return new Date().toISOString().split('T')[0];
}

function generateBookCode() {
	const year = new Date().getFullYear();
	const rand = String(Math.floor(Math.random() * 9000) + 1000);
	return `STK-${year}-${rand}`;
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current }) {
	const steps = [
		{ num: 1, label: 'Khách hàng' },
		{ num: 2, label: 'Sổ tiết kiệm' },
		{ num: 3, label: 'Xác nhận' },
	];
	return (
		<div className="flex items-center gap-0 mb-8">
			{steps.map((s, i) => {
				const isDone = current > s.num;
				const isActive = current === s.num;
				return (
					<div key={s.num} className="flex items-center">
						<div className="flex items-center gap-2.5">
							<div
								className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all
									${isDone ? 'bg-green-600 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
							>
								{isDone ? <LuCheck size={13} /> : s.num}
							</div>
							<span
								className={`text-sm ${isActive ? 'text-gray-800 font-medium' : isDone ? 'text-gray-500' : 'text-gray-400'}`}
							>
								{s.label}
							</span>
						</div>
						{i < steps.length - 1 && (
							<div className="w-12 h-px bg-gray-200 mx-3 flex-shrink-0" />
						)}
					</div>
				);
			})}
		</div>
	);
}

// ── Step 3: Xác nhận ──────────────────────────────────────────────────────────
function Step3({ customerData, bookData, onBack, onSubmit, loading }) {
	const selectedType = SAVINGS_TYPES.find(
		(t) => t.id === bookData.savingsTypeId,
	);

	const InfoRow = ({ label, value, highlight }) => (
		<div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
			<span className="text-sm text-gray-500">{label}</span>
			<span
				className={`text-sm font-medium ${highlight ? 'text-blue-600' : 'text-gray-800'}`}
			>
				{value}
			</span>
		</div>
	);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				{/* Khách hàng */}
				<div className="bg-white border border-gray-200 rounded-xl p-5">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
							{customerData.fullName
								?.split(' ')
								.slice(-2)
								.map((w) => w[0])
								.join('')
								.toUpperCase()}
						</div>
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
							Khách hàng
						</p>
					</div>
					<InfoRow label="Họ và tên" value={customerData.fullName} />
					<InfoRow label="CMND/CCCD" value={customerData.idNumber} />
					<InfoRow label="Địa chỉ" value={customerData.address} />
				</div>

				{/* Sổ tiết kiệm */}
				<div className="bg-white border border-gray-200 rounded-xl p-5">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
							<LuBookOpen size={14} />
						</div>
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
							Sổ tiết kiệm
						</p>
					</div>
					<InfoRow label="Mã sổ" value={bookData.bookCode} />
					<InfoRow
						label="Loại tiết kiệm"
						value={selectedType?.name}
					/>
					<InfoRow
						label="Ngày mở"
						value={new Date(bookData.openDate).toLocaleDateString(
							'vi-VN',
						)}
					/>
				</div>
			</div>

			{/* Tóm tắt tài chính */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
				<p className="text-xs font-medium text-blue-500 uppercase tracking-wider mb-4">
					Tóm tắt
				</p>
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<p className="text-xs text-blue-400 mb-1">
							Số tiền gởi
						</p>
						<p className="text-base font-semibold text-blue-700">
							{parseInt(bookData.amountRaw).toLocaleString(
								'vi-VN',
							)}
							đ
						</p>
					</div>
					<div>
						<p className="text-xs text-blue-400 mb-1">Lãi suất</p>
						<p className="text-base font-semibold text-blue-700">
							{selectedType?.interestRate}% / năm
						</p>
					</div>
					<div>
						<p className="text-xs text-blue-400 mb-1">Kỳ hạn</p>
						<p className="text-base font-semibold text-blue-700">
							{selectedType?.termMonths === 0
								? 'Không kỳ hạn'
								: `${selectedType?.termMonths} tháng`}
						</p>
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
					onClick={onSubmit}
					disabled={loading}
					className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
				>
					{loading ? (
						'Đang xử lý...'
					) : (
						<>
							<LuCheck size={14} /> Xác nhận mở sổ
						</>
					)}
				</button>
			</div>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OpenSavingsBook() {
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [savingsTypes, setSavingsTypes] = useState([]);

	const [customerData, setCustomerData] = useState({
		fullName: '',
		idNumber: '',
		address: '',
		isExisting: false,
	});

	const [bookData, setBookData] = useState({
		savingsTypeId: null,
		bookCode: generateBookCode(),
		openDate: today(),
		amountRaw: '',
		note: '',
	});

	const handleSubmit = () => {
		setLoading(true);
		// TODO: gọi API
		setTimeout(() => setLoading(false), 1500);
	};

	const fetchSavingsTypes = async () => {
		try {
			setLoading(true);
			const response = await getSavingsTypes();
			console.log(response);
			setSavingsTypes(response.data);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSavingsTypes();
	}, []);

	return (
		<div className="p-6">
			{/* Header */}
			<PageHeader
				icon={LuBookOpen}
				title={'Mở sổ tiết kiệm'}
				badge={'BM1'}
				subtitle={'Đăng ký khách hàng và tạo sổ tiết kiệm mới'}
			/>

			<StepBar current={step} />

			{step === 1 && (
				<Step1
					data={customerData}
					setData={setCustomerData}
					onNext={() => setStep(2)}
				/>
			)}
			{step === 2 && (
				<Step2
					bookData={bookData}
					setBookData={setBookData}
					savingsTypes={savingsTypes}
					onNext={() => setStep(3)}
					onBack={() => {
						setStep(1);
						setCustomerData({
							fullName: '',
							idNumber: '',
							address: '',
							isExisting: false,
						});
					}}
				/>
			)}
			{step === 3 && (
				<Step3
					customerData={customerData}
					bookData={bookData}
					onBack={() => setStep(2)}
					onSubmit={handleSubmit}
					loading={loading}
				/>
			)}
		</div>
	);
}

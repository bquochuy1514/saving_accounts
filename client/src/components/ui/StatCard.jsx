// components/ui/StatCard.jsx
export default function StatCard({ label, value, color }) {
	return (
		<div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
			<div className="text-xs text-gray-400 mb-1">{label}</div>
			<div
				className={`text-xl font-semibold ${color ?? 'text-gray-800'}`}
			>
				{value}
			</div>
		</div>
	);
}

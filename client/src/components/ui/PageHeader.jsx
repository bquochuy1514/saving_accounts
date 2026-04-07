// components/ui/PageHeader.jsx
export default function PageHeader({
	title,
	subtitle,
	action,
	icon: Icon,
	badge,
}) {
	return (
		<div className="flex items-start justify-between mb-6">
			<div>
				<div className="flex items-center gap-2.5 mb-1">
					{Icon && <Icon size={18} className="text-blue-500" />}
					<h1 className="text-xl font-semibold text-gray-800">
						{title}
					</h1>
					{badge && (
						<span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100">
							{badge}
						</span>
					)}
				</div>
				{subtitle && (
					<p className="text-sm text-gray-400">{subtitle}</p>
				)}
			</div>
			{action && <div>{action}</div>}
		</div>
	);
}

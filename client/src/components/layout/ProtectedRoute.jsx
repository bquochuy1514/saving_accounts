import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/UseAuth';

export default function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();

	// Đang khởi tạo auth (đọc token từ localStorage) → chờ, không redirect vội
	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center text-sm text-gray-400">
				Đang tải...
			</div>
		);
	}

	// Chưa đăng nhập → về login
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Đã đăng nhập → render các route con
	return <Outlet />;
}

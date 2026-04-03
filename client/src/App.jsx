import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import RegisterPage from './pages/Auth/RegisterPage';
import OpenSavingsBook from './pages/OpenBooks/OpenSavingsBook';
import AdditionalDeposit from './pages/AdditionalDeposit/AdditionalDeposit';
import SavingsList from './pages/SavingsList/SavingsList';
import WithdrawalDeposit from './pages/WithdrawalDeposit/WithdrawalDeposit';
import ReportPage from './pages/Report/ReportPage';
import RegulationsSettings from './pages/RegulationsSettings/RegulationsSettings';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<MainLayout />}>
							<Route
								index
								element={<Navigate to="/tra-cuu" replace />}
							/>

							<Route path="tra-cuu" element={<SavingsList />} />
							<Route path="mo-so" element={<OpenSavingsBook />} />
							<Route
								path="gui-tien"
								element={<AdditionalDeposit />}
							/>
							<Route
								path="rut-tien"
								element={<WithdrawalDeposit />}
							/>
							<Route path="bao-cao" element={<ReportPage />} />
							<Route
								path="quy-dinh"
								element={<RegulationsSettings />}
							/>
						</Route>
					</Route>

					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Routes>

				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</BrowserRouter>
		</>
	);
}

export default App;

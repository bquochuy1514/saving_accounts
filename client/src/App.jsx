import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import OpenSavingsBook from './pages/OpenBooks/OpenSavingsBook';
import AdditionalDeposit from './pages/AdditionalDeposit/AdditionalDeposit';
import SavingsList from './pages/SavingsList/SavingsList';
import WithdrawalDeposit from './pages/WithdrawalDeposit/WithdrawalDeposit';
import RegulationsSettings from './pages/RegulationsSettings/RegulationsSettings';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/layout/ProtectedRoute';
import UserManagement from './pages/UserManagement/UserManagement';
import DailyActivityPage from './pages/Report/DailyActivityPage/DailyActivityPage';
import MonthlyBooksPage from './pages/Report/MonthlyBooksPage/MonthlyBooksPage';

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
							<Route
								path="bao-cao/doanh-so"
								element={<DailyActivityPage />}
							/>
							<Route
								path="bao-cao/mo-dong-so"
								element={<MonthlyBooksPage />}
							/>
							<Route
								path="quy-dinh"
								element={<RegulationsSettings />}
							/>
							<Route
								path="quan-ly-nguoi-dung"
								element={<UserManagement />}
							/>
						</Route>
					</Route>

					<Route path="/login" element={<LoginPage />} />
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

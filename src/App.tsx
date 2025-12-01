import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Layout from './components/Layout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLayout from './components/AdminLayout';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminBannersPage from './pages/AdminBannersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminCalculatorPage from './pages/AdminCalculatorPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
              </Routes>
            </Layout>
          }
        />

        {/* Rotas de Admin */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/banners" element={<AdminBannersPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/calculator" element={<AdminCalculatorPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
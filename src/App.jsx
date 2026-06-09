import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { AppProvider } from './context/AppContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Food Pages
import FoodListPage from './pages/food/FoodListPage';
import FoodDetailPage from './pages/food/FoodDetailPage';

// Gear Pages
import GearListPage from './pages/gear/GearListPage';
import GearDetailPage from './pages/gear/GearDetailPage';
import GearSellPage from './pages/gear/GearSellPage';
import GearManagePage from './pages/gear/GearManagePage';
import GearLifecyclePage from './pages/gear/GearLifecyclePage';
import GearRentPage from './pages/gear/GearRentPage';

// Member Pages
import DashboardPage from './pages/member/DashboardPage';
import PassportPage from './pages/member/PassportPage';
import GymHistoryPage from './pages/member/GymHistoryPage';
import NewSessionPage from './pages/member/NewSessionPage';
import SessionDetailPage from './pages/member/SessionDetailPage';
import GymRecordsPage from './pages/member/GymRecordsPage';
import ExerciseProgressPage from './pages/member/ExerciseProgressPage';
import LeaderboardPage from './pages/member/LeaderboardPage';
import OrdersPage from './pages/member/OrdersPage';
import SocialPage from './pages/member/SocialPage';
import ProfilePage from './pages/member/ProfilePage';
import TDEEPage from './pages/member/TDEEPage';
import MacroDashboardPage from './pages/member/MacroDashboardPage';
import FitCoinPage from './pages/member/FitCoinPage';
import AiAssistantPage from './pages/member/AiAssistantPage';
import MembershipPage from './pages/member/MembershipPage';
import WeeklyChallengePage from './pages/member/WeeklyChallengePage';

// Vendor Pages
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorProductsPage from './pages/vendor/VendorProductsPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import VendorReviewsPage from './pages/vendor/VendorReviewsPage';
import VendorAnalyticsPage from './pages/vendor/VendorAnalyticsPage';

// Gym Owner Pages
import GymOwnerDashboardPage from './pages/gymOwner/GymOwnerDashboardPage';
import GymMembersPage from './pages/gymOwner/GymMembersPage';
import GymAnnouncementsPage from './pages/gymOwner/GymAnnouncementsPage';
import GymOwnerAnalyticsPage from './pages/gymOwner/GymOwnerAnalyticsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminVendorsPage from './pages/admin/AdminVendorsPage';
import AdminDisputesPage from './pages/admin/AdminDisputesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider><AppProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/food" element={<FoodListPage />} />
              <Route path="/food/:id" element={<FoodDetailPage />} />
              <Route path="/gear" element={<GearListPage />} />
              <Route path="/gear/:id" element={<GearDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>

            {/* App routes (require login) */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Member */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['member']}><DashboardPage /></ProtectedRoute>} />
              <Route path="/passport" element={<ProtectedRoute allowedRoles={['member']}><PassportPage /></ProtectedRoute>} />
              <Route path="/gym/history" element={<ProtectedRoute allowedRoles={['member']}><GymHistoryPage /></ProtectedRoute>} />
              <Route path="/gym/new-session" element={<ProtectedRoute allowedRoles={['member']}><NewSessionPage /></ProtectedRoute>} />
              <Route path="/gym/session/:id" element={<ProtectedRoute allowedRoles={['member']}><SessionDetailPage /></ProtectedRoute>} />
              <Route path="/gym/records" element={<ProtectedRoute allowedRoles={['member']}><GymRecordsPage /></ProtectedRoute>} />
              <Route path="/gym/progress" element={<ProtectedRoute allowedRoles={['member']}><ExerciseProgressPage /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['member']}><LeaderboardPage /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute allowedRoles={['member']}><AiAssistantPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute allowedRoles={['member']}><OrdersPage /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute allowedRoles={['member']}><SocialPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['member']}><ProfilePage /></ProtectedRoute>} />
              <Route path="/tdee" element={<ProtectedRoute allowedRoles={['member']}><TDEEPage /></ProtectedRoute>} />
              <Route path="/macro" element={<ProtectedRoute allowedRoles={['member']}><MacroDashboardPage /></ProtectedRoute>} />
              <Route path="/fitcoin" element={<ProtectedRoute allowedRoles={['member']}><FitCoinPage /></ProtectedRoute>} />
              <Route path="/membership" element={<ProtectedRoute allowedRoles={['member']}><MembershipPage /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute allowedRoles={['member']}><WeeklyChallengePage /></ProtectedRoute>} />

              {/* Gear — rent & lifecycle (accessible by members too) */}
              <Route path="/gear/:id/rent" element={<ProtectedRoute allowedRoles={['member']}><GearRentPage /></ProtectedRoute>} />
              <Route path="/gear/:id/lifecycle" element={<ProtectedRoute><GearLifecyclePage /></ProtectedRoute>} />

              {/* Gear listing: Gym Owner business + Member community seller */}
              <Route path="/gear/sell" element={<ProtectedRoute allowedRoles={['member', 'gymOwner']}><GearSellPage /></ProtectedRoute>} />
              <Route path="/gear/manage" element={<ProtectedRoute allowedRoles={['member', 'gymOwner']}><GearManagePage /></ProtectedRoute>} />

              {/* Vendor */}
              <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={['vendor']}><VendorDashboardPage /></ProtectedRoute>} />
              <Route path="/vendor/products" element={<ProtectedRoute allowedRoles={['vendor']}><VendorProductsPage /></ProtectedRoute>} />
              <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={['vendor']}><VendorOrdersPage /></ProtectedRoute>} />
              <Route path="/vendor/reviews" element={<ProtectedRoute allowedRoles={['vendor']}><VendorReviewsPage /></ProtectedRoute>} />
              <Route path="/vendor/analytics" element={<ProtectedRoute allowedRoles={['vendor']}><VendorAnalyticsPage /></ProtectedRoute>} />

              {/* Gym Owner */}
              <Route path="/gym-owner/dashboard" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerDashboardPage /></ProtectedRoute>} />
              <Route path="/gym-owner/members" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymMembersPage /></ProtectedRoute>} />
              <Route path="/gym-owner/analytics" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerAnalyticsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/announcements" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymAnnouncementsPage /></ProtectedRoute>} />

              {/* Gym Owner Admin */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminVendorsPage /></ProtectedRoute>} />
              <Route path="/admin/gear-disputes" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminDisputesPage /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminReportsPage /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AppProvider></AuthProvider>
    </BrowserRouter>
  );
}

export default App;

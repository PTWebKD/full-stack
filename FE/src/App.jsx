import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { AppProvider } from './context/AppContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// ─── Public ───────────────────────────────────────────────────────────────────
import LandingPage from './pages/public/LandingPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';

// ─── Auth ─────────────────────────────────────────────────────────────────────
import LoginPage from './pages/auth/LoginPage';

// ─── Nutrition (thay thế /food) ───────────────────────────────────────────────
import NutritionListPage from './pages/nutrition/NutritionListPage';
import NutritionDetailPage from './pages/nutrition/NutritionDetailPage';
import NutritionOrdersPage from './pages/nutrition/NutritionOrdersPage';

// ─── Gear (B2C) ───────────────────────────────────────────────────────────────
import GearListPage from './pages/gear/GearListPage';
import GearDetailPage from './pages/gear/GearDetailPage';
import GearRentPage from './pages/gear/GearRentPage';
import GearOtpPage from './pages/gear/GearOtpPage';
import GearMyRentalsPage from './pages/gear/GearMyRentalsPage';

// ─── Member ───────────────────────────────────────────────────────────────────
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
import ShippingAddressesPage from './pages/member/ShippingAddressesPage';
import OrderDetailPage from './pages/member/OrderDetailPage';

// ─── Journey ──────────────────────────────────────────────────────────────────
import JourneyPage from './pages/member/journey/JourneyPage';
import JourneySessionPage from './pages/member/journey/JourneySessionPage';
import JourneyProgressPage from './pages/member/journey/JourneyProgressPage';
import JourneyMilestonesPage from './pages/member/journey/JourneyMilestonesPage';
import JourneyProgramsPage from './pages/member/journey/JourneyProgramsPage';

// ─── Gym Owner ────────────────────────────────────────────────────────────────
import GymOwnerDashboardPage from './pages/gymOwner/GymOwnerDashboardPage';
import GymMembersPage from './pages/gymOwner/GymMembersPage';
import GymOwnerMemberDetailPage from './pages/gymOwner/GymOwnerMemberDetailPage';
import GymAnnouncementsPage from './pages/gymOwner/GymAnnouncementsPage';
import GymOwnerAnalyticsPage from './pages/gymOwner/GymOwnerAnalyticsPage';
import GymOwnerCareQueuePage from './pages/gymOwner/GymOwnerCareQueuePage';
import GymOwnerNutritionPOSPage from './pages/gymOwner/GymOwnerNutritionPOSPage';
import GymOwnerNutritionOrdersPage from './pages/gymOwner/GymOwnerNutritionOrdersPage';
import GymOwnerNutritionProductsPage from './pages/gymOwner/GymOwnerNutritionProductsPage';
import GymOwnerGearProductsPage from './pages/gymOwner/GymOwnerGearProductsPage';
import GymOwnerGearRentalsPage from './pages/gymOwner/GymOwnerGearRentalsPage';
import GymOwnerOrdersPage from './pages/gymOwner/GymOwnerOrdersPage';
import CheckinPage from './pages/member/CheckinPage';

// ─── Admin ────────────────────────────────────────────────────────────────────
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider><AppProvider>
        <CartProvider>
          <Routes>

            {/* ── PUBLIC ────────────────────────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />

              {/* Nutrition */}
              <Route path="/nutrition" element={<NutritionListPage />} />
              <Route path="/nutrition/:id" element={<NutritionDetailPage />} />

              {/* Gear catalog (public) */}
              <Route path="/gear" element={<GearListPage />} />
              <Route path="/gear/:id" element={<GearDetailPage />} />

              {/* Guest OTP xác thực (public — không cần đăng nhập) */}
              <Route path="/gear/otp" element={<GearOtpPage />} />

              {/* Cart & Checkout chung */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* ── AUTH ──────────────────────────────────────────────────────── */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<Navigate to="/#pricing-section" replace />} />
            </Route>

            {/* ── PROTECTED ─────────────────────────────────────────────────── */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

              {/* ── MEMBER ────────────────────────────────────────────────── */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['member']}><DashboardPage /></ProtectedRoute>} />
              <Route path="/passport" element={<ProtectedRoute allowedRoles={['member']}><PassportPage /></ProtectedRoute>} />
              <Route path="/membership" element={<ProtectedRoute allowedRoles={['member']}><MembershipPage /></ProtectedRoute>} />

              {/* Gym Tracking */}
              <Route path="/gym/history" element={<ProtectedRoute allowedRoles={['member']}><GymHistoryPage /></ProtectedRoute>} />
              <Route path="/gym/new-session" element={<ProtectedRoute allowedRoles={['member']}><NewSessionPage /></ProtectedRoute>} />
              <Route path="/gym/session/:id" element={<ProtectedRoute allowedRoles={['member']}><SessionDetailPage /></ProtectedRoute>} />
              <Route path="/gym/records" element={<ProtectedRoute allowedRoles={['member']}><GymRecordsPage /></ProtectedRoute>} />
              <Route path="/gym/progress" element={<ProtectedRoute allowedRoles={['member']}><ExerciseProgressPage /></ProtectedRoute>} />

              {/* Transformation Journey */}
              <Route path="/journey" element={<ProtectedRoute allowedRoles={['member']}><JourneyPage /></ProtectedRoute>} />
              <Route path="/journey/session" element={<ProtectedRoute allowedRoles={['member']}><JourneySessionPage /></ProtectedRoute>} />
              <Route path="/journey/progress" element={<ProtectedRoute allowedRoles={['member']}><JourneyProgressPage /></ProtectedRoute>} />
              <Route path="/journey/milestones" element={<ProtectedRoute allowedRoles={['member']}><JourneyMilestonesPage /></ProtectedRoute>} />
              <Route path="/journey/programs" element={<ProtectedRoute allowedRoles={['member']}><JourneyProgramsPage /></ProtectedRoute>} />

              {/* Nutrition (member-only: đặt trước & lịch sử) */}
              <Route path="/nutrition/orders" element={<ProtectedRoute allowedRoles={['member']}><NutritionOrdersPage /></ProtectedRoute>} />

              {/* Gear (member-only actions) */}
              <Route path="/gear/:id/rent" element={<ProtectedRoute allowedRoles={['member']}><GearRentPage /></ProtectedRoute>} />
              <Route path="/gear/my-rentals" element={<ProtectedRoute allowedRoles={['member']}><GearMyRentalsPage /></ProtectedRoute>} />

              {/* Misc Member */}
              <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['member']}><LeaderboardPage /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute allowedRoles={['member']}><AiAssistantPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute allowedRoles={['member']}><OrdersPage /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute allowedRoles={['member']}><SocialPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['member']}><ProfilePage /></ProtectedRoute>} />
              <Route path="/tdee" element={<ProtectedRoute allowedRoles={['member']}><TDEEPage /></ProtectedRoute>} />
              <Route path="/macro" element={<ProtectedRoute allowedRoles={['member']}><MacroDashboardPage /></ProtectedRoute>} />
              <Route path="/fitcoin" element={<ProtectedRoute allowedRoles={['member']}><FitCoinPage /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute allowedRoles={['member']}><WeeklyChallengePage /></ProtectedRoute>} />
              <Route path="/profile/addresses" element={<ProtectedRoute allowedRoles={['member']}><ShippingAddressesPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['member']}><OrderDetailPage /></ProtectedRoute>} />

              {/* ── GYM OWNER ─────────────────────────────────────────────── */}
              <Route path="/gym-owner/dashboard" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerDashboardPage /></ProtectedRoute>} />
              <Route path="/gym-owner/members" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymMembersPage /></ProtectedRoute>} />
              <Route path="/gym-owner/members/:id" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerMemberDetailPage /></ProtectedRoute>} />
              <Route path="/gym-owner/analytics" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerAnalyticsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/announcements" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymAnnouncementsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/care-queue" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerCareQueuePage /></ProtectedRoute>} />
              <Route path="/gym-owner/nutrition/pos" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerNutritionPOSPage /></ProtectedRoute>} />
              <Route path="/gym-owner/nutrition/orders" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerNutritionOrdersPage /></ProtectedRoute>} />
              <Route path="/gym-owner/nutrition/products" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerNutritionProductsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/gear/products" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerGearProductsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/gear/rentals" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerGearRentalsPage /></ProtectedRoute>} />
              <Route path="/gym-owner/orders" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerOrdersPage /></ProtectedRoute>} />
              <Route path="/checkin" element={<ProtectedRoute><CheckinPage /></ProtectedRoute>} />

              {/* ── ADMIN (Gym Owner đóng vai) ─────────────────────────────── */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['gymOwner']}><AdminReportsPage /></ProtectedRoute>} />

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </CartProvider>
      </AppProvider></AuthProvider>
    </BrowserRouter>
  );
}

export default App;

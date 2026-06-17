import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';
// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explorer from './pages/Explorer';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import BidList from './pages/BidList';
import MyGigs from './pages/MyGigs';
import CreateGig from './pages/CreateGig';
import Requests from './pages/Requests';
import StudentDetails from './pages/StudentDetails';
import TeacherDetails from './pages/TeacherDetails';
import ChatPage from './pages/ChatPage';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import EditGig from './pages/EditGig';
import GroupChat from './pages/GroupChat';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/RestPassword'
import ForgotUsername from './pages/ForgotUsername';

const queryClient = new QueryClient();

// 🔹 Layout wrapper that hides Navbar/Footer on login/signup
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      {!hideLayout && <Navbar />}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      {!hideLayout && <Footer />}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route path="/forgot-username" element={<ForgotUsername/>} />
                
                {/* Student Only */}
                <Route path="/explorer" element={
                  <ProtectedRoute requireRole="STUDENT">
                    <Explorer />
                  </ProtectedRoute>
                } />
                <Route path="/student-dashboard" element={
                  <ProtectedRoute requireRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/bid-list" element={
                  <ProtectedRoute requireRole="STUDENT">
                    <BidList />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute requireRole="STUDENT">
                    <Wishlist />
                  </ProtectedRoute>
                } />
                
                {/* Teacher Only */}
                <Route path="/teacher-dashboard" element={
                  <ProtectedRoute requireRole="TUTOR">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/my-gigs" element={
                  <ProtectedRoute requireRole="TUTOR">
                    <MyGigs />
                  </ProtectedRoute>
                } />
                <Route path="/create-gig" element={
                  <ProtectedRoute requireRole="TUTOR">
                    <CreateGig />
                  </ProtectedRoute>
                } />
                 <Route path="/edit-gig/:id" element={
                  <ProtectedRoute requireRole="TUTOR">
                    <EditGig />
                  </ProtectedRoute>
                } />
                <Route path="/requests" element={
                  <ProtectedRoute requireRole="TUTOR">
                    <Requests />
                  </ProtectedRoute>
                } />
                
                {/* Both Roles */}
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:chatsId" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                 <Route path="/chat/create-group/:groupchatId" element={
                  <ProtectedRoute>
                    <GroupChat/>
                  </ProtectedRoute>
                } />
                <Route path="/student-details/:studentUsername" element={
                  <ProtectedRoute>
                    <StudentDetails />
                  </ProtectedRoute>
                } />
                <Route path="/teacher-details/:teacherusername" element={
                  <ProtectedRoute>
                    <TeacherDetails />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

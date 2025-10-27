
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import AiAssistant from './pages/shared/AiAssistant';
import ViewDocuments from './pages/shared/ViewDocuments';
import UploadDocument from './pages/doctor/UploadDocument';
import AuditLog from './pages/admin/AuditLog';
import VerifyDocument from './pages/patient/VerifyDocument';
import ManageUsers from './pages/admin/ManageUsers';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
};

const MainRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<DashboardRedirect />} />
          
          {/* Admin Routes */}
          <Route path="admin-dashboard" element={<ProtectedRoute allowedRoles={[UserRole.Admin]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="audit-log" element={<ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Auditor]}><AuditLog /></ProtectedRoute>} />
          <Route path="manage-users" element={<ProtectedRoute allowedRoles={[UserRole.Admin]}><ManageUsers /></ProtectedRoute>} />

          {/* Doctor Routes */}
          <Route path="doctor-dashboard" element={<ProtectedRoute allowedRoles={[UserRole.Doctor]}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="upload" element={<ProtectedRoute allowedRoles={[UserRole.Doctor]}><UploadDocument /></ProtectedRoute>} />

          {/* Patient Routes */}
          <Route path="patient-dashboard" element={<ProtectedRoute allowedRoles={[UserRole.Patient]}><PatientDashboard /></ProtectedRoute>} />
          <Route path="verify" element={<ProtectedRoute allowedRoles={[UserRole.Patient]}><VerifyDocument /></ProtectedRoute>} />

          {/* Shared Routes */}
          <Route path="documents" element={<ViewDocuments />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

const DashboardRedirect: React.FC = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case UserRole.Admin:
            return <Navigate to="/admin-dashboard" />;
        case UserRole.Doctor:
            return <Navigate to="/doctor-dashboard" />;
        case UserRole.Patient:
            return <Navigate to="/patient-dashboard" />;
        case UserRole.Researcher:
        case UserRole.Auditor:
            return <Navigate to="/documents" />;
        default:
            return <Navigate to="/login" />;
    }
}


export default App;
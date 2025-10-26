
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
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="documents" element={<ViewDocuments />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="verify" element={<VerifyDocument />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="audit-log" element={<AuditLog />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

const DashboardRedirect: React.FC = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'Admin':
            return <Navigate to="/admin-dashboard" />;
        case 'Doctor':
            return <Navigate to="/doctor-dashboard" />;
        case 'Patient':
            return <Navigate to="/patient-dashboard" />;
        default:
            return <Navigate to="/login" />;
    }
}


export default App;
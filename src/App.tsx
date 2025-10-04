import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";
import Inventory from "./pages/admin/Inventory";
import Transactions from "./pages/admin/Transactions";
import PatientDashboard from "./pages/patient/PatientDashboard";
import Auth from "./pages/Auth";
import AdminSetup from "./pages/AdminSetup";
import AuthDebug from "./pages/AuthDebug";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Layout>
          <Routes>
            {/* Root route is now the admin dashboard */}
            <Route path="/" element={
              <RoleBasedRoute requiredRole="admin">
                <Dashboard />
              </RoleBasedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/auth-debug" element={<AuthDebug />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Patient Routes */}
            <Route path="/patient" element={
              <RoleBasedRoute requiredRole="patient">
                <PatientDashboard />
              </RoleBasedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RoleBasedRoute requiredRole="admin">
                <Dashboard />
              </RoleBasedRoute>
            } />
            <Route path="/admin/patients" element={
              <RoleBasedRoute requiredRole="admin">
                <Patients />
              </RoleBasedRoute>
            } />
            <Route path="/admin/appointments" element={
              <RoleBasedRoute requiredRole="admin">
                <Appointments />
              </RoleBasedRoute>
            } />
            <Route path="/admin/inventory" element={
              <RoleBasedRoute requiredRole="admin">
                <Inventory />
              </RoleBasedRoute>
            } />
            <Route path="/admin/transactions" element={
              <RoleBasedRoute requiredRole="admin">
                <Transactions />
              </RoleBasedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
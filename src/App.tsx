import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/public/Home";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import PatientDashboard from "./pages/patient/PatientDashboard";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
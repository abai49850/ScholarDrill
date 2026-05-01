import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Practice from "./pages/Practice.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminQuestionsList from "./pages/admin/AdminQuestionsList.tsx";
import AdminQuestionForm from "./pages/admin/AdminQuestionForm.tsx";
import AdminQuestionTest from "./pages/admin/AdminQuestionTest.tsx";
import AdminQuestionGenerator from "./pages/admin/AdminQuestionGenerator.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/practice"
                element={<ProtectedRoute><Practice /></ProtectedRoute>}
              />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}
              >
                <Route index element={<AdminOverview />} />
                <Route path="questions" element={<AdminQuestionsList />} />
                <Route path="generate" element={<AdminQuestionGenerator />} />
                <Route path="questions/new" element={<AdminQuestionForm />} />
                <Route path="questions/:id" element={<AdminQuestionForm />} />
                <Route path="questions/:id/test" element={<AdminQuestionTest />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

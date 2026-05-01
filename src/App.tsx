import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Practice from "./pages/Practice.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminQuestionsList from "./pages/admin/AdminQuestionsList.tsx";
import AdminQuestionForm from "./pages/admin/AdminQuestionForm.tsx";
import AdminQuestionTest from "./pages/admin/AdminQuestionTest.tsx";
import AdminQuestionGenerator from "./pages/admin/AdminQuestionGenerator.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProfileProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
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
        </BrowserRouter>
      </TooltipProvider>
    </UserProfileProvider>
  </QueryClientProvider>
);

export default App;

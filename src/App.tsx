import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Components/Home";
import AuthPage from "./Components/Auth";
import ResetPassword from "./Components/Resetpassword";
import AdminDashboard from "./Components/AdminDashboard";
import UserProfile from "./Components/UserProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import MenuPage from "./Components/MenuPage";
import AboutPage from "./Components/AboutPage";
import ContactPage from "./Components/ContactPage";
import HowItWorksPage from "./Components/Howitworkspage";
import CareersPage from "./Components/Careerspage";
import BlogPage from "./Components/BlogPage";
import VerifyEmail from "./Components/VerifyEmail";
import AuthSuccess from "./Components/AuthSucess";



function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh" width="100vw" bg="white" direction="column" gap={6}>
        <Spinner thickness="4px" speed="0.85s" emptyColor="gray.200" color="#6b8f3f" size="xl" />
        <Text fontSize="lg" color="gray.600" fontWeight="medium">
          Preparing your healthy meals...
        </Text>
      </Flex>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"               element={<Home />} />
      <Route path="/auth/success"   element={<AuthSuccess />} />
      <Route path="/auth"           element={<AuthPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/howitworks" element={<HowItWorksPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/blog" element={<BlogPage />} />
      {/* <Route path="/auth/success"   element={<AuthSuccess />} /> */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes */}
      <Route path="/profile" element={
        <ProtectedRoute><UserProfile /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}
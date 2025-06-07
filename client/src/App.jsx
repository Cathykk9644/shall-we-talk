import React from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotificationPage from "./pages/NotificationPage";
import ChatPage from "./pages/ChatPage";
import VideoCallPage from "./pages/VideoCallPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "./config/axios.js";
import PageLoader from "./components/PageLoader.jsx";

const App = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["authenticatedUser"],

    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");

      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;

  if (isLoading) return <PageLoader />;

  // todo fix the protected routes later
  return (
    <div className="bg-blue-300 h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={authUser && <OnboardingPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/videocall" element={<VideoCallPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

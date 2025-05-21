import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotificationPage from "./pages/NotificationPage";
import ChatPage from "./pages/ChatPage";
import VideoCallPage from "./pages/VideoCallPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const App = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],

    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");

      return res.data;
    },
  });

  console.log(data);
  console.log(isLoading);
  console.log(error);

  return (
    <div className="bg-blue-300 h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/videocall" element={<VideoCallPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

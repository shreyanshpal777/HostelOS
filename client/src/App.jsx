import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Console from '@/Console';
import PageNotFound from '@/lib/PageNotFound';
import UserManagement from '@/pages/features/UserManagement';
import WhatsAppCommunication from '@/pages/features/WhatsAppCommunication';
import RoleBasedLeadership from '@/pages/features/RoleBasedLeadership';
import EducationHub from '@/pages/features/EducationHub';
import TaskManagement from '@/pages/features/TaskManagement';
import Notifications from '@/pages/features/Notifications';
import AITaskCategorization from '@/pages/features/AITaskCategorization';
import AIComplaintBot from '@/pages/features/AIComplaintBot';
import AISentimentDetection from '@/pages/features/AISentimentDetection';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/console" element={<Console />} />
        <Route path="/features/user-management" element={<UserManagement />} />
        <Route path="/features/whatsapp-communication" element={<WhatsAppCommunication />} />
        <Route path="/features/role-based-leadership" element={<RoleBasedLeadership />} />
        <Route path="/features/education-hub" element={<EducationHub />} />
        <Route path="/features/task-management" element={<TaskManagement />} />
        <Route path="/features/notifications" element={<Notifications />} />
        <Route path="/features/ai-task-categorization" element={<AITaskCategorization />} />
        <Route path="/features/ai-complaint-bot" element={<AIComplaintBot />} />
        <Route path="/features/ai-sentiment-detection" element={<AISentimentDetection />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

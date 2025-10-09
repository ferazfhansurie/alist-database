import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import SocialMediaKOL from "./components/SocialMediaKOL";
import TwitterThreadKOL from "./components/TwitterThreadKOL";
import BloggerKOL from "./components/BloggerKOL";
import ProductionTalentKOL from "./components/ProductionTalentKOL";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <DatabaseProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <Dashboard />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/social-media" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <SocialMediaKOL />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/twitter-thread" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <TwitterThreadKOL />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/blogger" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <BloggerKOL />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/production-talent" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <ProductionTalentKOL />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <Settings />
                  </Box>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Box bg="white" minH="100vh">
                    <Navigation />
                    <Profile />
                  </Box>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </DatabaseProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import SocialMediaKOL from "./components/SocialMediaKOL";
import TwitterThreadKOL from "./components/TwitterThreadKOL";
import BloggerKOL from "./components/BloggerKOL";
import ProductionTalentKOL from "./components/ProductionTalentKOL";

const MotionBox = motion(Box);

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box bg="white" minH="100vh">
          <Navigation />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/social-media" element={<SocialMediaKOL />} />
              <Route path="/twitter-thread" element={<TwitterThreadKOL />} />
              <Route path="/blogger" element={<BloggerKOL />} />
              <Route path="/production-talent" element={<ProductionTalentKOL />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;

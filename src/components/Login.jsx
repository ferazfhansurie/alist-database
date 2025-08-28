import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
  HStack,
  useToast,
  Checkbox,
  useColorModeValue,
  Container
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import logoImage from "../assets/logo.png";
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.email && formData.password) {
        await login(formData.email, formData.password);
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate to the page they were trying to access, or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registration is disabled for internal system

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #fafafa 0%, #fef2f2 50%, #fecaca 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="-50%"
        right="-50%"
        w="100%"
        h="100%"
        bg="radial-gradient(circle, rgba(220, 38, 38, 0.03) 0%, transparent 70%)"
        borderRadius="50%"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-50%"
        left="-50%"
        w="100%"
        h="100%"
        bg="radial-gradient(circle, rgba(220, 38, 38, 0.02) 0%, transparent 70%)"
        borderRadius="50%"
        zIndex={0}
      />

      <Container maxW="sm" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            textAlign="center"
            mb={8}
          >
            <Box
              as="img"
              src={logoImage}
              alt="THE A-LIST Logo"
              h="60px"
              w="auto"
              objectFit="contain"
              mx="auto"
              mb={4}
            />

          </MotionBox>

          {/* Login/Register Card */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            bg={cardBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={glassBorder}
            borderRadius="2xl"
            boxShadow={glassShadow}
            p={8}
            className="glass-card"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                             {/* Header */}
               <VStack spacing={2}>
                 <Text
                   fontSize="2xl"
                   fontWeight="700"
                   color="red.600"
                   textAlign="center"
                 >
                   Welcome Back
                 </Text>
                 <Text
                   fontSize="sm"
                   color="gray.600"
                   textAlign="center"
                 >
                   Sign in to access your KOL dashboard
                 </Text>
               </VStack>

                             {/* Form Fields */}
               <VStack spacing={4} w="full">

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Mail size={18} color="#9CA3AF" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: 'red.500',
                      boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
                    }}
                    _hover={{
                      borderColor: 'red.300',
                    }}
                    transition="all 0.2s ease"
                    className="glass-input"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Lock size={18} color="#9CA3AF" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: 'red.500',
                      boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
                    }}
                    _hover={{
                      borderColor: 'red.300',
                    }}
                    transition="all 0.2s ease"
                    className="glass-input"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      p={0}
                      minW="auto"
                      h="auto"
                      color="gray.500"
                      _hover={{ color: 'red.500' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                
              </VStack>


              {/* Submit Button */}
              <Button
                type="submit"
                w="full"
                colorScheme="red"
                size="lg"
                borderRadius="xl"
                fontWeight="600"
                isLoading={isLoading}
                loadingText="Signing in..."
                boxShadow="0 4px 15px rgba(220, 38, 38, 0.3)"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
                }}
                _active={{
                  transform: 'translateY(0)'
                }}
                transition="all 0.2s ease"
                className="hover-lift"
              >
                Sign In
              </Button>



            
            </VStack>
          </MotionBox>

          {/* Footer */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            textAlign="center"
            mt={6}
          >
            <Text fontSize="xs" color="gray.500">
              © 2025 THE A-LIST MALAYSIA. All rights reserved.
            </Text>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Login;

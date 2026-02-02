import React, { useState, useEffect } from 'react';
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
  Container,
  FormControl,
  FormErrorMessage,
  Circle,
  Icon,
  Divider,
  Link
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle
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
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Floating particles animation
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 20,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    setTouched({
      email: true,
      password: true
    });

    if (emailError || passwordError) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      setIsSuccess(true);
      
      toast({
        title: 'Welcome back! 🎉',
        description: 'Successfully logged in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Small delay to show success state
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 500);
      
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
    >
      <Container maxW="md" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Brand */}
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
              mb={3}
            />
            <Text
              fontSize="sm"
              color="gray.600"
              fontWeight="500"
            >
              KOL Management System
            </Text>
          </MotionBox>

          {/* Login Card */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            p={8}
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              {/* Header */}
              <VStack spacing={2} w="full">
                <HStack spacing={2}>
                  <Circle size="40px" bg="red.50">
                    <Icon as={Shield} color="red.500" boxSize={5} />
                  </Circle>
                </HStack>
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  color="gray.800"
                >
                  Welcome Back
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  textAlign="center"
                >
                  Sign in to access your dashboard
                </Text>
              </VStack>

              {/* Form Fields */}
              <VStack spacing={4} w="full">
                <FormControl isInvalid={touched.email && errors.email}>
                  <InputGroup size="lg">
                    <InputLeftElement>
                      <Circle size="36px" bg="gray.50">
                        <Icon as={Mail} color="gray.500" boxSize={4} />
                      </Circle>
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      pl="55px"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      color="gray.800"
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{
                        borderColor: 'red.500',
                        boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
                        bg: 'white'
                      }}
                      _hover={{
                        borderColor: 'gray.300',
                      }}
                      transition="all 0.2s ease"
                    />
                  </InputGroup>
                  <AnimatePresence>
                    {touched.email && errors.email && (
                      <MotionBox
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <FormErrorMessage color="red.500" fontSize="sm" mt={2}>
                          {errors.email}
                        </FormErrorMessage>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </FormControl>

                <FormControl isInvalid={touched.password && errors.password}>
                  <InputGroup size="lg">
                    <InputLeftElement>
                      <Circle size="36px" bg="gray.50">
                        <Icon as={Lock} color="gray.500" boxSize={4} />
                      </Circle>
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      pl="55px"
                      pr="50px"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      color="gray.800"
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{
                        borderColor: 'red.500',
                        boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
                        bg: 'white'
                      }}
                      _hover={{
                        borderColor: 'gray.300',
                      }}
                      transition="all 0.2s ease"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        color="gray.500"
                        _hover={{ 
                          color: 'red.500',
                          bg: 'transparent'
                        }}
                        h="full"
                      >
                        <Icon as={showPassword ? EyeOff : Eye} boxSize={4} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <AnimatePresence>
                    {touched.password && errors.password && (
                      <MotionBox
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <FormErrorMessage color="red.500" fontSize="sm" mt={2}>
                          {errors.password}
                        </FormErrorMessage>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </FormControl>
              </VStack>

              {/* Remember Me */}
              <HStack justify="space-between" w="full">
                <Checkbox
                  colorScheme="red"
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="gray.600"
                  fontSize="sm"
                >
                  Remember me
                </Checkbox>
                <Link
                  fontSize="sm"
                  color="red.500"
                  fontWeight="500"
                  _hover={{ color: 'red.600', textDecoration: 'underline' }}
                >
                  Forgot password?
                </Link>
              </HStack>

              {/* Submit Button */}
              <Button
                type="submit"
                w="full"
                size="lg"
                h="50px"
                colorScheme="red"
                borderRadius="lg"
                fontWeight="600"
                fontSize="md"
                isLoading={isLoading}
                loadingText="Signing in..."
                rightIcon={isSuccess ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
                boxShadow="sm"
                _hover={{
                  boxShadow: 'md',
                  transform: 'translateY(-1px)'
                }}
                _active={{
                  transform: 'translateY(0)'
                }}
                transition="all 0.2s ease"
              >
                {isSuccess ? 'Success!' : 'Sign In'}
              </Button>

              {/* Security Badge */}
              <HStack spacing={2} color="gray.500" fontSize="xs" pt={2}>
                <Icon as={Shield} boxSize={3} />
                <Text>Secured with end-to-end encryption</Text>
              </HStack>
            </VStack>
          </MotionBox>

          {/* Footer */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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

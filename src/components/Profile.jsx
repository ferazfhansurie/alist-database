import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
  Text,
  Avatar,
  HStack,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, changePassword } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'New password must be at least 6 characters long',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(formData.currentPassword, formData.newPassword);

      toast({
        title: 'Success',
        description: 'Password changed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Profile Header */}
        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(220, 38, 38, 0.1)"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        >
          <CardBody>
            <VStack spacing={4}>
              <Avatar
                size="2xl"
                name={user?.name || 'User'}
                bg="red.500"
                color="white"
                fontSize="3xl"
              />
              <VStack spacing={1}>
                <Heading size="lg" color="gray.800">
                  {user?.name || 'User'}
                </Heading>
                <Text color="gray.600" fontSize="md">
                  {user?.email}
                </Text>
                <Text
                  color="red.600"
                  fontSize="sm"
                  fontWeight="600"
                  textTransform="capitalize"
                  bg="red.50"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {user?.role || 'User'}
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Change Password Section */}
        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(220, 38, 38, 0.1)"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        >
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack spacing={2}>
                <Lock size={24} color="#DC2626" />
                <Heading size="md" color="gray.800">
                  Change Password
                </Heading>
              </HStack>

              <Divider />

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  {/* Current Password */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">
                      Current Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'red.400' }}
                        _focus={{
                          borderColor: 'red.500',
                          boxShadow: '0 0 0 1px #DC2626',
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* New Password */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">
                      New Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'red.400' }}
                        _focus={{
                          borderColor: 'red.500',
                          boxShadow: '0 0 0 1px #DC2626',
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Confirm Password */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">
                      Confirm New Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'red.400' }}
                        _focus={{
                          borderColor: 'red.500',
                          boxShadow: '0 0 0 1px #DC2626',
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="red"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Changing Password..."
                    bgGradient="linear(to-r, red.500, pink.500)"
                    _hover={{
                      bgGradient: 'linear(to-r, red.600, pink.600)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)',
                    }}
                    transition="all 0.2s ease"
                  >
                    Change Password
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorModeValue,
  Container,
  Icon,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  SimpleGrid,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Divider
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Home,
  Instagram,
  Twitter,
  FileText,
  Users,
  Plus,
  LogOut,
  User,
  Settings,
  Menu as MenuIcon,
  BarChart3
} from 'lucide-react';
import logoImage from "../assets/logo.png";
import KOLForm from './KOLForm';
import { KOL_TYPES } from '../data/models';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { createKOL } = useDatabase();
  const { user, logout } = useAuth();
  const { isOpen: isTypeSelectOpen, onOpen: onTypeSelectOpen, onClose: onTypeSelectClose } = useDisclosure();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  
  const [selectedKOLType, setSelectedKOLType] = useState(null);
  
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.8)');
  const borderColor = useColorModeValue('rgba(220, 38, 38, 0.1)', 'rgba(220, 38, 38, 0.1)');

  // Glassmorphism colors for modal
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, shortLabel: 'Home' },
    { path: '/social-media', label: 'TikTok/IG/FB KOL', icon: Instagram, shortLabel: 'Social' },
    { path: '/twitter-thread', label: 'Twitter/Thread KOL', icon: Twitter, shortLabel: 'Twitter' },
    { path: '/blogger', label: 'Blogspot/Bloggers', icon: FileText, shortLabel: 'Blog' },
    { path: '/production-talent', label: 'Production Talent', icon: Users, shortLabel: 'Talent' },
  ];

  const kolTypeOptions = [
    {
      type: KOL_TYPES.SOCIAL_MEDIA,
      label: 'Social Media KOL',
      description: 'Instagram, TikTok, Facebook influencers',
      icon: Instagram,
      color: '#E4405F',
      bgGradient: 'linear(to-br, #E4405F, #C13584)'
    },
    {
      type: KOL_TYPES.TWITTER_THREAD,
      label: 'Twitter/Thread KOL',
      description: 'Twitter and Threads content creators',
      icon: Twitter,
      color: '#1DA1F2',
      bgGradient: 'linear(to-br, #1DA1F2, #0D8BD9)'
    },
    {
      type: KOL_TYPES.BLOGGER,
      label: 'Blogger KOL',
      description: 'Blogspot and independent bloggers',
      icon: FileText,
      color: '#FF6B35',
      bgGradient: 'linear(to-br, #FF6B35, #E55A2B)'
    },
    {
      type: KOL_TYPES.PRODUCTION_TALENT,
      label: 'Production Talent',
      description: 'Models, actors, voice talents',
      icon: Users,
      color: '#8B5CF6',
      bgGradient: 'linear(to-br, #8B5CF6, #7C3AED)'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleKOLTypeSelect = (kolType) => {
    setSelectedKOLType(kolType);
    onTypeSelectClose();
    onFormOpen();
  };

  const handleSave = async (kolData) => {
    try {
      // Save the KOL data to the database
      await createKOL(kolData);
      
      toast({
        title: 'Success!',
        description: 'KOL record saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onFormClose();
      setSelectedKOLType(null);
      
      // Navigate to the appropriate page to show the new KOL
      if (selectedKOLType === KOL_TYPES.SOCIAL_MEDIA) {
        navigate('/social-media');
      } else if (selectedKOLType === KOL_TYPES.TWITTER_THREAD) {
        navigate('/twitter-thread');
      } else if (selectedKOLType === KOL_TYPES.BLOGGER) {
        navigate('/blogger');
      } else if (selectedKOLType === KOL_TYPES.PRODUCTION_TALENT) {
        navigate('/production-talent');
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description: error.message || 'Failed to save KOL record',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getFormTitle = () => {
    if (!selectedKOLType) return 'Add New KOL';
    
    switch (selectedKOLType) {
      case KOL_TYPES.SOCIAL_MEDIA:
        return 'Add New Social Media KOL';
      case KOL_TYPES.TWITTER_THREAD:
        return 'Add New Twitter/Thread KOL';
      case KOL_TYPES.BLOGGER:
        return 'Add New Blogger KOL';
      case KOL_TYPES.PRODUCTION_TALENT:
        return 'Add New Production Talent KOL';
      default:
        return 'Add New KOL';
    }
  };

  return (
    <>
      <Box
        position="sticky"
        top={0}
        zIndex={100}
        backdropFilter="blur(20px)"
        WebkitBackdropFilter="blur(20px)"
        bgGradient="linear(to-r, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))"
        borderBottom="2px solid"
        borderColor="rgba(255, 255, 255, 0.3)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgGradient: 'linear(to-r, red.400, pink.500, purple.500, blue.500)',
        }}
      >
        <Container maxW="container.xl" px={4}>
          <Flex justify="space-between" align="center" py={3}>
            {/* Logo */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              cursor="pointer"
              onClick={() => navigate('/')}
              _hover={{ transform: 'scale(1.05)' }}
            >
              <Flex align="center" gap={2}>
                <Box
                  as="img"
                  src={logoImage}
                  alt="THE A-LIST Logo"
                  h={{ base: "35px", md: "40px" }}
                  w="auto"
                  objectFit="contain"
                />
              </Flex>
            </MotionBox>

            {/* Desktop Navigation Items */}
            <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <MotionBox
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(item.path)}
                      position="relative"
                      px={4}
                      py={3}
                      h="auto"
                      minW="auto"
                      borderRadius="2xl"
                      bgGradient={isActive(item.path) ? 'linear(to-br, red.50, pink.100)' : 'transparent'}
                      color={isActive(item.path) ? 'red.700' : 'gray.600'}
                      border={isActive(item.path) ? '2px solid' : '2px solid transparent'}
                      borderColor={isActive(item.path) ? 'red.200' : 'transparent'}
                      boxShadow={isActive(item.path) ? '0 4px 12px rgba(220, 38, 38, 0.15)' : 'none'}
                      _hover={{
                        bgGradient: isActive(item.path) ? 'linear(to-br, red.100, pink.200)' : 'linear(to-br, red.50, pink.50)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(220, 38, 38, 0.2)',
                        borderColor: 'red.300'
                      }}
                      _active={{
                        transform: 'translateY(0)'
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      className="hover-lift"
                    >
                      <VStack spacing={1} align="center">
                        <Icon
                          as={IconComponent}
                          boxSize={5}
                          color={isActive(item.path) ? 'red.600' : 'gray.500'}
                        />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="tight"
                          display={{ base: 'none', md: 'block' }}
                        >
                          {item.shortLabel}
                        </Text>
                      </VStack>
                      
                      {/* Active Indicator */}
                      {isActive(item.path) && (
                        <MotionBox
                          layoutId="activeIndicator"
                          position="absolute"
                          bottom="-2px"
                          left="50%"
                          transform="translateX(-50%)"
                          w="20px"
                          h="3px"
                          bg="red.500"
                          borderRadius="full"
                          boxShadow="0 0 10px rgba(220, 38, 38, 0.5)"
                        />
                      )}
                    </Button>
                  </MotionBox>
                );
              })}
            </HStack>

            {/* Right Side Actions */}
            <HStack spacing={2}>
              {/* Desktop Add KOL Button */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                display={{ base: 'none', md: 'block' }}
              >
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="2xl"
                  px={5}
                  py={3}
                  h="auto"
                  fontSize="sm"
                  fontWeight="700"
                  letterSpacing="tight"
                  bgGradient="linear(to-r, red.500, pink.500)"
                  boxShadow="0 8px 24px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(220, 38, 38, 0.2)"
                  border="2px solid"
                  borderColor="white"
                  _hover={{
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 12px 32px rgba(220, 38, 38, 0.5), 0 8px 16px rgba(220, 38, 38, 0.3)',
                    bgGradient: 'linear(to-r, red.600, pink.600)'
                  }}
                  _active={{
                    transform: 'translateY(-1px) scale(1.02)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  className="hover-lift"
                  onClick={onTypeSelectOpen}
                >
                  + Add KOL
                </Button>
              </MotionBox>

              {/* Mobile Add KOL Button */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                display={{ base: 'block', md: 'none' }}
              >
                <IconButton
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="2xl"
                  icon={<Plus size={18} />}
                  bgGradient="linear(to-r, red.500, pink.500)"
                  boxShadow="0 8px 24px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(220, 38, 38, 0.2)"
                  border="2px solid"
                  borderColor="white"
                  _hover={{
                    transform: 'translateY(-3px) scale(1.1)',
                    boxShadow: '0 12px 32px rgba(220, 38, 38, 0.5), 0 8px 16px rgba(220, 38, 38, 0.3)',
                    bgGradient: 'linear(to-r, red.600, pink.600)'
                  }}
                  _active={{
                    transform: 'translateY(-1px) scale(1.05)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  onClick={onTypeSelectOpen}
                  aria-label="Add KOL"
                />
              </MotionBox>

              {/* Desktop User Menu */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                display={{ base: 'none', md: 'block' }}
              >
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    size="sm"
                    borderRadius="xl"
                    px={3}
                    py={2}
                    h="auto"
                    _hover={{
                      bg: 'rgba(220, 38, 38, 0.05)',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s ease"
                  >
                    <HStack spacing={2}>
                      <Avatar
                        size="sm"
                        name={user?.name || 'User'}
                        bg="red.500"
                        color="white"
                        fontSize="xs"
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        {user?.name || 'User'}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.1)"
                    borderRadius="xl"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                  >
                    <MenuItem
                      icon={<User size={16} />}
                      onClick={() => navigate('/profile')}
                      _hover={{ bg: 'rgba(220, 38, 38, 0.05)' }}
                    >
                      Profile
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem
                        icon={<Settings size={16} />}
                        onClick={() => navigate('/settings')}
                        _hover={{ bg: 'rgba(220, 38, 38, 0.05)' }}
                      >
                        Database Settings
                      </MenuItem>
                    )}
                    <MenuDivider />
                    <MenuItem
                      icon={<LogOut size={16} />}
                      onClick={logout}
                      _hover={{ bg: 'rgba(220, 38, 38, 0.05)' }}
                      color="red.500"
                    >
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </MotionBox>

              {/* Mobile Menu Button */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                display={{ base: 'block', lg: 'none' }}
              >
                <IconButton
                  variant="ghost"
                  size="sm"
                  borderRadius="xl"
                  icon={<MenuIcon size={20} />}
                  onClick={onMobileMenuOpen}
                  _hover={{
                    bg: 'rgba(220, 38, 38, 0.05)',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s ease"
                  aria-label="Open menu"
                />
              </MotionBox>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* KOL Type Selection Modal */}
      <Modal 
        isOpen={isTypeSelectOpen} 
        onClose={onTypeSelectClose} 
        size={{ base: "full", md: "2xl" }}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius={{ base: "0", md: "2xl" }}
          boxShadow={glassShadow}
          m={{ base: 0, md: 4 }}
        >
          <ModalHeader color="red.600" fontWeight="700" textAlign="center">
            Select KOL Type
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={{ base: 4, md: 6 }}>
            <VStack spacing={{ base: 4, md: 6 }}>
              <Text color="gray.600" textAlign="center" fontSize="sm">
                Choose the type of KOL you want to add to the system
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                {kolTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <MotionBox
                      key={option.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        w="full"
                        h="auto"
                        p={{ base: 4, md: 6 }}
                        borderRadius="xl"
                        bgGradient={option.bgGradient}
                        color="white"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                        }}
                        _active={{
                          transform: 'translateY(0)'
                        }}
                        transition="all 0.3s ease"
                        onClick={() => handleKOLTypeSelect(option.type)}
                      >
                        <VStack spacing={3} align="center">
                          <Box
                            p={3}
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.2)"
                            backdropFilter="blur(10px)"
                          >
                            <IconComponent size={24} color="white" />
                          </Box>
                          <VStack spacing={1}>
                            <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }}>
                              {option.label}
                            </Text>
                            <Text fontSize="xs" opacity={0.9} textAlign="center">
                              {option.description}
                            </Text>
                          </VStack>
                        </VStack>
                      </Button>
                    </MotionBox>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add KOL Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={onFormClose} 
        size={{ base: "full", lg: "6xl" }} 
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius={{ base: "0", md: "2xl" }}
          boxShadow={glassShadow}
          m={{ base: 0, md: 4 }}
        >
          <ModalHeader color="red.600" fontWeight="700" px={{ base: 4, md: 6 }}>
            {getFormTitle()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={{ base: 4, md: 6 }}>
            {selectedKOLType && (
              <KOLForm
                initialData={null}
                kolType={selectedKOLType}
                onSave={handleSave}
                onCancel={onFormClose}
                title={getFormTitle()}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        placement="right"
        onClose={onMobileMenuClose}
        size="sm"
      >
        <DrawerOverlay backdropFilter="blur(10px)" />
        <DrawerContent
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          boxShadow={glassShadow}
        >
          <DrawerCloseButton />
          <DrawerHeader>
            <Text color="red.600" fontWeight="700" fontSize="lg">
              Menu
            </Text>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {/* User Info */}
              <Box
                bg="rgba(255, 255, 255, 0.6)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.2)"
              >
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={user?.name || 'User'}
                    bg="red.500"
                    color="white"
                    fontSize="sm"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="700" color="gray.800">
                      {user?.name || 'User'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      KOL Manager
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              <Divider />

              {/* Navigation Items */}
              <VStack spacing={2} align="stretch">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="lg"
                      justifyContent="start"
                      leftIcon={<Icon as={IconComponent} boxSize={5} />}
                      onClick={() => {
                        navigate(item.path);
                        onMobileMenuClose();
                      }}
                      bg={isActive(item.path) ? 'rgba(220, 38, 38, 0.1)' : 'transparent'}
                      color={isActive(item.path) ? 'red.600' : 'gray.600'}
                      fontWeight="600"
                      borderRadius="xl"
                      _hover={{
                        bg: isActive(item.path) ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.05)',
                        transform: 'translateX(4px)',
                      }}
                      transition="all 0.2s ease"
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </VStack>

              <Divider />

              {/* Profile & Sign Out */}
              <VStack spacing={2} align="stretch">
                <Button
                  variant="ghost"
                  size="lg"
                  justifyContent="start"
                  leftIcon={<User size={20} />}
                  onClick={() => {
                    navigate('/profile');
                    onMobileMenuClose();
                  }}
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'rgba(220, 38, 38, 0.05)',
                    transform: 'translateX(4px)',
                  }}
                  transition="all 0.2s ease"
                >
                  Profile
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="lg"
                    justifyContent="start"
                    leftIcon={<Settings size={20} />}
                    onClick={() => {
                      navigate('/settings');
                      onMobileMenuClose();
                    }}
                    fontWeight="600"
                    borderRadius="xl"
                    _hover={{
                      bg: 'rgba(220, 38, 38, 0.05)',
                      transform: 'translateX(4px)',
                    }}
                    transition="all 0.2s ease"
                  >
                    Database Settings
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  justifyContent="start"
                  leftIcon={<LogOut size={20} />}
                  onClick={() => {
                    logout();
                    onMobileMenuClose();
                  }}
                  color="red.500"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{
                    bg: 'rgba(220, 38, 38, 0.05)',
                    transform: 'translateX(4px)',
                  }}
                  transition="all 0.2s ease"
                >
                  Sign Out
                </Button>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navigation;

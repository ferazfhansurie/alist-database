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
  MenuDivider
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
  User
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
    { path: '/production-talent', label: 'Production Talent', icon: Users, shortLabel: 'Talent' }
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
        bg={bgColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
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
                  h="40px"
                  w="auto"
                  objectFit="contain"
                />

              </Flex>
            </MotionBox>

            {/* Navigation Items */}
            <HStack spacing={1}>
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
                      py={2}
                      h="auto"
                      minW="auto"
                      borderRadius="xl"
                      bg={isActive(item.path) ? 'rgba(220, 38, 38, 0.1)' : 'transparent'}
                      color={isActive(item.path) ? 'red.600' : 'gray.600'}
                      _hover={{
                        bg: isActive(item.path) ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.05)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)'
                      }}
                      _active={{
                        transform: 'translateY(0)'
                      }}
                      transition="all 0.2s ease"
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
            <HStack spacing={3}>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="xl"
                  px={4}
                  py={2}
                  h="auto"
                  fontSize="sm"
                  fontWeight="600"
                  letterSpacing="tight"
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
                  onClick={onTypeSelectOpen}
                >
                  + Add KOL
                </Button>
              </MotionBox>

              {/* User Menu */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
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
                        display={{ base: 'none', md: 'block' }}
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
                      _hover={{ bg: 'rgba(220, 38, 38, 0.05)' }}
                    >
                      Profile
                    </MenuItem>
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
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* KOL Type Selection Modal */}
      <Modal isOpen={isTypeSelectOpen} onClose={onTypeSelectClose} size="2xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
          boxShadow={glassShadow}
        >
          <ModalHeader color="red.600" fontWeight="700" textAlign="center">
            Select KOL Type
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
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
                        p={6}
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
                            <Text fontWeight="700" fontSize="md">
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
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
          boxShadow={glassShadow}
        >
          <ModalHeader color="red.600" fontWeight="700">
            {getFormTitle()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
    </>
  );
};

export default Navigation;

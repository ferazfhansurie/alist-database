import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Flex,
  Badge,
  SimpleGrid,
  Circle,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Users,
  Instagram,
  Twitter,
  FileText,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  Activity,
  Target,
  Database,
  Building,
  BarChart3
} from 'lucide-react';
import { KOL_TYPES } from '../data/models';
import { useDatabase } from '../contexts/DatabaseContext';
import KOLForm from './KOLForm';

const MotionBox = motion(Box);

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { kols, stats, loading, error, createKOL } = useDatabase();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [selectedKOLType, setSelectedKOLType] = useState(null);

  const handleQuickAction = (kolType) => {
    setSelectedKOLType(kolType);
    onFormOpen();
  };

  const handleSave = async (kolData) => {
    try {
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

  // Show loading state
  if (loading) {
    return (
      <Box
        minH="100vh"
        bgGradient="linear(to-br, gray.50, red.50, white)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="gray.600">Loading database...</Text>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        minH="100vh"
        bgGradient="linear(to-br, gray.50, red.50, white)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.600">Database Error</Text>
          <Text color="gray.600">{error}</Text>
        </VStack>
      </Box>
    );
  }

  const statCards = [
    {
      label: 'Total KOLs',
      value: stats.total,
      icon: Users,
      color: 'red.500',
      path: '/',
      status: 'ACTIVE',
      statusColor: 'green',
      description: 'Key Opinion Leaders'
    },
    {
      label: 'Social Media',
      value: stats.socialMedia,
      icon: Instagram,
      color: 'red.400',
      path: '/social-media',
      status: 'GROWING',
      statusColor: 'green',
      description: 'TikTok, Instagram, Facebook'
    },
    {
      label: 'Twitter/Thread',
      value: stats.twitterThread,
      icon: Twitter,
      color: 'red.300',
      path: '/twitter-thread',
      status: 'ACTIVE',
      statusColor: 'green',
      description: 'Twitter & Thread influencers'
    },
    {
      label: 'Bloggers',
      value: stats.blogger,
      icon: FileText,
      color: 'red.600',
      path: '/blogger',
      status: 'DIVERSE',
      statusColor: 'blue',
      description: 'Blogspot & independent blogs'
    },
    {
      label: 'Production Talent',
      value: stats.productionTalent,
      icon: TrendingUp,
      color: 'red.700',
      path: '/production-talent',
      status: 'PREMIUM',
      statusColor: 'purple',
      description: 'Models, actors, voice talents'
    },
    {
      label: 'Avg Rate (RM)',
      value: stats.averageRate,
      icon: DollarSign,
      color: 'red.500',
      path: '/',
      status: 'COMPETITIVE',
      statusColor: 'green',
      description: 'Per KOL engagement'
    }
  ];

  const recentKOLs = kols.slice(0, 4);

  const quickActions = [
    {
      label: 'Add Social Media KOL',
      icon: Instagram,
      kolType: KOL_TYPES.SOCIAL_MEDIA,
      color: 'red',
      description: 'TikTok, Instagram, Facebook'
    },
    {
      label: 'Add Twitter KOL',
      icon: Twitter,
      kolType: KOL_TYPES.TWITTER_THREAD,
      color: 'red',
      description: 'Twitter & Thread influencers'
    },
    {
      label: 'Add Blogger',
      icon: FileText,
      kolType: KOL_TYPES.BLOGGER,
      color: 'red',
      description: 'Blogspot & independent blogs'
    },
    {
      label: 'Add Production Talent',
      icon: TrendingUp,
      kolType: KOL_TYPES.PRODUCTION_TALENT,
      color: 'red',
      description: 'Models, actors, voice talents'
    }
  ];


  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, red.50, white)"
      py={{ base: 2, md: 4 }}
      px={{ base: 1, md: 2 }}
    >
      <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
         

            {/* Stats Grid */}
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={{ base: 2, md: 3 }}>
              {statCards.map((stat, index) => (
                <MotionBox
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="xl"
                    p={{ base: 3, md: 4 }}
                    boxShadow="0 1px 3px rgba(0, 0, 0, 0.06)"
                    cursor="pointer"
                    onClick={() => navigate(stat.path)}
                    transition="all 0.2s ease"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                      borderColor: 'red.200',
                    }}
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: stat.color,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease'
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '3px',
                      background: `linear-gradient(180deg, ${stat.color}20, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    sx={{
                      '&:hover::before': {
                        transform: 'scaleX(1)'
                      },
                      '&:hover::after': {
                        opacity: 1
                      }
                    }}
                  >
                    <VStack spacing={2} align="start">
                      <Flex justify="space-between" align="center" w="full">
                        <Circle 
                          size="32px"
                          bg={`${stat.color}10`} 
                          color={stat.color}
                        >
                          <Icon as={stat.icon} boxSize={4} />
                        </Circle>
                        <Badge
                          colorScheme={stat.statusColor}
                          variant="subtle"
                          fontSize="10px"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {stat.status}
                        </Badge>
                      </Flex>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="500" mb={1}>
                          {stat.label}
                        </Text>
                        <Text fontSize={{ base: "lg", md: "xl" }} color="gray.900" fontWeight="700">
                          {stat.label.includes('Rate') ? `RM ${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                        </Text>
                        <Text color="gray.400" fontSize="10px" fontWeight="500" mt={1} noOfLines={1}>
                          {stat.description}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>

       

            {/* Recent Activity & Quick Actions */}
            <Grid templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }} gap={{ base: 3, md: 4 }}>
              {/* Recent KOLs */}
              <Box 
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                boxShadow="0 1px 3px rgba(0, 0, 0, 0.06)"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="md" color="gray.900" fontWeight="600">
                    Recent KOLs
                  </Text>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    size="xs"
                    rightIcon={<ArrowUpRight size={12} />}
                    onClick={() => navigate('/social-media')}
                    borderRadius="full"
                    fontWeight="500"
                    px={3}
                    _hover={{
                      bg: 'red.50',
                    }}
                    transition="all 0.2s ease"
                    fontSize="xs"
                  >
                    View All
                  </Button>
                </Flex>

                <VStack spacing={2} align="stretch">
                  {recentKOLs.map((kol, index) => (
                    <MotionBox
                      key={kol.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Box
                        bg="gray.50"
                        p={3}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.100"
                        cursor="pointer"
                        onClick={() => navigate('/social-media')}
                        transition="all 0.2s ease"
                        _hover={{
                          bg: 'red.50',
                          borderColor: 'red.200',
                          transform: 'translateX(2px)'
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <HStack spacing={3} align="center">
                            <Circle size="32px" bg="red.100" color="red.600">
                              <Text fontSize="xs" fontWeight="700">
                                {kol.name.charAt(0)}
                              </Text>
                            </Circle>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="600" color="gray.900" fontSize="sm">
                                {kol.name}
                              </Text>
                              <HStack spacing={2} align="center">
                                <Badge 
                                  colorScheme="red" 
                                  variant="subtle" 
                                  size="xs" 
                                  borderRadius="full"
                                  fontSize="xx-small"
                                >
                                  {kol.tier}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {kol.niches[0]}
                                </Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <VStack align="end" spacing={0}>
                            <Text fontWeight="700" color="red.600" fontSize="sm">
                              RM {kol.rate.toLocaleString()}
                            </Text>
                            <Badge 
                              colorScheme="blue" 
                              variant="subtle" 
                              size="xs" 
                              fontSize="xx-small"
                            >
                              {kol.kolType.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </VStack>
                        </Flex>
                      </Box>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>

              {/* Quick Actions */}
              <Box 
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                boxShadow="0 1px 3px rgba(0, 0, 0, 0.06)"
              >
                <Text 
                  fontSize="md" 
                  color="gray.900" 
                  mb={4} 
                  fontWeight="600"
                >
                  Quick Actions
                </Text>
                <VStack spacing={2} align="stretch">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <MotionBox
                        key={action.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Button
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          leftIcon={<IconComponent size={16} />}
                          onClick={() => handleQuickAction(action.kolType)}
                          justifyContent="start"
                          w="full"
                          h="auto"
                          py={3}
                          px={3}
                          borderRadius="lg"
                          fontWeight="500"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.100"
                          color="gray.700"
                          _hover={{
                            bg: 'red.50',
                            borderColor: 'red.200',
                            color: 'red.700',
                            transform: 'translateY(-1px)'
                          }}
                          transition="all 0.2s ease"
                        >
                          <VStack align="start" spacing={0} w="full">
                            <Text fontWeight="600" fontSize="sm">
                              {action.label.replace('Add ', '')}
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontWeight="400">
                              {action.description}
                            </Text>
                          </VStack>
                        </Button>
                      </MotionBox>
                    );
                  })}
                </VStack>
              </Box>
            </Grid>
          </VStack>
        </MotionBox>
      </Container>

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
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius={{ base: "0", md: "2xl" }}
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
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
    </Box>
  );
};

export default Dashboard;

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
  const { kols, stats, loading, error, createKOL, loadKOLs } = useDatabase();
  const [actualStats, setActualStats] = useState({
    total: 0,
    socialMedia: 0,
    twitterThread: 0,
    blogger: 0,
    productionTalent: 0,
    totalValue: 0,
    averageRate: 0
  });
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [selectedKOLType, setSelectedKOLType] = useState(null);

  // Calculate actual stats from loaded KOLs
  useEffect(() => {
    if (kols && kols.length > 0) {
      const socialMediaKOLs = kols.filter(kol => 
        kol.kolType === 'social-media' || 
        kol.kolType === 'instagram' || 
        kol.kolType === 'tiktok' ||
        kol.instagram || 
        kol.tiktok || 
        kol.facebook
      );
      
      const twitterThreadKOLs = kols.filter(kol => 
        kol.kolType === 'twitter-thread' || 
        kol.twitter || 
        kol.thread
      );
      
      const bloggerKOLs = kols.filter(kol => 
        kol.kolType === 'blogger' || 
        kol.blog
      );
      
      const productionTalentKOLs = kols.filter(kol => 
        kol.kolType === 'production-talent'
      );
      
      const totalValue = kols.reduce((sum, kol) => sum + (parseFloat(kol.rate) || 0), 0);
      const averageRate = kols.length > 0 ? totalValue / kols.length : 0;
      
      setActualStats({
        total: kols.length,
        socialMedia: socialMediaKOLs.length,
        twitterThread: twitterThreadKOLs.length,
        blogger: bloggerKOLs.length,
        productionTalent: productionTalentKOLs.length,
        totalValue,
        averageRate
      });
    }
  }, [kols]);

  const handleQuickAction = (kolType) => {
    setSelectedKOLType(kolType);
    onFormOpen();
  };

  const handleSave = async (kolData) => {
    try {
      await createKOL(kolData);
      
      // Reload data to get updated stats
      await loadKOLs();
      
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
      value: actualStats.total,
      icon: Users,
      color: 'red.500',
      gradient: 'linear(to-br, red.400, red.600)',
      bgGradient: 'linear(to-br, red.50, red.100)',
      path: '/',
      status: 'ACTIVE',
      statusColor: 'green',
      description: 'Key Opinion Leaders'
    },
    {
      label: 'Social Media',
      value: actualStats.socialMedia,
      icon: Instagram,
      color: 'pink.500',
      gradient: 'linear(to-br, pink.400, purple.600)',
      bgGradient: 'linear(to-br, pink.50, purple.100)',
      path: '/social-media',
      status: 'GROWING',
      statusColor: 'green',
      description: 'TikTok, Instagram, Facebook'
    },
    {
      label: 'Twitter/Thread',
      value: actualStats.twitterThread,
      icon: Twitter,
      color: 'blue.500',
      gradient: 'linear(to-br, blue.400, cyan.600)',
      bgGradient: 'linear(to-br, blue.50, cyan.100)',
      path: '/twitter-thread',
      status: 'ACTIVE',
      statusColor: 'green',
      description: 'Twitter & Thread influencers'
    },
    {
      label: 'Bloggers',
      value: actualStats.blogger,
      icon: FileText,
      color: 'orange.500',
      gradient: 'linear(to-br, orange.400, red.600)',
      bgGradient: 'linear(to-br, orange.50, red.100)',
      path: '/blogger',
      status: 'DIVERSE',
      statusColor: 'blue',
      description: 'Blogspot & independent blogs'
    },
    {
      label: 'Production Talent',
      value: actualStats.productionTalent,
      icon: TrendingUp,
      color: 'purple.500',
      gradient: 'linear(to-br, purple.400, pink.600)',
      bgGradient: 'linear(to-br, purple.50, pink.100)',
      path: '/production-talent',
      status: 'PREMIUM',
      statusColor: 'purple',
      description: 'Models, actors, voice talents'
    },
    {
      label: 'Avg Rate (RM)',
      value: actualStats.averageRate,
      icon: DollarSign,
      color: 'green.500',
      gradient: 'linear(to-br, green.400, emerald.600)',
      bgGradient: 'linear(to-br, green.100, emerald.200)',
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
      bgGradient="linear(to-br, purple.50, pink.50, red.50, orange.50)"
      py={{ base: 2, md: 4 }}
      px={{ base: 1, md: 2 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: 'radial(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}
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
                    bgGradient={stat.bgGradient}
                    border="2px solid"
                    borderColor="white"
                    borderRadius="2xl"
                    p={{ base: 4, md: 5 }}
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
                    cursor="pointer"
                    onClick={() => navigate(stat.path)}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
                      borderColor: 'white',
                    }}
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      bgGradient: stat.gradient,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '4px',
                      bgGradient: `linear(180deg, ${stat.color}40, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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
                          size="40px"
                          bgGradient={stat.gradient}
                          color="white"
                          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                        >
                          <Icon as={stat.icon} boxSize={5} />
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
                bgGradient="linear(to-br, white, gray.50)"
                border="2px solid"
                borderColor="white"
                p={{ base: 5, md: 6 }}
                borderRadius="2xl"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgGradient: 'linear(to-r, blue.400, purple.500, pink.500)',
                }}
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
                        bgGradient="linear(to-r, white, gray.50)"
                        p={4}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="white"
                        cursor="pointer"
                        onClick={() => navigate('/social-media')}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
                        _hover={{
                          bgGradient: 'linear(to-r, red.50, pink.50)',
                          borderColor: 'red.200',
                          transform: 'translateX(4px) scale(1.02)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <HStack spacing={3} align="center">
                            <Circle 
                              size="40px" 
                              bgGradient="linear(to-br, red.400, red.600)"
                              color="white"
                              boxShadow="0 4px 12px rgba(220, 38, 38, 0.3)"
                            >
                              <Text fontSize="sm" fontWeight="700">
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
                bgGradient="linear(to-br, white, gray.50)"
                border="2px solid"
                borderColor="white"
                p={{ base: 5, md: 6 }}
                borderRadius="2xl"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgGradient: 'linear(to-r, green.400, blue.500, purple.500)',
                }}
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
                          leftIcon={<IconComponent size={18} />}
                          onClick={() => handleQuickAction(action.kolType)}
                          justifyContent="start"
                          w="full"
                          h="auto"
                          py={4}
                          px={4}
                          borderRadius="xl"
                          fontWeight="600"
                          bgGradient="linear(to-r, white, gray.50)"
                          border="2px solid"
                          borderColor="white"
                          color="gray.700"
                          boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
                          _hover={{
                            bgGradient: 'linear(to-r, red.50, pink.50)',
                            borderColor: 'red.200',
                            color: 'red.700',
                            transform: 'translateY(-2px) scale(1.02)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                          }}
                          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
          bgGradient="linear(to-br, white, gray.50)"
          border="2px solid"
          borderColor="white"
          borderRadius={{ base: "0", md: "2xl" }}
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)"
          m={{ base: 0, md: 4 }}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            bgGradient: 'linear(to-r, red.400, pink.500, purple.500)',
          }}
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

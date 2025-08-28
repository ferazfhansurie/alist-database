import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  VStack,
  HStack,
  Icon,
  Flex,
  Heading,
  Badge,
  SimpleGrid,
  Circle,
  Progress,
  useColorModeValue
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

const MotionBox = motion(Box);

const Dashboard = () => {
  const navigate = useNavigate();
  const { kols, stats, loading, error } = useDatabase();

  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

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
      path: '/social-media',
      color: 'red',
      description: 'TikTok, Instagram, Facebook'
    },
    {
      label: 'Add Twitter KOL',
      icon: Twitter,
      path: '/twitter-thread',
      color: 'red',
      description: 'Twitter & Thread influencers'
    },
    {
      label: 'Add Blogger',
      icon: FileText,
      path: '/blogger',
      color: 'red',
      description: 'Blogspot & independent blogs'
    },
    {
      label: 'Add Production Talent',
      icon: TrendingUp,
      path: '/production-talent',
      color: 'red',
      description: 'Models, actors, voice talents'
    }
  ];

  const performanceMetrics = [
    { label: 'Engagement Rate', value: '8.2%', change: '+2.1%', positive: true },
    { label: 'Conversion Rate', value: '3.8%', change: '+0.5%', positive: true },
    { label: 'ROI', value: '4.2x', change: '+0.8x', positive: true },
    { label: 'Response Time', value: '2.4h', change: '-0.6h', positive: true }
  ];

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, red.50, white)"
      py={8}
      px={4}
    >
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
      

            {/* Stats Grid */}
            <Box>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {statCards.map((stat, index) => (
                  <MotionBox
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Box
                      bg={glassBg}
                      backdropFilter="blur(20px)"
                      border="1px solid"
                      borderColor={glassBorder}
                      borderRadius="2xl"
                      p={5}
                      boxShadow={glassShadow}
                      cursor="pointer"
                      onClick={() => navigate(stat.path)}
                      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                      _hover={{
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(220, 38, 38, 0.15)',
                        borderColor: 'red.300',
                        _before: {
                          transform: 'scaleX(1)'
                        }
                      }}
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                        transform: 'scaleX(0)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="start">
                          <Circle 
                            size="45px" 
                            bg={`${stat.color}15`} 
                            color={stat.color}
                            backdropFilter="blur(10px)"
                            border="1px solid"
                            borderColor={`${stat.color}30`}
                          >
                            <Icon as={stat.icon} boxSize={5} />
                          </Circle>
                          <Badge
                            colorScheme={stat.statusColor}
                            variant="solid"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontWeight="600"
                            backdropFilter="blur(10px)"
                          >
                            {stat.status}
                          </Badge>
                        </Flex>
                        
                        <VStack align="start" spacing={2}>
                          <Stat>
                            <StatLabel fontSize="sm" color="gray.600" fontWeight="600" mb={1}>
                              {stat.label}
                            </StatLabel>
                            <StatNumber fontSize="2xl" color="gray.800" fontWeight="800" mb={1}>
                              {stat.label.includes('Rate') ? `RM ${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                            </StatNumber>
                            <StatHelpText color="gray.500" fontSize="xs" fontWeight="500">
                              {stat.description}
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </VStack>
                    </Box>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>

       

            {/* Recent Activity & Quick Actions */}
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={5}>
              {/* Recent KOLs */}
              <Box 
                bg={glassBg}
                backdropFilter="blur(20px)"
                border="1px solid"
                borderColor={glassBorder}
                p={6} 
                borderRadius="2xl" 
                boxShadow={glassShadow}
              >
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md" color="gray.800" fontWeight="700">
                    Recent KOLs
                  </Heading>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowUpRight size={16} />}
                    onClick={() => navigate('/social-media')}
                    borderRadius="full"
                    fontWeight="600"
                    _hover={{
                      bg: 'red.50',
                      transform: 'translateY(-1px)'
                    }}
                    transition="all 0.2s ease"
                  >
                    View All
                  </Button>
                </Flex>

                <VStack spacing={3} align="stretch">
                  {recentKOLs.map((kol, index) => (
                    <MotionBox
                      key={kol.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Box
                        bg="rgba(255, 255, 255, 0.6)"
                        backdropFilter="blur(10px)"
                        p={4}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.2)"
                        cursor="pointer"
                        onClick={() => navigate('/social-media')}
                        transition="all 0.3s ease"
                        _hover={{
                          bg: 'rgba(254, 226, 226, 0.8)',
                          borderColor: 'red.200',
                          transform: 'translateX(4px)'
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="700" color="gray.800" fontSize="sm">
                              {kol.name}
                            </Text>
                            <HStack spacing={3}>
                              <Badge 
                                colorScheme="red" 
                                variant="subtle" 
                                size="sm" 
                                borderRadius="full"
                                fontWeight="600"
                              >
                                {kol.tier}
                              </Badge>
                              <Text fontSize="xs" color="gray.500" fontWeight="500">
                                {kol.niches.slice(0, 2).join(', ')}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack align="end" spacing={2}>
                            <Text fontWeight="800" color="red.600" fontSize="lg">
                              RM {kol.rate.toLocaleString()}
                            </Text>
                            <Badge 
                              colorScheme="blue" 
                              variant="subtle" 
                              size="sm" 
                              borderRadius="full"
                              fontWeight="600"
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
                bg={glassBg}
                backdropFilter="blur(20px)"
                border="1px solid"
                borderColor={glassBorder}
                p={6} 
                borderRadius="2xl" 
                boxShadow={glassShadow}
              >
                <Heading size="md" color="gray.800" mb={6} fontWeight="700" textAlign="center">
                  Quick Actions
                </Heading>
                <VStack spacing={3} align="stretch">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <MotionBox
                        key={action.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Button
                          colorScheme="red"
                          variant="ghost"
                          size="lg"
                          leftIcon={<IconComponent size={18} />}
                          onClick={() => navigate(action.path)}
                          justifyContent="start"
                          w="full"
                          h="auto"
                          py={4}
                          px={4}
                          borderRadius="xl"
                          fontWeight="600"
                          bg="rgba(255, 255, 255, 0.6)"
                          backdropFilter="blur(10px)"
                          border="1px solid"
                          borderColor="rgba(255, 255, 255, 0.2)"
                          _hover={{
                            bg: 'rgba(254, 226, 226, 0.8)',
                            borderColor: 'red.300',
                            transform: 'translateY(-2px) scale(1.02)'
                          }}
                          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                          <VStack align="start" spacing={1} w="full">
                            <Text fontWeight="700" fontSize="sm">
                              {action.label}
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontWeight="500">
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
    </Box>
  );
};

export default Dashboard;

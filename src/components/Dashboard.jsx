import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Tooltip,
  Skeleton,
  SkeletonCircle,
  SkeletonText
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
  Search,
  Star,
  MapPin,
  Phone,
  Crown,
  Zap,
  Eye,
  Calendar
} from 'lucide-react';
import { KOL_TYPES } from '../data/models';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import KOLForm from './KOLForm';

const MotionBox = motion(Box);

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { kols, loading, error, createKOL, loadKOLs } = useDatabase();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [selectedKOLType, setSelectedKOLType] = useState(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // ESC to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchTerm]);

  // Simulate search loading for better UX
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Calculate stats from KOLs
  const stats = useMemo(() => {
    if (!kols || kols.length === 0) {
      return {
        total: 0,
        socialMedia: 0,
        twitterThread: 0,
        blogger: 0,
        productionTalent: 0,
        totalValue: 0,
        averageRate: 0,
        tierBreakdown: { nano: 0, micro: 0, mid: 0, macro: 0, mega: 0 },
        platformCounts: { instagram: 0, tiktok: 0, facebook: 0, twitter: 0, blog: 0, youtube: 0 }
      };
    }

    const socialMediaKOLs = kols.filter(kol =>
      kol.kolType === 'social-media' || kol.kolType === 'instagram' || kol.kolType === 'tiktok' ||
      kol.instagram || kol.tiktok || kol.facebook
    );

    const twitterThreadKOLs = kols.filter(kol =>
      kol.kolType === 'twitter-thread' || kol.twitter || kol.thread
    );

    const bloggerKOLs = kols.filter(kol => kol.kolType === 'blogger' || kol.blog);
    const productionTalentKOLs = kols.filter(kol => kol.kolType === 'production-talent');

    const totalValue = kols.reduce((sum, kol) => sum + (parseFloat(kol.rate) || 0), 0);
    const averageRate = kols.length > 0 ? totalValue / kols.length : 0;

    // Tier breakdown
    const tierBreakdown = { nano: 0, micro: 0, mid: 0, macro: 0, mega: 0 };
    kols.forEach(kol => {
      const tier = (kol.tier || '').toLowerCase();
      if (tier.includes('nano')) tierBreakdown.nano++;
      else if (tier.includes('micro')) tierBreakdown.micro++;
      else if (tier.includes('mid')) tierBreakdown.mid++;
      else if (tier.includes('macro')) tierBreakdown.macro++;
      else if (tier.includes('mega') || tier.includes('premium')) tierBreakdown.mega++;
    });

    // Platform counts
    const platformCounts = {
      instagram: kols.filter(k => k.instagram).length,
      tiktok: kols.filter(k => k.tiktok).length,
      facebook: kols.filter(k => k.facebook).length,
      twitter: kols.filter(k => k.twitter).length,
      blog: kols.filter(k => k.blog).length,
      youtube: kols.filter(k => k.youtube).length
    };

    return {
      total: kols.length,
      socialMedia: socialMediaKOLs.length,
      twitterThread: twitterThreadKOLs.length,
      blogger: bloggerKOLs.length,
      productionTalent: productionTalentKOLs.length,
      totalValue,
      averageRate,
      tierBreakdown,
      platformCounts
    };
  }, [kols]);

  // Filter KOLs based on search term
  const filteredKOLs = useMemo(() => {
    if (!searchTerm.trim() || !kols) return [];
    const term = searchTerm.toLowerCase();
    return kols.filter(kol =>
      kol.name?.toLowerCase().includes(term) ||
      kol.niches?.some(n => n.toLowerCase().includes(term)) ||
      kol.tier?.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [searchTerm, kols]);

  // Top KOLs by rate
  const topKOLs = useMemo(() => {
    if (!kols) return [];
    return [...kols]
      .filter(kol => parseFloat(kol.rate) > 0)
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, 5);
  }, [kols]);

  // Recently added KOLs
  const recentKOLs = useMemo(() => {
    if (!kols) return [];
    return [...kols]
      .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
      .slice(0, 5);
  }, [kols]);

  const handleQuickAction = (kolType) => {
    setSelectedKOLType(kolType);
    onFormOpen();
  };

  const handleSave = async (kolData) => {
    try {
      await createKOL(kolData);
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

  const navigateToKOL = (kol) => {
    const path = kol.kolType === 'blogger' || kol.blog 
      ? '/blogger'
      : kol.kolType === 'twitter-thread' || kol.twitter || kol.thread
      ? '/twitter-thread'
      : kol.kolType === 'production-talent'
      ? '/production-talent'
      : '/social-media';
    
    // Navigate with KOL ID as query parameter and state for highlighting
    navigate(path, { 
      state: { highlightKolId: kol.id, scrollToKol: true },
    });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Box className="animate-spin" w="40px" h="40px" border="4px solid" borderColor="red.200" borderTopColor="red.500" borderRadius="full" />
          <Text fontSize="lg" color="gray.600">Loading database...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.600">Database Error</Text>
          <Text color="gray.600">{error}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Search Section - ChatGPT/Google Style */}
      <Box 
        bg="white" 
        borderBottom="1px solid" 
        borderColor="gray.200"
        pt={searchTerm ? 4 : 16}
        pb={searchTerm ? 4 : 12}
        transition="all 0.3s ease"
      >
        <Container maxW="container.md">
          <VStack spacing={searchTerm ? 0 : 8} align="center">
            {/* Logo/Title - Hidden when searching */}
            {!searchTerm && (
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VStack spacing={2}>
                  <Text fontSize="4xl" fontWeight="800" color="gray.800" textAlign="center">
                    KOL Search
                  </Text>
                  <Text color="gray.500" fontSize="md" textAlign="center">
                    Search {stats.total.toLocaleString()} KOLs by name, niche, or tier
                  </Text>
                </VStack>
              </MotionBox>
            )}

            {/* Centered Search Box */}
            <MotionBox
              w="full"
              maxW="650px"
              initial={{ scale: 1 }}
              animate={{ 
                scale: isSearchFocused && !searchTerm ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setIsSearchHovered(true)}
              onMouseLeave={() => setIsSearchHovered(false)}
            >
              <Box position="relative">
                <InputGroup size="lg">
                    <InputLeftElement 
                      pointerEvents="none"
                      height="full"
                      left="20px"
                    >
                      <MotionBox
                        animate={{
                          scale: isSearchFocused ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: isSearchFocused ? Infinity : 0,
                          repeatDelay: 2
                        }}
                      >
                        <Icon 
                          as={Search} 
                          boxSize={5} 
                          color={isSearchFocused ? 'red.500' : 'gray.500'}
                          transition="color 0.2s"
                        />
                      </MotionBox>
                    </InputLeftElement>
                    <Input
                      ref={searchInputRef}
                      placeholder="Search KOLs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      bg="white"
                      border="1px solid"
                      borderColor={isSearchFocused ? 'red.400' : isSearchHovered ? 'gray.300' : 'gray.300'}
                      borderRadius="full"
                      size="lg"
                      h="56px"
                      fontSize="lg"
                      pl="60px"
                      pr="120px"
                      fontWeight="400"
                      _focus={{ 
                        borderColor: 'red.400',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(239, 68, 68, 0.1)'
                      }}
                      _hover={{ 
                        borderColor: 'gray.400',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                      boxShadow="0 2px 6px rgba(0, 0, 0, 0.06)"
                      _placeholder={{ color: 'gray.500' }}
                      transition="all 0.2s ease"
                    />
                  </InputGroup>
                  {!searchTerm && (
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      position="absolute"
                      right="20px"
                      top="50%"
                      transform="translateY(-50%)"
                      bg="gray.100"
                      px={3}
                      py={1.5}
                      borderRadius="md"
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="600"
                      pointerEvents="none"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      ⌘K
                    </MotionBox>
                  )}
                </Box>
              </MotionBox>
            </VStack>
          </Container>

        {/* Quick Search Tips - Shows when focused but no search term */}
        {isSearchFocused && !searchTerm && (
          <Container maxW="container.md" mt={-2}>
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              textAlign="center"
              py={6}
            >
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  Try searching for:
                </Text>
                <HStack spacing={3} flexWrap="wrap" justify="center">
                  <Badge 
                    colorScheme="red" 
                    cursor="pointer" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    fontSize="sm"
                    onClick={() => setSearchTerm('Nano')}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Nano Tier
                  </Badge>
                  <Badge 
                    colorScheme="pink" 
                    cursor="pointer" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    fontSize="sm"
                    onClick={() => setSearchTerm('Beauty')}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Beauty
                  </Badge>
                  <Badge 
                    colorScheme="purple" 
                    cursor="pointer" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    fontSize="sm"
                    onClick={() => setSearchTerm('Fashion')}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Fashion
                  </Badge>
                  <Badge 
                    colorScheme="blue" 
                    cursor="pointer" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    fontSize="sm"
                    onClick={() => setSearchTerm('Tech')}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Tech
                  </Badge>
                </HStack>
              </VStack>
            </MotionBox>
          </Container>
        )}

        {/* Search Results Dropdown - Centered */}
        {searchTerm && (
          <Container maxW="container.md" mt={4}>
            <MotionBox
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              bg="white"
              borderRadius="xl"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
              maxH="500px"
              overflowY="auto"
              className="search-results"
            >
                {isSearching ? (
                  <VStack spacing={0} align="stretch" p={4}>
                    {[1, 2, 3].map((_, idx) => (
                      <Box 
                        key={idx} 
                        p={4} 
                        borderBottom={idx < 2 ? "1px solid" : "none"}
                        borderColor="gray.100"
                      >
                        <Flex gap={3} align="center">
                          <SkeletonCircle size="12" />
                          <VStack align="start" flex={1} spacing={2}>
                            <Skeleton height="16px" width="60%" />
                            <Skeleton height="12px" width="40%" />
                          </VStack>
                          <Skeleton height="20px" width="80px" />
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : filteredKOLs.length > 0 ? (
                  <VStack spacing={0} align="stretch">
                    <Box 
                      px={4} 
                      py={2} 
                      bg="red.50" 
                      borderBottom="1px solid" 
                      borderColor="red.100"
                    >
                      <HStack justify="space-between">
                        <Text fontSize="xs" fontWeight="600" color="red.700" textTransform="uppercase">
                          {filteredKOLs.length} Results Found
                        </Text>
                        <HStack spacing={1}>
                          <Icon as={Zap} boxSize={3} color="red.500" />
                          <Text fontSize="xs" color="gray.500">Quick access</Text>
                        </HStack>
                      </HStack>
                    </Box>
                    {filteredKOLs.map((kol, idx) => (
                      <MotionBox
                        key={kol.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        whileHover={{ 
                          x: 8,
                          backgroundColor: 'rgba(254, 226, 226, 0.5)'
                        }}
                      >
                        <Box
                          p={4}
                          cursor="pointer"
                          borderBottom={idx < filteredKOLs.length - 1 ? "1px solid" : "none"}
                          borderColor="gray.100"
                          onClick={() => {
                            navigateToKOL(kol);
                            setSearchTerm('');
                          }}
                          position="relative"
                          transition="all 0.2s"
                          _hover={{
                            '& .view-icon': { opacity: 1, transform: 'translateX(0)' }
                          }}
                        >
                          <Flex justify="space-between" align="center">
                            <HStack spacing={3} flex={1}>
                              <Box position="relative">
                                <Avatar size="md" name={kol.name} bg="red.500" color="white" />
                                <Circle
                                  size="18px"
                                  bg="green.400"
                                  position="absolute"
                                  bottom="0"
                                  right="0"
                                  border="2px solid white"
                                >
                                  <Icon as={Star} boxSize={2.5} color="white" />
                                </Circle>
                              </Box>
                              <VStack align="start" spacing={1} flex={1}>
                                <Text fontWeight="600" fontSize="md" color="gray.800">
                                  {kol.name}
                                </Text>
                                <HStack spacing={2} flexWrap="wrap">
                                  <Badge colorScheme="red" fontSize="xs" px={2} py={0.5}>
                                    {kol.tier}
                                  </Badge>
                                  {kol.niches?.[0] && (
                                    <HStack spacing={1}>
                                      <Text fontSize="xs" color="gray.400">•</Text>
                                      <Text fontSize="xs" color="gray.600" fontWeight="500">
                                        {kol.niches[0]}
                                      </Text>
                                    </HStack>
                                  )}
                                </HStack>
                              </VStack>
                            </HStack>
                            <VStack align="end" spacing={1}>
                              <Text fontWeight="700" color="green.600" fontSize="md">
                                RM {parseFloat(kol.rate || 0).toLocaleString()}
                              </Text>
                              <HStack 
                                className="view-icon"
                                opacity={0}
                                transform="translateX(-10px)"
                                transition="all 0.2s"
                                spacing={1}
                              >
                                <Text fontSize="xs" color="red.500" fontWeight="600">
                                  View
                                </Text>
                                <Icon as={ArrowUpRight} boxSize={3} color="red.500" />
                              </HStack>
                            </VStack>
                          </Flex>
                        </Box>
                      </MotionBox>
                    ))}
                  </VStack>
                ) : (
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    p={8}
                    textAlign="center"
                  >
                    <VStack spacing={4}>
                      <Circle size="60px" bg="gray.100">
                        <Icon as={Search} boxSize={6} color="gray.400" />
                      </Circle>
                      <VStack spacing={2}>
                        <Text fontSize="md" fontWeight="600" color="gray.700">
                          No KOLs found
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Try searching with different keywords
                        </Text>
                      </VStack>
                      <HStack spacing={2} flexWrap="wrap" justify="center" mt={2}>
                        <Text fontSize="xs" color="gray.400">Try:</Text>
                        {['Beauty', 'Fashion', 'Tech', 'Nano'].map(tag => (
                          <Badge
                            key={tag}
                            colorScheme="gray"
                            cursor="pointer"
                            onClick={() => setSearchTerm(tag)}
                            _hover={{ bg: 'red.100', color: 'red.700' }}
                            transition="all 0.2s"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </MotionBox>
                )}
              </MotionBox>
            </Container>
          )}
      </Box>

      {/* Main Content Area */}
      <Container maxW="container.xl" py={6} px={4}>
        <VStack spacing={6} align="stretch">
          {/* Main Stats Cards */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
            {[
              { label: 'Total KOLs', value: stats.total, icon: Users, color: 'red', path: '/' },
              { label: 'Social Media', value: stats.socialMedia, icon: Instagram, color: 'pink', path: '/social-media' },
              { label: 'Twitter/Thread', value: stats.twitterThread, icon: Twitter, color: 'blue', path: '/twitter-thread' },
              { label: 'Bloggers', value: stats.blogger, icon: FileText, color: 'orange', path: '/blogger' },
              { label: 'Production', value: stats.productionTalent, icon: TrendingUp, color: 'purple', path: '/production-talent' },
              { label: 'Avg Rate', value: `RM ${Math.round(stats.averageRate).toLocaleString()}`, icon: DollarSign, color: 'green', path: '/' },
            ].map((stat, index) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Box
                  bg="white"
                  p={5}
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  onClick={() => navigate(stat.path)}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'md',
                    borderColor: `${stat.color}.200`
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="start" spacing={3}>
                    <Circle size="40px" bg={`${stat.color}.100`}>
                      <Icon as={stat.icon} boxSize={5} color={`${stat.color}.500`} />
                    </Circle>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="500">
                        {stat.label}
                      </Text>
                      <Text fontSize="xl" fontWeight="700" color="gray.800">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Middle Section: Platform Distribution & Tier Breakdown */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Platform Distribution */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <Text fontSize="lg" fontWeight="600" color="gray.800" mb={4}>
                Platform Distribution
              </Text>
              <VStack spacing={3} align="stretch">
                {[
                  { name: 'Instagram', count: stats.platformCounts.instagram, color: 'pink', icon: '📸' },
                  { name: 'TikTok', count: stats.platformCounts.tiktok, color: 'gray', icon: '🎵' },
                  { name: 'Facebook', count: stats.platformCounts.facebook, color: 'blue', icon: '👤' },
                  { name: 'Twitter/X', count: stats.platformCounts.twitter, color: 'cyan', icon: '🐦' },
                  { name: 'Blog', count: stats.platformCounts.blog, color: 'orange', icon: '📝' },
                  { name: 'YouTube', count: stats.platformCounts.youtube, color: 'red', icon: '▶️' },
                ].map(platform => (
                  <Box key={platform.name}>
                    <Flex justify="space-between" mb={1}>
                      <HStack>
                        <Text fontSize="sm">{platform.icon}</Text>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">{platform.name}</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="600" color="gray.600">
                        {platform.count} ({stats.total > 0 ? Math.round((platform.count / stats.total) * 100) : 0}%)
                      </Text>
                    </Flex>
                    <Progress
                      value={stats.total > 0 ? (platform.count / stats.total) * 100 : 0}
                      size="sm"
                      colorScheme={platform.color}
                      borderRadius="full"
                      bg="gray.100"
                    />
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Tier Breakdown */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <Text fontSize="lg" fontWeight="600" color="gray.800" mb={4}>
                KOL Tier Breakdown
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                {[
                  { tier: 'Mega/Premium', count: stats.tierBreakdown.mega, color: 'purple', icon: Crown },
                  { tier: 'Macro', count: stats.tierBreakdown.macro, color: 'red', icon: Zap },
                  { tier: 'Mid-tier', count: stats.tierBreakdown.mid, color: 'orange', icon: Star },
                  { tier: 'Micro', count: stats.tierBreakdown.micro, color: 'blue', icon: TrendingUp },
                  { tier: 'Nano', count: stats.tierBreakdown.nano, color: 'green', icon: Users },
                ].map(item => (
                  <Box
                    key={item.tier}
                    p={4}
                    bg={`${item.color}.50`}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={`${item.color}.100`}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500">{item.tier}</Text>
                        <Text fontSize="xl" fontWeight="700" color={`${item.color}.600`}>
                          {item.count}
                        </Text>
                      </VStack>
                      <Circle size="36px" bg={`${item.color}.100`}>
                        <Icon as={item.icon} boxSize={4} color={`${item.color}.500`} />
                      </Circle>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Grid>

          {/* Bottom Section: Top Rated & Recent KOLs */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Top Rated KOLs */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <Flex justify="space-between" align="center" mb={4}>
                <HStack>
                  <Icon as={Crown} color="yellow.500" />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">Top Rated KOLs</Text>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  rightIcon={<ArrowUpRight size={14} />}
                  onClick={() => navigate('/social-media')}
                >
                  View All
                </Button>
              </Flex>
              <VStack spacing={3} align="stretch">
                {topKOLs.map((kol, idx) => (
                  <Box
                    key={kol.id}
                    p={3}
                    bg="gray.50"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => navigateToKOL(kol)}
                    _hover={{ bg: 'red.50' }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Circle size="28px" bg={idx < 3 ? 'yellow.400' : 'gray.300'} color="white" fontSize="sm" fontWeight="bold">
                          {idx + 1}
                        </Circle>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600" fontSize="sm" noOfLines={1}>{kol.name}</Text>
                          <Text fontSize="xs" color="gray.500">{kol.tier}</Text>
                        </VStack>
                      </HStack>
                      <Text fontWeight="700" color="green.600" fontSize="sm">
                        RM {parseFloat(kol.rate).toLocaleString()}
                      </Text>
                    </Flex>
                  </Box>
                ))}
                {topKOLs.length === 0 && (
                  <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>No KOLs with rates yet</Text>
                )}
              </VStack>
            </Box>

            {/* Quick Actions */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <Flex justify="space-between" align="center" mb={4}>
                <HStack>
                  <Icon as={Plus} color="green.500" />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">Quick Actions</Text>
                </HStack>
              </Flex>
              <SimpleGrid columns={2} spacing={3}>
                {[
                  { label: 'Social Media KOL', icon: Instagram, type: KOL_TYPES.SOCIAL_MEDIA, color: 'pink' },
                  { label: 'Twitter/Thread', icon: Twitter, type: KOL_TYPES.TWITTER_THREAD, color: 'blue' },
                  { label: 'Blogger', icon: FileText, type: KOL_TYPES.BLOGGER, color: 'orange' },
                  { label: 'Production Talent', icon: TrendingUp, type: KOL_TYPES.PRODUCTION_TALENT, color: 'purple' },
                ].map(action => (
                  <Button
                    key={action.label}
                    leftIcon={<Icon as={action.icon} />}
                    variant="outline"
                    colorScheme={action.color}
                    size="lg"
                    h="auto"
                    py={4}
                    onClick={() => handleQuickAction(action.type)}
                    borderRadius="xl"
                    justifyContent="start"
                    fontWeight="500"
                    _hover={{ bg: `${action.color}.50` }}
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm">Add {action.label}</Text>
                    </VStack>
                  </Button>
                ))}
              </SimpleGrid>

              <Divider my={4} />

              <Button
                w="full"
                colorScheme="red"
                size="lg"
                leftIcon={<Eye size={18} />}
                onClick={() => navigate('/social-media')}
                borderRadius="xl"
              >
                Browse All KOLs
              </Button>
            </Box>
          </Grid>
        </VStack>
      </Container>

      {/* Add KOL Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={onFormClose}
        size={{ base: "full", lg: "6xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius={{ base: "0", md: "2xl" }} m={{ base: 0, md: 4 }}>
          <ModalHeader color="red.600" fontWeight="700">
            Add New {selectedKOLType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} KOL
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedKOLType && (
              <KOLForm
                initialData={null}
                kolType={selectedKOLType}
                onSave={handleSave}
                onCancel={onFormClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;

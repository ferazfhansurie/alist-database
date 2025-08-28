import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Instagram,
  Facebook,
  ExternalLink,
  Calendar,
  User,
  MapPin,
  Phone
} from 'lucide-react';
import { sampleKOLData, KOL_TYPES, TIERS, NICHES, STATES } from '../data/models';
import KOLForm from './KOLForm';

const MotionBox = motion(Box);

const SocialMediaKOL = () => {
  const [kolData, setKolData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedNiche, setSelectedNiche] = useState('All Niches');
  const [selectedState, setSelectedState] = useState('All States');
  const [editingKOL, setEditingKOL] = useState(null);
  const [viewingKOL, setViewingKOL] = useState(null);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isViewOpen, onViewOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();

  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

  // Additional data for dropdowns
  const GENDERS = ['Male', 'Female', 'Other'];
  const HIJAB_OPTIONS = ['Hijab', 'Free Hair'];
  const RACES = ['Malay', 'Chinese', 'Indian', 'Other'];
  const PICS = ['Amir', 'Tika', 'Aina'];

  useEffect(() => {
    // Filter data based on KOL type
    const socialMediaKOLs = sampleKOLData.filter(kol => kol.kolType === KOL_TYPES.SOCIAL_MEDIA);
    setKolData(socialMediaKOLs);
    setFilteredData(socialMediaKOLs);
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedTier, selectedNiche, selectedState, kolData]);

  const filterData = () => {
    let filtered = kolData;

    if (searchTerm) {
      filtered = filtered.filter(kol => 
        kol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kol.contactNumber.includes(searchTerm) ||
        kol.niches.some(niche => niche.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTier !== 'All Tiers') {
      filtered = filtered.filter(kol => kol.tier === selectedTier);
    }

    if (selectedNiche !== 'All Niches') {
      filtered = filtered.filter(kol => kol.niches.includes(selectedNiche));
    }

    if (selectedState !== 'All States') {
      filtered = filtered.filter(kol => kol.address === selectedState);
    }

    setFilteredData(filtered);
  };

  const handleSave = async (kolData) => {
    try {
      if (editingKOL) {
        // Update existing KOL
        const updatedData = kolData.map(kol => 
          kol.id === editingKOL.id ? { ...kolData, id: kol.id } : kol
        );
        setKolData(updatedData);
        toast({
          title: 'Updated!',
          description: 'KOL record updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new KOL
        const newKOL = { ...kolData, id: Date.now().toString() };
        setKolData(prev => [...prev, newKOL]);
        toast({
          title: 'Added!',
          description: 'New KOL record added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setEditingKOL(null);
      onFormClose();
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

  const handleEdit = (kol) => {
    setEditingKOL(kol);
    onFormOpen();
  };

  const handleView = (kol) => {
    setViewingKOL(kol);
    onViewOpen();
  };

  const handleDelete = (kolId) => {
    if (window.confirm('Are you sure you want to delete this KOL record?')) {
      setKolData(prev => prev.filter(kol => kol.id !== kolId));
      toast({
        title: 'Deleted!',
        description: 'KOL record deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getTierColor = (tier) => {
    if (tier.includes('Premium')) return 'red';
    if (tier.includes('Mid-tier')) return 'orange';
    if (tier.includes('Emerging')) return 'yellow';
    return 'gray';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, red.50, white)"
      py={6}
      px={4}
    >
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={6} align="stretch">
         

            {/* Search and Filters */}
            <Box 
              bg={glassBg}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={glassBorder}
              p={5} 
              borderRadius="2xl"
              boxShadow={glassShadow}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
                opacity: 0.8
              }}
            >
              {/* Search Bar - Full Width */}
              <Box mb={4}>
                <InputGroup size="lg">
                  <InputLeftElement>
                    <Search size={18} color="#dc2626" />
                  </InputLeftElement>
                  <Input
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.2)"
                    borderRadius="xl"
                    placeholder="🔍 Search KOLs by name, contact, niche, or platform..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fontSize="sm"
                    fontWeight="500"
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _placeholder={{
                      color: 'gray.500',
                      fontWeight: '400'
                    }}
                  />
                </InputGroup>
              </Box>

              {/* Filters Row - Compact Grid */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={3} mb={4}>
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Tier
                  </Text>
                  <Select
                    size="md"
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.15)"
                    borderRadius="lg"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    fontSize="sm"
                    fontWeight="500"
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300',
                      bg: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <option value="All Tiers">🎯 All Tiers</option>
                    {TIERS.map(tier => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Niche
                  </Text>
                  <Select
                    size="md"
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.15)"
                    borderRadius="lg"
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    fontSize="sm"
                    fontWeight="500"
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300',
                      bg: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <option value="All Niches">🏷️ All Niches</option>
                    {NICHES.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Location
                  </Text>
                  <Select
                    size="md"
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.15)"
                    borderRadius="lg"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    fontSize="sm"
                    fontWeight="500"
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300',
                      bg: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <option value="All States">📍 All States</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Actions
                  </Text>
                  <Button
                    colorScheme="red"
                    leftIcon={<Plus size={16} />}
                    onClick={() => {
                      setEditingKOL(null);
                      onFormOpen();
                    }}
                    size="md"
                    borderRadius="lg"
                    fontWeight="600"
                    w="full"
                    bg="rgba(220, 38, 38, 0.9)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.3)"
                    _hover={{
                      bg: 'rgba(220, 38, 38, 1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    Add KOL
                  </Button>
                </Box>
              </Grid>

              {/* Results Summary & Quick Actions */}
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <VStack align="start" spacing={1}>
                  <HStack spacing={3}>
                    <Badge 
                      colorScheme="red" 
                      variant="subtle" 
                      borderRadius="full" 
                      px={3} 
                      py={1}
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {filteredData.length} Results
                    </Badge>
                    <Badge 
                      colorScheme="blue" 
                      variant="subtle" 
                      borderRadius="full" 
                      px={3} 
                      py={1}
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {kolData.length} Total
                    </Badge>
                    {filteredData.length !== kolData.length && (
                      <Badge 
                        colorScheme="green" 
                        variant="subtle" 
                        borderRadius="full" 
                        px={3} 
                        py={1}
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {kolData.length - filteredData.length} Hidden
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {searchTerm || selectedTier !== 'All Tiers' || selectedNiche !== 'All Niches' || selectedState !== 'All States' 
                      ? 'Active filters applied' 
                      : 'No filters applied'
                    }
                  </Text>
                </VStack>

                {/* Quick Filter Actions */}
                <HStack spacing={2}>
                  {(searchTerm || selectedTier !== 'All Tiers' || selectedNiche !== 'All Niches' || selectedState !== 'All States') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTier('All Tiers');
                        setSelectedNiche('All Niches');
                        setSelectedState('All States');
                      }}
                      borderRadius="lg"
                      fontSize="xs"
                      fontWeight="500"
                      _hover={{
                        bg: 'rgba(254, 226, 226, 0.3)',
                        transform: 'scale(1.05)'
                      }}
                      transition="all 0.2s ease"
                    >
                      🗑️ Clear All
                    </Button>
                  )}
                </HStack>
              </Flex>
            </Box>

            {/* Data Table */}
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead position="sticky" top={0} bg="rgba(220, 38, 38, 0.1)" zIndex={1} borderBottom="1px solid" borderColor="rgba(220, 38, 38, 0.2)">
                  <Tr>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="150px"
                    >
                      KOL Details
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                    >
                      Rate (RM)
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="80px"
                    >
                      Tier
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="70px"
                    >
                      Gender
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                    >
                      Niche
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="90px"
                    >
                      Hijab/Free Hair
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="70px"
                    >
                      Race
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="80px"
                    >
                      Address
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                    >
                      Contact
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="80px"
                    >
                      Date
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="120px"
                    >
                      Rate Details
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="70px"
                    >
                      PIC
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredData.map((kol, index) => (
                    <Tr 
                      key={kol.id}
                      _hover={{ bg: 'rgba(254, 226, 226, 0.3)' }}
                      fontSize="xs"
                      borderBottom="1px solid"
                      borderColor="rgba(220, 38, 38, 0.1)"
                      height="80px"
                    >
                      {/* KOL Details */}
                      <Td px={3} py={3}>
                        <VStack align="start" spacing={2} maxH="60px" overflow="hidden">
                          <Text fontWeight="700" color="gray.800" fontSize="sm" noOfLines={1}>
                            {kol.name || 'No Name'}
                          </Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {kol.instagram && (
                              <HStack 
                                bg="rgba(255, 255, 255, 0.6)"
                                backdropFilter="blur(10px)"
                                p={1}
                                borderRadius="md"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.2)"
                                cursor="pointer"
                                onClick={() => openLink(kol.instagram)}
                                _hover={{
                                  bg: 'rgba(254, 226, 226, 0.8)',
                                  transform: 'translateX(2px)'
                                }}
                                transition="all 0.2s ease"
                              >
                                <Instagram size={10} color="#E4405F" />
                                <Text fontSize="xs" color="blue.600" fontWeight="600">IG</Text>
                              </HStack>
                            )}
                            {kol.tiktok && (
                              <HStack 
                                bg="rgba(255, 255, 255, 0.6)"
                                backdropFilter="blur(10px)"
                                p={1}
                                borderRadius="md"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.2)"
                                cursor="pointer"
                                onClick={() => openLink(kol.tiktok)}
                                _hover={{
                                  bg: 'rgba(254, 226, 226, 0.8)',
                                  transform: 'translateX(2px)'
                                }}
                                transition="all 0.2s ease"
                              >
                                <Text fontSize="xs" color="black" fontWeight="600">🎵</Text>
                                <Text fontSize="xs" color="blue.600" fontWeight="600">TT</Text>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                      </Td>

                      {/* Rate */}
                      <Td px={3} py={3}>
                        <Text fontWeight="800" color="red.600" fontSize="sm" noOfLines={1}>
                          RM {kol.rate.toLocaleString()}
                        </Text>
                      </Td>

                      {/* Tier */}
                      <Td px={3} py={3}>
                        <Badge 
                          colorScheme={getTierColor(kol.tier)} 
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontWeight="600"
                          fontSize="xs"
                          noOfLines={1}
                        >
                          {kol.tier}
                        </Badge>
                      </Td>

                      {/* Gender */}
                      <Td px={3} py={3}>
                        <Badge 
                          colorScheme="purple" 
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontWeight="600"
                          fontSize="xs"
                          noOfLines={1}
                        >
                          {kol.gender || 'N/A'}
                        </Badge>
                      </Td>

                      {/* Niche */}
                      <Td px={3} py={3}>
                        <VStack align="start" spacing={1} maxH="60px" overflow="hidden">
                          {kol.niches.slice(0, 2).map(niche => (
                            <Badge 
                              key={niche} 
                              colorScheme="red" 
                              variant="outline" 
                              size="sm"
                              borderRadius="full"
                              fontWeight="600"
                              borderWidth="1.5px"
                              fontSize="xs"
                              noOfLines={1}
                            >
                              {niche}
                            </Badge>
                          ))}
                          {kol.niches.length > 2 && (
                            <Text fontSize="xs" color="gray.500" fontWeight="500">
                              +{kol.niches.length - 2}
                            </Text>
                          )}
                        </VStack>
                      </Td>

                      {/* Hijab/Free Hair */}
                      <Td px={3} py={3}>
                        <Badge 
                          colorScheme="teal" 
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontWeight="600"
                          fontSize="xs"
                          noOfLines={1}
                        >
                          {kol.hijabStatus || 'N/A'}
                        </Badge>
                      </Td>

                      {/* Race */}
                      <Td px={3} py={3}>
                        <Badge 
                          colorScheme="blue" 
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontWeight="600"
                          fontSize="xs"
                          noOfLines={1}
                        >
                          {kol.race || 'N/A'}
                        </Badge>
                      </Td>

                      {/* Address */}
                      <Td px={3} py={3}>
                        <Text fontSize="xs" fontWeight="500" noOfLines={1}>{kol.address || 'N/A'}</Text>
                      </Td>

                      {/* Contact */}
                      <Td px={3} py={3}>
                        <Text 
                          fontSize="xs" 
                          fontFamily="mono" 
                          fontWeight="600"
                          color="gray.700"
                          noOfLines={1}
                        >
                          {kol.contactNumber || 'N/A'}
                        </Text>
                      </Td>

                      {/* Date */}
                      <Td px={3} py={3}>
                        <HStack spacing={1}>
                          <Calendar size={10} color="#666" />
                          <Text fontSize="xs" fontWeight="500" noOfLines={1}>
                            {formatDate(kol.dateAdded || kol.createdAt)}
                          </Text>
                        </HStack>
                      </Td>

                      {/* Rate Details */}
                      <Td px={3} py={3}>
                        <Text fontSize="xs" color="gray.600" fontWeight="500" maxW="120px" noOfLines={2}>
                          {kol.rateDetails || 'No details'}
                        </Text>
                      </Td>

                      {/* PIC */}
                      <Td px={3} py={3}>
                        <Badge 
                          colorScheme="green" 
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontWeight="600"
                          fontSize="xs"
                          noOfLines={1}
                        >
                          {kol.pic || 'N/A'}
                        </Badge>
                      </Td>

                      {/* Actions */}
                      <Td px={3} py={3}>
                        <HStack spacing={1}>
                          <IconButton
                            size="xs"
                            icon={<Eye size={10} />}
                            onClick={() => handleView(kol)}
                            colorScheme="blue"
                            variant="outline"
                            aria-label="View KOL"
                            borderRadius="md"
                            _hover={{
                              bg: 'blue.50',
                              transform: 'scale(1.1)'
                            }}
                            transition="all 0.2s ease"
                          />
                          <IconButton
                            size="xs"
                            icon={<Edit size={10} />}
                            onClick={() => handleEdit(kol)}
                            colorScheme="green"
                            variant="outline"
                            aria-label="Edit KOL"
                            borderRadius="md"
                            _hover={{
                              bg: 'green.50',
                              transform: 'scale(1.1)'
                            }}
                            transition="all 0.2s ease"
                          />
                          <IconButton
                            size="xs"
                            icon={<Trash2 size={10} />}
                            onClick={() => handleDelete(kol.id)}
                            colorScheme="red"
                            variant="outline"
                            aria-label="Delete KOL"
                            borderRadius="md"
                            _hover={{
                              bg: 'red.50',
                              transform: 'scale(1.1)'
                            }}
                            transition="all 0.2s ease"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </MotionBox>

        {/* Add/Edit Form Modal */}
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
              {editingKOL ? 'Edit KOL' : 'Add New Social Media KOL'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <KOLForm
                initialData={editingKOL}
                kolType={KOL_TYPES.SOCIAL_MEDIA}
                onSave={handleSave}
                onCancel={onFormClose}
                title={editingKOL ? 'Edit KOL' : 'Add New Social Media KOL'}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* View KOL Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent 
            bg={glassBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={glassBorder}
            borderRadius="2xl"
            boxShadow={glassShadow}
          >
            <ModalHeader color="red.600" fontWeight="700">KOL Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {viewingKOL && (
                <VStack spacing={4} align="stretch">
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Name:</Text>
                    <Text fontWeight="600">{viewingKOL.name}</Text>
                  </Box>
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Contact:</Text>
                    <Text fontWeight="600">{viewingKOL.contactNumber}</Text>
                  </Box>
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Rate:</Text>
                    <Text color="red.600" fontWeight="800">RM {viewingKOL.rate.toLocaleString()}</Text>
                  </Box>
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Tier:</Text>
                    <Badge 
                      colorScheme={getTierColor(viewingKOL.tier)}
                      borderRadius="full"
                      fontWeight="600"
                    >
                      {viewingKOL.tier}
                    </Badge>
                  </Box>
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Niches:</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {viewingKOL.niches.map(niche => (
                        <Badge 
                          key={niche} 
                          colorScheme="red" 
                          variant="outline"
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {niche}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                  <Box 
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text fontWeight="700" color="gray.700" mb={2}>Notes:</Text>
                    <Text fontWeight="500">{viewingKOL.notes || 'No additional notes'}</Text>
                  </Box>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default SocialMediaKOL;

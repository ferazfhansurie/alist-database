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
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Target,
  FileText,
  ExternalLink,
  User,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { KOL_TYPES, TIERS, NICHES, STATES } from '../data/models';
import KOLForm from './KOLForm';
import { useDatabase } from '../contexts/DatabaseContext';

const MotionBox = motion(Box);

const BloggerKOL = () => {
  const { loadKOLsByType, createKOL, updateKOL, deleteKOL } = useDatabase();
  const [kolData, setKolData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedNiche, setSelectedNiche] = useState('All Niches');
  const [selectedState, setSelectedState] = useState('All States');
  const [editingKOL, setEditingKOL] = useState(null);
  const [viewingKOL, setViewingKOL] = useState(null);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();


  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

  useEffect(() => {
    // Load blogger KOLs from database
    const loadBloggerKOLs = async () => {
      try {
        const bloggerKOLs = await loadKOLsByType(KOL_TYPES.BLOGGER);
        setKolData(bloggerKOLs);
        setFilteredData(bloggerKOLs);
      } catch (error) {
        console.error('Error loading blogger KOLs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blogger KOLs',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    loadBloggerKOLs();
  }, [loadKOLsByType, toast]);

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
        await updateKOL(editingKOL.id, kolData);
        toast({
          title: 'Updated!',
          description: 'KOL record updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new KOL
        await createKOL(kolData);
        toast({
          title: 'Added!',
          description: 'New KOL record added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Reload data from database
      const bloggerKOLs = await loadKOLsByType(KOL_TYPES.BLOGGER);
      setKolData(bloggerKOLs);
      setFilteredData(bloggerKOLs);
      
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

  const handleDelete = async (kolId) => {
    if (window.confirm('Are you sure you want to delete this KOL record?')) {
      try {
        await deleteKOL(kolId);
        
        // Reload data from database
        const bloggerKOLs = await loadKOLsByType(KOL_TYPES.BLOGGER);
        setKolData(bloggerKOLs);
        setFilteredData(bloggerKOLs);
        
        toast({
          title: 'Deleted!',
          description: 'KOL record deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error!',
          description: 'Failed to delete KOL record',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
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
                    placeholder="🔍 Search Bloggers by name, contact, niche, or blog..."
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
                      Name
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="120px"
                    >
                      Blog URL
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
                      minW="100px"
                    >
                      Niches
                    </Th>
                    <Th 
                      px={3} 
                      py={3} 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="80px"
                    >
                      Location
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
                  {filteredData.map((kol) => (
                    <Tr 
                      key={kol.id}
                      _hover={{ bg: 'rgba(254, 226, 226, 0.3)' }}
                      fontSize="xs"
                      borderBottom="1px solid"
                      borderColor="rgba(220, 38, 38, 0.1)"
                      height="80px"
                    >
                      <Td px={3} py={3}>
                        <VStack align="start" spacing={1} maxH="60px" overflow="hidden">
                          <Text fontWeight="700" color="gray.800" fontSize="sm" noOfLines={1}>
                            {kol.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {kol.gender} • {kol.race}
                          </Text>
                        </VStack>
                      </Td>
                      <Td px={3} py={3}>
                        {kol.blog && (
                          <HStack spacing={2} maxH="60px" overflow="hidden">
                            <FileText size={12} color="#FF6B35" />
                            <Text
                              fontSize="xs"
                              color="blue.500"
                              cursor="pointer"
                              onClick={() => openLink(kol.blog)}
                              _hover={{ textDecoration: 'underline' }}
                              noOfLines={1}
                            >
                              Visit Blog
                            </Text>
                            <ExternalLink size={10} color="#666" />
                          </HStack>
                        )}
                      </Td>
                      <Td px={3} py={3}>
                        <Text fontWeight="800" color="red.600" fontSize="sm" noOfLines={1}>
                          RM {kol.rate.toLocaleString()}
                        </Text>
                        {kol.rateDetails && (
                          <Text fontSize="xs" color="gray.500" mt={1} noOfLines={1}>
                            {kol.rateDetails}
                          </Text>
                        )}
                      </Td>
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
                      <Td px={3} py={3}>
                        <Text fontSize="xs" fontWeight="500" noOfLines={1}>{kol.address}</Text>
                      </Td>
                      <Td px={3} py={3}>
                        <Text 
                          fontSize="xs" 
                          fontFamily="mono" 
                          fontWeight="600"
                          color="gray.700"
                          noOfLines={1}
                        >
                          {kol.contactNumber}
                        </Text>
                      </Td>
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
                          {kol.pic}
                        </Badge>
                      </Td>
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
              {editingKOL ? 'Edit KOL' : 'Add New Blogger KOL'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <KOLForm
                initialData={editingKOL}
                kolType={KOL_TYPES.BLOGGER}
                onSave={handleSave}
                onCancel={onFormClose}
                title={editingKOL ? 'Edit KOL' : 'Add New Blogger KOL'}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* View KOL Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
          <ModalOverlay backdropFilter="blur(25px)" bg="rgba(0, 0, 0, 0.3)" />
          <ModalContent 
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(40px)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.2)"
            borderRadius="2xl"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            overflow="hidden"
            position="relative"
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
            <ModalHeader 
              bg="rgba(220, 38, 38, 0.1)"
              backdropFilter="blur(20px)"
              color="red.700"
              fontWeight="700"
              fontSize="xl"
              textAlign="center"
              py={4}
              borderBottom="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
            >
              <Flex align="center" justify="center" gap={2}>
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg="rgba(220, 38, 38, 0.2)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <User size={18} color="#dc2626" />
                </Box>
                {viewingKOL?.name}
              </Flex>
            </ModalHeader>
            <ModalCloseButton 
              color="red.600" 
              bg="rgba(255, 255, 255, 0.2)"
              borderRadius="full"
              size="sm"
              _hover={{ bg: 'rgba(255, 255, 255, 0.3)' }}
              top={3}
              right={3}
            />
            <ModalBody p={6}>
              {viewingKOL && (
                <VStack spacing={4} align="stretch">
                  {/* Quick Stats Row */}
                  <SimpleGrid columns={3} spacing={3}>
                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      textAlign="center"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>RATE</Text>
                      <Text fontSize="lg" fontWeight="800" color="red.600">
                        RM {viewingKOL.rate?.toLocaleString() || '0'}
                      </Text>
                    </Box>
                    
                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      textAlign="center"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>TIER</Text>
                      <Badge 
                        colorScheme={getTierColor(viewingKOL.tier)}
                        variant="solid"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                        fontWeight="700"
                      >
                        {viewingKOL.tier}
                      </Badge>
                    </Box>
                    
                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      textAlign="center"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>TYPE</Text>
                      <Text fontSize="xs" fontWeight="700" color="red.600" textTransform="uppercase">
                        {viewingKOL.kolType}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Contact & Location */}
                  <SimpleGrid columns={2} spacing={3}>
                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                          <Phone size={14} color="#dc2626" />
                        </Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600">Contact</Text>
                      </Flex>
                      <Text fontSize="sm" fontWeight="600" color="gray.800">
                        {viewingKOL.contactNumber || 'Not provided'}
                      </Text>
                    </Box>

                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                          <MapPin size={14} color="#dc2626" />
                        </Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600">Location</Text>
                      </Flex>
                      <Text fontSize="sm" fontWeight="600" color="gray.800">
                        {viewingKOL.address || 'Not specified'}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Niches */}
                  <Box 
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Flex align="center" gap={2} mb={3}>
                      <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                        <Target size={14} color="#dc2626" />
                      </Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700">Niches</Text>
                    </Flex>
                    <HStack spacing={2} flexWrap="wrap">
                      {viewingKOL.niches && viewingKOL.niches.length > 0 ? (
                        viewingKOL.niches.map(niche => (
                          <Badge 
                            key={niche} 
                            colorScheme="red" 
                            variant="outline"
                            borderRadius="full"
                            px={2}
                            py={1}
                            fontWeight="500"
                            fontSize="xs"
                            borderWidth="1px"
                            _hover={{ bg: 'red.500', color: 'white' }}
                            transition="all 0.2s ease"
                          >
                            {niche}
                          </Badge>
                        ))
                      ) : (
                        <Text color="gray.500" fontStyle="italic" fontSize="sm">
                          No niches specified
                        </Text>
                      )}
                    </HStack>
                  </Box>

                  {/* Additional Info Grid */}
                  <Box 
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Flex align="center" gap={2} mb={3}>
                      <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                        <FileText size={14} color="#dc2626" />
                      </Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700">Details</Text>
                    </Flex>
                    <SimpleGrid columns={2} spacing={3}>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Gender</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {viewingKOL.gender || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Hair</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {viewingKOL.hairStyle || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Race</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {viewingKOL.race || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>PIC</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {viewingKOL.pic || 'N/A'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                    
                    {viewingKOL.notes && (
                      <Box mt={3} p={3} bg="rgba(0, 0, 0, 0.05)" borderRadius="lg">
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Notes</Text>
                        <Text fontSize="sm" color="gray.700" fontStyle="italic">
                          {viewingKOL.notes}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {/* Social Media Links */}
                  {(viewingKOL.instagram || viewingKOL.tiktok || viewingKOL.facebook || viewingKOL.twitter || viewingKOL.thread || viewingKOL.blog) && (
                    <Box 
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                    >
                      <Flex align="center" gap={2} mb={3}>
                        <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                          <Instagram size={14} color="#dc2626" />
                        </Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">Social Media</Text>
                      </Flex>
                      <SimpleGrid columns={3} spacing={2}>
                        {viewingKOL.instagram && (
                          <Button
                            leftIcon={<Instagram size={12} />}
                            colorScheme="pink"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.instagram)}
                            _hover={{ bg: 'rgba(236, 72, 153, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            IG
                          </Button>
                        )}
                        {viewingKOL.tiktok && (
                          <Button
                            leftIcon={<span>🎵</span>}
                            colorScheme="blackAlpha"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.tiktok)}
                            _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            TT
                          </Button>
                        )}
                        {viewingKOL.facebook && (
                          <Button
                            leftIcon={<Facebook size={12} />}
                            colorScheme="blue"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.facebook)}
                            _hover={{ bg: 'rgba(59, 130, 246, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            FB
                          </Button>
                        )}
                        {viewingKOL.twitter && (
                          <Button
                            leftIcon={<Twitter size={12} />}
                            colorScheme="blue"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.twitter)}
                            _hover={{ bg: 'rgba(59, 130, 246, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            TW
                          </Button>
                        )}
                        {viewingKOL.thread && (
                          <Button
                            leftIcon={<span>🧵</span>}
                            colorScheme="blackAlpha"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.thread)}
                            _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            TH
                          </Button>
                        )}
                        {viewingKOL.blog && (
                          <Button
                            leftIcon={<FileText size={12} />}
                            colorScheme="orange"
                            variant="ghost"
                            size="xs"
                            onClick={() => openLink(viewingKOL.blog)}
                            _hover={{ bg: 'rgba(249, 115, 22, 0.1)' }}
                            transition="all 0.2s ease"
                          >
                            Blog
                          </Button>
                        )}
                      </SimpleGrid>
                    </Box>
                  )}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default BloggerKOL;

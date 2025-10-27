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
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Camera,
  ExternalLink,
  User, 
  Phone,
  MapPin,
  Target,
  FileText, 
  Mic,
  Video
} from 'lucide-react';
import { KOL_TYPES, TIERS, TALENT_NICHES, STATES } from '../data/models';
import KOLForm from './KOLForm';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const ProductionTalentKOL = () => {
  const { loadKOLsByType, createKOL, updateKOL, deleteKOL } = useDatabase();
  const { canEdit, canDelete, canCopy } = useAuth();
  const [kolData, setKolData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedNiche, setSelectedNiche] = useState('All Niches');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedRace, setSelectedRace] = useState('All Races');
  const [selectedHijab, setSelectedHijab] = useState('All');
  const [selectedPic, setSelectedPic] = useState('All PICs');
  const [editingKOL, setEditingKOL] = useState(null);
  const [viewingKOL, setViewingKOL] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();


  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

  // Filter options
  const GENDERS = ['Male', 'Female', 'Other'];
  const RACES = ['Malay', 'Chinese', 'Indian', 'Other'];
  const HIJAB_OPTIONS = ['Hijab', 'Free Hair'];
  const PICS = ['Amir', 'Tika', 'Aina'];

  useEffect(() => {
    // Load production talent KOLs from database
    const loadProductionKOLs = async () => {
      try {
        const productionKOLs = await loadKOLsByType(KOL_TYPES.PRODUCTION_TALENT);
        setKolData(productionKOLs);
        setFilteredData(productionKOLs);
      } catch (error) {
        console.error('Error loading production talent KOLs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load production talent KOLs',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    loadProductionKOLs();
  }, [loadKOLsByType, toast]);

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedTier, selectedNiche, selectedState, selectedGender, selectedRace, selectedHijab, selectedPic, kolData]);

  const filterData = () => {
    let filtered = kolData;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(kol => {
        // Safe string comparison helper
        const matchesText = (field) => field && field.toLowerCase().includes(searchLower);
        
        return (
          matchesText(kol.name) ||
          matchesText(kol.contactNumber) ||
          matchesText(kol.tier) ||
          matchesText(kol.gender) ||
          matchesText(kol.race) ||
          matchesText(kol.address) ||
          matchesText(kol.pic) ||
          matchesText(kol.hijabStatus) ||
          (kol.niches && Array.isArray(kol.niches) && 
           kol.niches.some(niche => matchesText(niche)))
        );
      });
    }

    if (selectedTier !== 'All Tiers') {
      filtered = filtered.filter(kol => kol.tier === selectedTier);
    }

    if (selectedNiche !== 'All Niches') {
      filtered = filtered.filter(kol => kol.niches && Array.isArray(kol.niches) && kol.niches.includes(selectedNiche));
    }

    if (selectedState !== 'All States') {
      filtered = filtered.filter(kol => kol.address === selectedState);
    }

    if (selectedGender !== 'All Genders') {
      filtered = filtered.filter(kol => kol.gender === selectedGender);
    }

    if (selectedRace !== 'All Races') {
      filtered = filtered.filter(kol => kol.race === selectedRace);
    }

    if (selectedHijab !== 'All') {
      filtered = filtered.filter(kol => kol.hijabStatus === selectedHijab);
    }

    if (selectedPic !== 'All PICs') {
      filtered = filtered.filter(kol => kol.pic === selectedPic);
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
      const productionKOLs = await loadKOLsByType(KOL_TYPES.PRODUCTION_TALENT);
      setKolData(productionKOLs);
      setFilteredData(productionKOLs);
      
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
        const productionKOLs = await loadKOLsByType(KOL_TYPES.PRODUCTION_TALENT);
        setKolData(productionKOLs);
        setFilteredData(productionKOLs);
        
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

  const getTierColor = (tier) => {
    if (tier.includes('Premium')) return 'red';
    if (tier.includes('Mid-tier')) return 'orange';
    if (tier.includes('Emerging')) return 'yellow';
    return 'gray';
  };

  const getTalentTypeIcon = (niches) => {
    if (niches.some(niche => niche.includes('Model'))) return <Camera size={14} color="#FF6B35" />;
    if (niches.some(niche => niche.includes('Voice'))) return <Mic size={14} color="#4ECDC4" />;
    if (niches.some(niche => niche.includes('Actor'))) return <Video size={14} color="#45B7D1" />;
    return <Users size={14} color="#96CEB4" />;
  };

  const getTalentTypeLabel = (niches) => {
    if (niches.some(niche => niche.includes('Model'))) return 'Model';
    if (niches.some(niche => niche.includes('Voice'))) return 'Voice Talent';
    if (niches.some(niche => niche.includes('Actor'))) return 'Actor';
    return 'Production Talent';
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, red.50, white)"
      py={6}
      px={4}
      // Prevent copy for viewers
      sx={!canCopy() ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        '& *': {
          userSelect: 'none !important',
          WebkitUserSelect: 'none !important',
          MozUserSelect: 'none !important',
          msUserSelect: 'none !important'
        }
      } : {}}
      onCopy={(e) => {
        if (!canCopy()) {
          e.preventDefault();
          toast({
            title: 'Copy Disabled',
            description: 'You do not have permission to copy content.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        }
      }}
      onCut={(e) => {
        if (!canCopy()) {
          e.preventDefault();
        }
      }}
    >
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={{ base: 2, md: 3 }} align="stretch">
            {/* Search and Filters - Compact */}
            <Box 
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              p={{ base: 2, md: 3 }} 
              borderRadius="lg"
              boxShadow="0 1px 3px rgba(0, 0, 0, 0.06)"
            >
              {/* Search Bar and Toggle */}
              <Flex justify="space-between" align="center" mb={3}>
                <InputGroup size="md" flex="1" mr={3}>
                  <InputLeftElement>
                    <Search size={16} color="#9ca3af" />
                  </InputLeftElement>
                  <Input
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    placeholder="Search KOLs by name, contact, tier, gender, race, location, niche..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fontSize="sm"
                    _focus={{
                      borderColor: 'red.300',
                      bg: 'white'
                    }}
                  />
                </InputGroup>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<Search size={14} />}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </Flex>

              {/* Filters Row - Collapsible */}
              {showFilters && (
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)", xl: "repeat(7, 1fr)" }} gap={2} mb={3}>
                {/* Tier Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Tier
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All Tiers">🏆 All</option>
                    {TIERS.map(tier => (
                      <option key={tier} value={tier}>{tier.split(' ')[0]}</option>
                    ))}
                  </Select>
                </Box>

                {/* Niche Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Niche
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All Niches">🏷️ All</option>
                    {TALENT_NICHES.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </Select>
                </Box>

                {/* Location Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Location
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All States">📍 All</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </Box>

                {/* Gender Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Gender
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All Genders">👥 All</option>
                    {GENDERS.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </Select>
                </Box>

                {/* Race Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Race
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All Races">🌍 All</option>
                    {RACES.map(race => (
                      <option key={race} value={race}>{race}</option>
                    ))}
                  </Select>
                </Box>

                {/* Hijab Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Hair
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedHijab}
                    onChange={(e) => setSelectedHijab(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All">💄 All</option>
                    {HIJAB_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </Box>

                {/* PIC Filter */}
                <Box>
                  <Text fontSize="xs" color="red.600" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    PIC
                  </Text>
                  <Select
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    value={selectedPic}
                    onChange={(e) => setSelectedPic(e.target.value)}
                    fontSize="xs"
                    _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.3)' }}
                  >
                    <option value="All PICs">👤 All</option>
                    {PICS.map(pic => (
                      <option key={pic} value={pic}>{pic}</option>
                    ))}
                  </Select>
                </Box>
              </Grid>
              )}

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
                    {searchTerm || selectedTier !== 'All Tiers' || selectedNiche !== 'All Niches' || selectedState !== 'All States' || selectedGender !== 'All Genders' || selectedRace !== 'All Races' || selectedHijab !== 'All' || selectedPic !== 'All PICs'
                      ? 'Active filters applied' 
                      : 'No filters applied'
                    }
                  </Text>
                </VStack>

                {/* Quick Filter Actions */}
                <HStack spacing={2}>
                  {(searchTerm || selectedTier !== 'All Tiers' || selectedNiche !== 'All Niches' || selectedState !== 'All States' || selectedGender !== 'All Genders' || selectedRace !== 'All Races' || selectedHijab !== 'All' || selectedPic !== 'All PICs') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTier('All Tiers');
                        setSelectedNiche('All Niches');
                        setSelectedState('All States');
                        setSelectedGender('All Genders');
                        setSelectedRace('All Races');
                        setSelectedHijab('All');
                        setSelectedPic('All PICs');
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

            {/* Data Table - Main Focus */}
            <Box 
              overflowX="auto" 
              bg="white"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Table variant="simple" size="lg">
                <Thead position="sticky" top={0} bg="rgba(220, 38, 38, 0.15)" zIndex={1} borderBottom="2px solid" borderColor="rgba(220, 38, 38, 0.3)">
                  <Tr>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="200px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Name
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="150px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Talent Type
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="120px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Rate (RM)
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Tier
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="130px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Niches
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="100px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Location
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="130px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Contact
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="90px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      PIC
                    </Th>
                    <Th 
                      px={6} 
                      py={5} 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="red.700"
                      minW="130px"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredData.map((kol) => (
                    <Tr 
                      key={kol.id}
                      _hover={{ bg: 'rgba(254, 226, 226, 0.4)', transform: 'scale(1.01)' }}
                      fontSize="sm"
                      borderBottom="1px solid"
                      borderColor="rgba(220, 38, 38, 0.15)"
                      height="100px"
                      transition="all 0.2s ease"
                    >
                      <Td px={6} py={5}>
                        <VStack align="start" spacing={2} maxH="80px" overflow="hidden">
                          <Text fontWeight="700" color="gray.800" fontSize="md" noOfLines={1}>
                            {kol.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {kol.gender} • {kol.race}
                          </Text>
                        </VStack>
                      </Td>
                      <Td px={6} py={5}>
                        <HStack 
                          spacing={3} 
                          maxH="80px" 
                          overflow="hidden"
                          bg="rgba(255, 255, 255, 0.8)"
                          p={2}
                          borderRadius="lg"
                          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                        >
                          {getTalentTypeIcon(kol.niches)}
                          <Badge 
                            colorScheme="purple" 
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={2}
                            fontWeight="700"
                            fontSize="sm"
                            noOfLines={1}
                          >
                            {getTalentTypeLabel(kol.niches)}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td px={6} py={5} minW="250px">
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="800" color="red.600" fontSize="md" mb={1}>
                            Overall: RM {kol.rate?.toLocaleString() || '0'}
                          </Text>
                          <VStack spacing={1} align="start" w="full">
                            {parseFloat(kol.instagramRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="pink.600" fontWeight="600">📸 IG:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.instagramRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {parseFloat(kol.tiktokRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="gray.600" fontWeight="600">🎵 TT:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.tiktokRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {parseFloat(kol.facebookRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="blue.600" fontWeight="600">📘 FB:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.facebookRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {parseFloat(kol.twitterRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="blue.500" fontWeight="600">🐦 TW:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.twitterRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {parseFloat(kol.threadRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="purple.600" fontWeight="600">🧵 TH:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.threadRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {parseFloat(kol.blogRate) > 0 && (
                              <HStack spacing={2} justify="space-between" w="full">
                                <HStack spacing={1}>
                                  <Text fontSize="xs" color="orange.600" fontWeight="600">📝 Blog:</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.700" fontWeight="700">RM{parseFloat(kol.blogRate).toLocaleString()}</Text>
                              </HStack>
                            )}
                            {(parseFloat(kol.instagramRate) === 0 && parseFloat(kol.tiktokRate) === 0 && parseFloat(kol.facebookRate) === 0 && parseFloat(kol.twitterRate) === 0 && parseFloat(kol.threadRate) === 0 && parseFloat(kol.blogRate) === 0) && (
                              <Text fontSize="xs" color="gray.400" fontStyle="italic">
                                No platform rates set
                              </Text>
                            )}
                          </VStack>
                          {kol.rateDetails && (
                            <Text fontSize="xs" color="gray.500" mt={1} wordBreak="break-word" whiteSpace="pre-wrap">
                              {kol.rateDetails}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td px={6} py={5}>
                        <Badge 
                          colorScheme={getTierColor(kol.tier)} 
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={2}
                          fontWeight="700"
                          fontSize="sm"
                          noOfLines={1}
                        >
                          {kol.tier}
                        </Badge>
                      </Td>
                      <Td px={6} py={5}>
                        <VStack align="start" spacing={2} maxH="80px" overflow="hidden">
                          {kol.niches.slice(0, 2).map(niche => (
                            <Badge 
                              key={niche} 
                              colorScheme="red" 
                              variant="outline" 
                              size="sm"
                              borderRadius="full"
                              fontWeight="700"
                              borderWidth="2px"
                              fontSize="sm"
                              px={3}
                              py={1}
                              noOfLines={1}
                            >
                              {niche}
                            </Badge>
                          ))}
                          {kol.niches.length > 2 && (
                            <Text fontSize="sm" color="gray.500" fontWeight="600">
                              +{kol.niches.length - 2} more
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td px={6} py={5}>
                        <Text fontSize="sm" fontWeight="600" noOfLines={1} color="gray.700">
                          {kol.address}
                        </Text>
                      </Td>
                      <Td px={6} py={5}>
                        <Text 
                          fontSize="sm" 
                          fontFamily="mono" 
                          fontWeight="700"
                          color="gray.800"
                          noOfLines={1}
                          bg="gray.50"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {kol.contactNumber}
                        </Text>
                      </Td>
                      <Td px={6} py={5}>
                        <Badge 
                          colorScheme="green" 
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={2}
                          fontWeight="700"
                          fontSize="sm"
                          noOfLines={1}
                        >
                          {kol.picUserName || kol.pic}
                        </Badge>
                      </Td>
                      <Td px={6} py={5}>
                        <HStack spacing={2}>
                          <IconButton
                            size="sm"
                            icon={<Eye size={16} />}
                            onClick={() => handleView(kol)}
                            colorScheme="blue"
                            variant="outline"
                            aria-label="View KOL"
                            borderRadius="lg"
                            _hover={{
                              bg: 'blue.50',
                              transform: 'scale(1.1)',
                              borderColor: 'blue.400'
                            }}
                            transition="all 0.2s ease"
                          />
                          {canEdit() && (
                            <IconButton
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => handleEdit(kol)}
                              colorScheme="green"
                              variant="outline"
                              aria-label="Edit KOL"
                              borderRadius="lg"
                              _hover={{
                                bg: 'green.50',
                                transform: 'scale(1.1)',
                                borderColor: 'green.400'
                              }}
                              transition="all 0.2s ease"
                            />
                          )}
                          {canDelete() && (
                            <IconButton
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(kol.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="Delete KOL"
                              borderRadius="lg"
                              _hover={{
                                bg: 'red.50',
                                transform: 'scale(1.1)',
                                borderColor: 'red.400'
                              }}
                              transition="all 0.2s ease"
                            />
                          )}
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
              {editingKOL ? 'Edit KOL' : 'Add New Production Talent KOL'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <KOLForm
                initialData={editingKOL}
                kolType={KOL_TYPES.PRODUCTION_TALENT}
                onSave={handleSave}
                onCancel={onFormClose}
                title={editingKOL ? 'Edit KOL' : 'Add New Production Talent KOL'}
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
                          {viewingKOL.picUserName || viewingKOL.pic || 'N/A'}
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

export default ProductionTalentKOL;

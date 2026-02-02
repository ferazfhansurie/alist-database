import React, { useState, useEffect, useCallback, memo } from 'react';
import { useLocation } from 'react-router-dom';
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
  SimpleGrid,
  Checkbox,
  Tooltip,
  Spinner,
  Center,
  Wrap,
  WrapItem
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
  Video,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { KOL_TYPES, TIERS, TALENT_NICHES, STATES } from '../data/models';
import KOLForm from './KOLForm';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

// Memoized table row component for performance (standardized)
const KOLTableRow = memo(({
  kol,
  onEdit,
  onView,
  onDelete,
  onOpenLink,
  getTierColor,
  formatDate,
  canEdit,
  canDelete,
  isSelected,
  onSelect
}) => {
  return (
    <Tr
      _hover={{ bg: 'gray.50' }}
      bg={isSelected ? 'blue.50' : 'white'}
      borderBottom="1px solid"
      borderColor="gray.200"
      transition="all 0.15s ease"
    >
      {/* Checkbox */}
      <Td px={3} py={3} w="40px">
        <Checkbox
          isChecked={isSelected}
          onChange={(e) => onSelect(kol.id, e.target.checked)}
          colorScheme="blue"
          size="lg"
        />
      </Td>

      {/* Name */}
      <Td px={3} py={3} minW="150px" maxW="200px">
        <VStack align="start" spacing={1}>
          <Text fontWeight="600" color="gray.900" fontSize="sm" noOfLines={1}>
            {kol.name || 'No Name'}
          </Text>
          {kol.notes && (
            <Text fontSize="xs" color="blue.600" noOfLines={1} fontWeight="500">
              {kol.notes}
            </Text>
          )}
        </VStack>
      </Td>

      {/* Contact */}
      <Td px={3} py={3} minW="120px">
        <Text fontSize="xs" fontFamily="mono" color="gray.700" noOfLines={1}>
          {kol.contact_number || kol.contactNumber || 'N/A'}
        </Text>
      </Td>

      {/* Platforms */}
      <Td px={3} py={3}>
        <HStack spacing={1}>
          {kol.instagram && (
            <Tooltip label="Instagram" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.instagram)}
                bg="pink.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'pink.100' }}
              >
                <Instagram size={14} color="#E4405F" />
              </Box>
            </Tooltip>
          )}
          {kol.tiktok && (
            <Tooltip label="TikTok" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.tiktok)}
                bg="gray.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'gray.100' }}
              >
                <Text fontSize="xs">🎵</Text>
              </Box>
            </Tooltip>
          )}
          {kol.facebook && (
            <Tooltip label="Facebook" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.facebook)}
                bg="blue.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'blue.100' }}
              >
                <Facebook size={14} color="#1877F2" />
              </Box>
            </Tooltip>
          )}
          {kol.twitter && (
            <Tooltip label="Twitter" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.twitter)}
                bg="blue.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'blue.100' }}
              >
                <Twitter size={14} color="#1DA1F2" />
              </Box>
            </Tooltip>
          )}
          {kol.thread && (
            <Tooltip label="Threads" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.thread)}
                bg="purple.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'purple.100' }}
              >
                <Text fontSize="xs">🧵</Text>
              </Box>
            </Tooltip>
          )}
          {kol.blog && (
            <Tooltip label="Blog" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.blog)}
                bg="orange.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'orange.100' }}
              >
                <FileText size={14} color="#F97316" />
              </Box>
            </Tooltip>
          )}
          {kol.youtube && (
            <Tooltip label="YouTube" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.youtube)}
                bg="red.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'red.100' }}
              >
                <Text fontSize="xs">▶️</Text>
              </Box>
            </Tooltip>
          )}
          {kol.xhs && (
            <Tooltip label="XHS" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.xhs)}
                bg="red.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'red.100' }}
              >
                <Text fontSize="xs">📕</Text>
              </Box>
            </Tooltip>
          )}
          {kol.lemon8 && (
            <Tooltip label="Lemon8" fontSize="xs">
              <Box
                as="button"
                onClick={() => onOpenLink(kol.lemon8)}
                bg="yellow.50"
                p={1.5}
                borderRadius="md"
                _hover={{ bg: 'yellow.100' }}
              >
                <Text fontSize="xs">🍋</Text>
              </Box>
            </Tooltip>
          )}
        </HStack>
      </Td>

      {/* Rate */}
      <Td px={3} py={3} minW="100px">
        <VStack align="start" spacing={0.5}>
          {parseFloat(kol.rate) > 0 && (
            <Tooltip label="General Rate" fontSize="xs">
              <Text fontSize="sm" fontWeight="700" color="green.700">
                RM{parseFloat(kol.rate).toLocaleString()}
              </Text>
            </Tooltip>
          )}
          {parseFloat(kol.instagramrate || kol.instagramRate) > 0 && (
            <Text fontSize="xs" color="pink.600">
              IG: RM{parseFloat(kol.instagramrate || kol.instagramRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.tiktokrate || kol.tiktokRate) > 0 && (
            <Text fontSize="xs" color="gray.600">
              TT: RM{parseFloat(kol.tiktokrate || kol.tiktokRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.facebookrate || kol.facebookRate) > 0 && (
            <Text fontSize="xs" color="blue.600">
              FB: RM{parseFloat(kol.facebookrate || kol.facebookRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.youtuberate || kol.youtubeRate) > 0 && (
            <Text fontSize="xs" color="red.600">
              YT: RM{parseFloat(kol.youtuberate || kol.youtubeRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.twitterrate || kol.twitterRate) > 0 && (
            <Text fontSize="xs" color="blue.500">
              X: RM{parseFloat(kol.twitterrate || kol.twitterRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.threadrate || kol.threadRate) > 0 && (
            <Text fontSize="xs" color="purple.600">
              TH: RM{parseFloat(kol.threadrate || kol.threadRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.blograte || kol.blogRate) > 0 && (
            <Text fontSize="xs" color="orange.600">
              Blog: RM{parseFloat(kol.blograte || kol.blogRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.xhsrate || kol.xhsRate) > 0 && (
            <Text fontSize="xs" color="red.600">
              XHS: RM{parseFloat(kol.xhsrate || kol.xhsRate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.lemon8rate || kol.lemon8Rate) > 0 && (
            <Text fontSize="xs" color="yellow.600">
              L8: RM{parseFloat(kol.lemon8rate || kol.lemon8Rate).toLocaleString()}
            </Text>
          )}
          {parseFloat(kol.sellingprice) > 0 && (
            <Text fontSize="xs" color="purple.700" fontWeight="600">
              Sell: RM{parseFloat(kol.sellingprice).toLocaleString()}
            </Text>
          )}
          {!kol.rate && !kol.instagramrate && !kol.tiktokrate && !kol.facebookrate && !kol.youtuberate && (
            <Text fontSize="xs" color="gray.400">N/A</Text>
          )}
        </VStack>
      </Td>

      {/* Rate Details */}
      <Td px={3} py={3} minW="120px" maxW="150px">
        <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {kol.rate_details || kol.rateDetails || '-'}
        </Text>
      </Td>

      {/* Tier */}
      <Td px={3} py={3}>
        <Badge
          colorScheme={getTierColor(kol.tier)}
          variant="subtle"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="md"
        >
          {kol.tier || 'N/A'}
        </Badge>
      </Td>

      {/* Gender */}
      <Td px={3} py={3}>
        <Text fontSize="xs" color="gray.700">
          {kol.gender || 'N/A'}
        </Text>
      </Td>

      {/* Race */}
      <Td px={3} py={3}>
        <Text fontSize="xs" color="gray.700">
          {kol.race || 'N/A'}
        </Text>
      </Td>

      {/* Hair Style */}
      <Td px={3} py={3}>
        <Text fontSize="xs" color="gray.700">
          {kol.hair_style || kol.hairStyle || kol.hijabStatus || 'N/A'}
        </Text>
      </Td>

      {/* Location */}
      <Td px={3} py={3}>
        <Text fontSize="xs" color="gray.700" noOfLines={1}>
          {kol.address || 'N/A'}
        </Text>
      </Td>

      {/* Niches */}
      <Td px={3} py={3} minW="150px" maxW="180px">
        <HStack spacing={1} flexWrap="wrap">
          {kol.niches && kol.niches.length > 0 ? (
            (Array.isArray(kol.niches) ? kol.niches : []).slice(0, 2).map((niche, idx) => (
              <Badge
                key={idx}
                colorScheme="red"
                variant="outline"
                fontSize="2xs"
                px={1.5}
                py={0.5}
                borderRadius="sm"
              >
                {niche}
              </Badge>
            ))
          ) : (
            <Text fontSize="xs" color="gray.400">-</Text>
          )}
          {kol.niches && Array.isArray(kol.niches) && kol.niches.length > 2 && (
            <Tooltip label={kol.niches.slice(2).join(', ')} fontSize="xs">
              <Badge colorScheme="gray" variant="subtle" fontSize="2xs" px={1.5} py={0.5}>
                +{kol.niches.length - 2}
              </Badge>
            </Tooltip>
          )}
        </HStack>
      </Td>

      {/* Rating */}
      <Td px={3} py={3}>
        <Text fontSize="sm" color="yellow.500">
          {kol.rating > 0 ? '⭐'.repeat(kol.rating) : '-'}
        </Text>
      </Td>

      {/* PIC */}
      <Td px={3} py={3}>
        <Text fontSize="xs" color="gray.700">
          {kol.picusername || kol.picUserName || kol.pic || 'N/A'}
        </Text>
      </Td>

      {/* Date Added */}
      <Td px={3} py={3}>
        <VStack align="start" spacing={0.5}>
          <Text fontSize="xs" color="gray.600">
            {formatDate(kol.submission_date || kol.created_at || kol.createdAt)}
          </Text>
          {kol.rate_updated_at && (
            <Tooltip label="Rate last updated" fontSize="xs">
              <Text fontSize="2xs" color="red.500">
                {formatDate(kol.rate_updated_at)}
              </Text>
            </Tooltip>
          )}
        </VStack>
      </Td>

      {/* Actions - Sticky Right */}
      <Td
        px={3}
        py={3}
        position="sticky"
        right={0}
        bg={isSelected ? 'blue.50' : 'white'}
        boxShadow="-4px 0 8px rgba(0,0,0,0.05)"
        borderLeft="1px solid"
        borderColor="gray.200"
        _hover={{ bg: isSelected ? 'blue.50' : 'gray.50' }}
      >
        <HStack spacing={1}>
          <Tooltip label="View Details" fontSize="xs">
            <IconButton
              size="sm"
              icon={<Eye size={14} />}
              onClick={() => onView(kol)}
              colorScheme="blue"
              variant="ghost"
              aria-label="View"
            />
          </Tooltip>
          {canEdit && (
            <Tooltip label="Edit" fontSize="xs">
              <IconButton
                size="sm"
                icon={<Edit size={14} />}
                onClick={() => onEdit(kol)}
                colorScheme="green"
                variant="ghost"
                aria-label="Edit"
              />
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip label="Delete" fontSize="xs">
              <IconButton
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={() => onDelete(kol.id)}
                colorScheme="red"
                variant="ghost"
                aria-label="Delete"
              />
            </Tooltip>
          )}
        </HStack>
      </Td>
    </Tr>
  );
});

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
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [selectedKOLs, setSelectedKOLs] = useState(new Set());
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
  }, [searchTerm, selectedTier, selectedNiche, selectedState, selectedGender, selectedRace, selectedHijab, selectedPic, selectedRating, kolData]);

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

    if (selectedRating !== 'All Ratings') {
      const ratingValue = parseInt(selectedRating);
      filtered = filtered.filter(kol => (kol.rating || 0) === ratingValue);
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
    if (!tier) return 'gray';
    if (tier.includes('Premium')) return 'red';
    if (tier.includes('Mid-tier')) return 'orange';
    if (tier.includes('Emerging')) return 'yellow';
    return 'gray';
  };

  const openLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
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

  // Bulk selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(filteredData.map(kol => kol.id));
      setSelectedKOLs(allIds);
    } else {
      setSelectedKOLs(new Set());
    }
  };

  const handleSelectKOL = (kolId, checked) => {
    const newSelected = new Set(selectedKOLs);
    if (checked) {
      newSelected.add(kolId);
    } else {
      newSelected.delete(kolId);
    }
    setSelectedKOLs(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedKOLs.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedKOLs.size} KOL record(s)?`)) {
      try {
        for (const kolId of selectedKOLs) {
          await deleteKOL(kolId);
        }
        
        const prodKOLs = await loadKOLsByType(KOL_TYPES.PRODUCTION_TALENT);
        setKolData(prodKOLs);
        setFilteredData(prodKOLs);
        setSelectedKOLs(new Set());
        
        toast({
          title: 'Success!',
          description: `${selectedKOLs.size} KOL record(s) deleted successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error!',
          description: 'Failed to delete some KOL records',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleGenerateProposal = () => {
    toast({
      title: 'Coming Soon',
      description: 'Proposal generation feature will be available soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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
            
            {/* Header */}
            <Flex justify="space-between" align="center" mb={2}>
              <HStack spacing={3}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Production Talents
                </Text>
                <Badge colorScheme="purple" fontSize="md" px={3} py={1} borderRadius="full">
                  {filteredData.length}
                </Badge>
              </HStack>

              {canEdit() && (
                <Button
                  leftIcon={<Camera size={18} />}
                  colorScheme="red"
                  onClick={() => {
                    setEditingKOL(null);
                    onFormOpen();
                  }}
                  size="md"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Add Production Talent
                </Button>
              )}
            </Flex>
            
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

            {/* Bulk Actions and Pagination */}
            <Flex justify="space-between" align="center" px={2}>
              <HStack spacing={2}>
                {selectedKOLs.size > 0 && (
                  <>
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<Trash2 size={14} />}
                      onClick={handleBulkDelete}
                      variant="solid"
                      fontSize="xs"
                    >
                      Bulk Delete ({selectedKOLs.size})
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<FileText size={14} />}
                      onClick={handleGenerateProposal}
                      variant="outline"
                      fontSize="xs"
                    >
                      Generate Proposal ({selectedKOLs.size})
                    </Button>
                  </>
                )}
              </HStack>
              
              <Text fontSize="xs" color="gray.600">
                Page 1 of 1 ({filteredData.length} total results)
              </Text>
            </Flex>

            {/* Data Table - Compact */}
            <Box 
              bg="white"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <Box overflowX="auto" overflowY="auto" flex="1">
                <Table variant="simple" size="sm">
                  <Thead position="sticky" top={0} bg="gray.100" zIndex={2}>
                    <Tr>
                      <Th w="40px" px={3}>
                        <Checkbox
                          isChecked={filteredData.length > 0 && selectedKOLs.size === filteredData.length}
                          isIndeterminate={selectedKOLs.size > 0 && selectedKOLs.size < filteredData.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          colorScheme="blue"
                          size="lg"
                        />
                      </Th>
                      <Th px={3}>Name</Th>
                      <Th px={3}>Contact</Th>
                      <Th px={3}>Platforms</Th>
                      <Th px={3}>Rates (RM)</Th>
                      <Th px={3}>Rate Details</Th>
                      <Th px={3}>Tier</Th>
                      <Th px={3}>Gender</Th>
                      <Th px={3}>Race</Th>
                      <Th px={3}>Hair</Th>
                      <Th px={3}>Location</Th>
                      <Th px={3}>Niches</Th>
                      <Th px={3}>Rating</Th>
                      <Th px={3}>PIC</Th>
                      <Th px={3}>Date</Th>
                      <Th
                        position="sticky"
                        right={0}
                        bg="gray.100"
                        px={3}
                        boxShadow="-4px 0 8px rgba(0,0,0,0.05)"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.length === 0 ? (
                      <Tr>
                        <Td colSpan={16} py={20}>
                          <Center>
                            <VStack spacing={3}>
                              <Spinner size="xl" color="blue.500" thickness="3px" />
                              <Text color="gray.600">Loading KOLs...</Text>
                            </VStack>
                          </Center>
                        </Td>
                      </Tr>
                    ) : (
                      filteredData.map((kol) => (
                        <KOLTableRow
                          key={kol.id}
                          kol={kol}
                          onEdit={handleEdit}
                          onView={handleView}
                          onDelete={handleDelete}
                          onOpenLink={openLink}
                          getTierColor={getTierColor}
                          formatDate={formatDate}
                          canEdit={canEdit()}
                          canDelete={canDelete()}
                          isSelected={selectedKOLs.has(kol.id)}
                          onSelect={handleSelectKOL}
                        />
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
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

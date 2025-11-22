import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
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
  Spinner,
  Center,
  Checkbox,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  User,
  MapPin,
  Target,
  FileText,
  Phone,
  DollarSign,
  MoreVertical,
  ExternalLink,
  ChevronDown,
  CheckSquare,
  Square
} from 'lucide-react';
import { KOL_TYPES, TIERS, NICHES, STATES } from '../data/models';

import KOLForm from './KOLForm';
import ProposalModal from './ProposalModal';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

// Memoized table row component to prevent unnecessary re-renders
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
            kol.niches.slice(0, 2).map((niche, idx) => (
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
          {kol.niches && kol.niches.length > 2 && (
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

const SocialMediaKOL = () => {
  const { loadKOLs, loadKOLsByType, createKOL, updateKOL, deleteKOL } = useDatabase();
  const { canEdit, canDelete, canCopy } = useAuth();
  const [kolData, setKolData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedNiche, setSelectedNiche] = useState('All Niches');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedRace, setSelectedRace] = useState('All Races');
  const [selectedHijab, setSelectedHijab] = useState('All');
  const [selectedPic, setSelectedPic] = useState('All PICs');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [editingKOL, setEditingKOL] = useState(null);
  const [viewingKOL, setViewingKOL] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef(null);
  const [selectedKOLs, setSelectedKOLs] = useState(new Set());

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isProposalOpen, onOpen: onProposalOpen, onClose: onProposalClose } = useDisclosure();
  const toast = useToast();

  // Filter options
  const GENDERS = ['Male', 'Female', 'Other'];
  const RACES = ['Malay', 'Chinese', 'Indian', 'Other'];
  const HIJAB_OPTIONS = ['Hijab', 'Free Hair'];
  const PICS = ['Amir', 'Tika', 'Aina'];


  useEffect(() => {
    // Load all KOLs and filter for social media related ones
    const loadSocialMediaKOLs = async () => {
      try {
        // Get all KOLs and filter for social media related types
        const allKOLs = await loadKOLs();

        // Check if allKOLs is valid and is an array
        if (!allKOLs || !Array.isArray(allKOLs)) {
          console.error('loadKOLs returned invalid data:', allKOLs);
          setKolData([]);
          return;
        }

        const socialMediaKOLs = allKOLs.filter(kol =>
          kol.kolType === 'social-media' ||
          kol.kolType === 'instagram' ||
          kol.kolType === 'tiktok' ||
          kol.instagram ||
          kol.tiktok ||
          kol.facebook
        );
        setKolData(socialMediaKOLs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading social media KOLs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load social media KOLs',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // Set empty array on error
        setKolData([]);
        setIsLoading(false);
      }
    };

    loadSocialMediaKOLs();
  }, [loadKOLs, toast]);

  // Memoized filtering logic
  const filteredData = useMemo(() => {
    let filtered = kolData;

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(kol => {
        // Safe string comparison helper
        const matchesText = (field) => field && field.toLowerCase().includes(searchLower);

        return (
          matchesText(kol.name) ||
          matchesText(kol.contact_number) ||
          matchesText(kol.contactNumber) ||
          matchesText(kol.tier) ||
          matchesText(kol.gender) ||
          matchesText(kol.race) ||
          matchesText(kol.address) ||
          matchesText(kol.pic) ||
          matchesText(kol.picusername) ||
          matchesText(kol.picUserName) ||
          matchesText(kol.hair_style) ||
          matchesText(kol.hairStyle) ||
          matchesText(kol.hijabStatus) ||
          matchesText(kol.rate_details) ||
          matchesText(kol.rateDetails) ||
          matchesText(kol.notes) ||
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
      filtered = filtered.filter(kol => (kol.hair_style || kol.hairStyle || kol.hijabStatus) === selectedHijab);
    }

    if (selectedPic !== 'All PICs') {
      filtered = filtered.filter(kol => (kol.picusername || kol.picUserName || kol.pic) === selectedPic);
    }

    if (selectedRating !== 'All Ratings') {
      const ratingValue = parseInt(selectedRating);
      filtered = filtered.filter(kol => (kol.rating || 0) === ratingValue);
    }

    return filtered;
  }, [kolData, debouncedSearchTerm, selectedTier, selectedNiche, selectedState, selectedGender, selectedRace, selectedHijab, selectedPic, selectedRating]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedTier, selectedNiche, selectedState, selectedGender, selectedRace, selectedHijab, selectedPic]);

  const handleSave = useCallback(async (kolData) => {
    try {
      console.log('💾 SAVING KOL DATA:', {
        id: editingKOL?.id,
        name: kolData.name,
        rate: kolData.rate,
        instagramrate: kolData.instagramrate,
        tiktokrate: kolData.tiktokrate,
        facebookrate: kolData.facebookrate,
        twitterrate: kolData.twitterrate,
        threadrate: kolData.threadrate,
        blograte: kolData.blograte,
        youtuberate: kolData.youtuberate,
        xhsrate: kolData.xhsrate,
        lemon8rate: kolData.lemon8rate,
        sellingPrice: kolData.sellingPrice,
        rateUpdatedAt: kolData.rateUpdatedAt
      });

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
      const allKOLs = await loadKOLs();
      if (allKOLs && Array.isArray(allKOLs)) {
        const socialMediaKOLs = allKOLs.filter(kol =>
          kol.kolType === 'social-media' ||
          kol.kolType === 'instagram' ||
          kol.kolType === 'tiktok' ||
          kol.instagram ||
          kol.tiktok ||
          kol.facebook
        );
        setKolData(socialMediaKOLs);
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
  }, [editingKOL, updateKOL, createKOL, loadKOLs, toast, onFormClose]);

  const handleEdit = useCallback((kol) => {
    setEditingKOL(kol);
    onFormOpen();
  }, [onFormOpen]);

  const handleView = useCallback((kol) => {
    console.log('Viewing KOL:', kol); // Debug log
    setViewingKOL(kol);
    onViewOpen();
  }, [onViewOpen]);

  const handleDelete = useCallback(async (kolId) => {
    if (window.confirm('Are you sure you want to delete this KOL record?')) {
      try {
        await deleteKOL(kolId);

        // Reload data from database
        const allKOLs = await loadKOLs();
        if (allKOLs && Array.isArray(allKOLs)) {
          const socialMediaKOLs = allKOLs.filter(kol =>
            kol.kolType === 'social-media' ||
            kol.kolType === 'instagram' ||
            kol.kolType === 'tiktok' ||
            kol.instagram ||
            kol.tiktok ||
            kol.facebook
          );
          setKolData(socialMediaKOLs);
        }

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
  }, [deleteKOL, loadKOLs, toast]);

  const openLink = useCallback((url) => {
    if (url) {
      window.open(url, '_blank');
    }
  }, []);

  const getTierColor = useCallback((tier) => {
    if (tier.includes('Premium')) return 'red';
    if (tier.includes('Mid-tier')) return 'orange';
    if (tier.includes('Emerging')) return 'yellow';
    return 'gray';
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTier('All Tiers');
    setSelectedNiche('All Niches');
    setSelectedState('All States');
    setSelectedGender('All Genders');
    setSelectedRace('All Races');
    setSelectedHijab('All');
    setSelectedPic('All PICs');
    setSelectedRating('All Ratings');
  }, []);

  // Bulk selection handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(kol => kol.id));
      setSelectedKOLs(allIds);
    } else {
      setSelectedKOLs(new Set());
    }
  }, [paginatedData]);

  const handleSelectKOL = useCallback((kolId, checked) => {
    setSelectedKOLs(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(kolId);
      } else {
        newSet.delete(kolId);
      }
      return newSet;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedKOLs.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select KOLs to delete',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedKOLs.size} selected KOL(s)?`)) {
      try {
        const deletePromises = Array.from(selectedKOLs).map(id => deleteKOL(id));
        await Promise.all(deletePromises);

        // Reload data
        const allKOLs = await loadKOLs();
        if (allKOLs && Array.isArray(allKOLs)) {
          const socialMediaKOLs = allKOLs.filter(kol =>
            kol.kolType === 'social-media' ||
            kol.kolType === 'instagram' ||
            kol.kolType === 'tiktok' ||
            kol.instagram ||
            kol.tiktok ||
            kol.facebook
          );
          setKolData(socialMediaKOLs);
        }

        setSelectedKOLs(new Set());
        toast({
          title: 'Deleted!',
          description: `Successfully deleted ${selectedKOLs.size} KOL(s)`,
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
  }, [selectedKOLs, deleteKOL, loadKOLs, toast]);

  const handleGenerateProposal = useCallback(() => {
    if (selectedKOLs.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select KOLs to generate proposal',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onProposalOpen();
  }, [selectedKOLs, toast, onProposalOpen]);

  const handleGeneratePDF = useCallback(async (companyName) => {
    try {
      const kolIds = Array.from(selectedKOLs);

      const response = await fetch('http://localhost:3001/api/proposals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          kolIds
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate proposal');
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal-${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'Proposal generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate proposal',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error; // Re-throw for modal to handle loading state
    }
  }, [selectedKOLs, toast]);

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      py={4}
      px={4}
    >
      <Container maxW="container.2xl">
        <VStack spacing={4} align="stretch">
          {/* Header with Bulk Actions */}
          <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
            <HStack spacing={3}>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                Social Media KOLs
              </Text>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                {filteredData.length}
              </Badge>
            </HStack>

            <HStack spacing={2}>
              {selectedKOLs.size > 0 && (
                <>
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                    {selectedKOLs.size} selected
                  </Badge>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<FileText size={16} />}
                    onClick={handleGenerateProposal}
                    isDisabled={!canEdit()}
                  >
                    Generate Proposal
                  </Button>
                  {canDelete() && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<Trash2 size={16} />}
                      onClick={handleBulkDelete}
                    >
                      Delete Selected
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedKOLs(new Set())}
                  >
                    Clear Selection
                  </Button>
                </>
              )}
              {canEdit() && (
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setEditingKOL(null);
                    onFormOpen();
                  }}
                >
                  + Add KOL
                </Button>
              )}
            </HStack>
          </Flex>

          {/* Search and Filters */}
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <VStack spacing={3} align="stretch">
              {/* Search Bar */}
              <HStack spacing={3}>
                <InputGroup flex={1}>
                  <InputLeftElement>
                    <Search size={16} color="#9ca3af" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name, contact, tier, location, niche..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="md"
                  />
                </InputGroup>
                <Button
                  size="md"
                  variant={showFilters ? 'solid' : 'outline'}
                  colorScheme="gray"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={showFilters ? <ChevronDown size={16} /> : <Search size={16} />}
                >
                  Filters
                </Button>
                {(searchTerm || selectedTier !== 'All Tiers' || selectedNiche !== 'All Niches' ||
                  selectedState !== 'All States' || selectedGender !== 'All Genders' ||
                  selectedRace !== 'All Races' || selectedHijab !== 'All' || selectedPic !== 'All PICs') && (
                    <Button size="md" variant="ghost" colorScheme="red" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  )}
              </HStack>

              {/* Filter Options */}
              {showFilters && (
                <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3}>
                  <Select size="sm" value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)}>
                    <option value="All Tiers">All Tiers</option>
                    {TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                  </Select>
                  <Select size="sm" value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)}>
                    <option value="All Niches">All Niches</option>
                    {NICHES.map(niche => <option key={niche} value={niche}>{niche}</option>)}
                  </Select>
                  <Select size="sm" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="All States">All Locations</option>
                    {STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </Select>
                  <Select size="sm" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                    <option value="All Genders">All Genders</option>
                    {GENDERS.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                  </Select>
                  <Select size="sm" value={selectedRace} onChange={(e) => setSelectedRace(e.target.value)}>
                    <option value="All Races">All Races</option>
                    {RACES.map(race => <option key={race} value={race}>{race}</option>)}
                  </Select>
                  <Select size="sm" value={selectedHijab} onChange={(e) => setSelectedHijab(e.target.value)}>
                    <option value="All">All Hair Styles</option>
                    {HIJAB_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </Select>
                  <Select size="sm" value={selectedPic} onChange={(e) => setSelectedPic(e.target.value)}>
                    <option value="All PICs">All PICs</option>
                    {PICS.map(pic => <option key={pic} value={pic}>{pic}</option>)}
                  </Select>
                  <Select size="sm" value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
                    <option value="All Ratings">All Ratings</option>
                    {[5, 4, 3, 2, 1, 0].map(r => <option key={r} value={r}>{'⭐'.repeat(r) || 'No rating'}</option>)}
                  </Select>
                </Grid>
              )}

              {/* Results Summary */}
              <HStack spacing={3} fontSize="sm" color="gray.600">
                <Text>Showing {paginatedData.length} of {filteredData.length} results</Text>
                {filteredData.length !== kolData.length && (
                  <Text color="blue.600" fontWeight="500">
                    ({kolData.length - filteredData.length} filtered out)
                  </Text>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Pagination - Above Table */}
          {totalPages > 1 && (
            <Flex justify="space-between" align="center" bg="white" p={3} borderRadius="lg" boxShadow="sm">
              <Text fontSize="sm" color="gray.600">
                Page {currentPage} of {totalPages} ({filteredData.length} total results)
              </Text>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  isDisabled={currentPage === 1}
                  variant="outline"
                >
                  First
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  isDisabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>

                <HStack spacing={1}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={currentPage === pageNum ? "solid" : "outline"}
                        colorScheme={currentPage === pageNum ? "blue" : "gray"}
                        onClick={() => setCurrentPage(pageNum)}
                        minW="40px"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </HStack>

                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  isDisabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  isDisabled={currentPage === totalPages}
                  variant="outline"
                >
                  Last
                </Button>
              </HStack>
            </Flex>
          )}

          {/* Data Table - Compact & Modern with Fixed Height */}
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
            height="calc(100vh - 420px)"
            display="flex"
            flexDirection="column"
          >
            <Box overflowX="auto" overflowY="auto" flex="1">
              <Table variant="simple" size="sm">
                <Thead position="sticky" top={0} bg="gray.100" zIndex={2}>
                  <Tr>
                    <Th w="40px" px={3}>
                      <Checkbox
                        isChecked={paginatedData.length > 0 && selectedKOLs.size === paginatedData.length}
                        isIndeterminate={selectedKOLs.size > 0 && selectedKOLs.size < paginatedData.length}
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
                  {isLoading ? (
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
                  ) : paginatedData.length === 0 ? (
                    <Tr>
                      <Td colSpan={16} py={20}>
                        <Center>
                          <VStack spacing={3}>
                            <Text fontSize="lg" color="gray.500" fontWeight="500">
                              No KOLs found
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              Try adjusting your search or filters
                            </Text>
                          </VStack>
                        </Center>
                      </Td>
                    </Tr>
                  ) : (
                    paginatedData.map((kol) => (
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

        {/* Add/Edit Form Modal */}
        <Modal isOpen={isFormOpen} onClose={onFormClose} size="6xl" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
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
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      textAlign="center"
                      _hover={{ transform: 'translateY(-2px)', bg: 'rgba(255, 255, 255, 0.15)' }}
                      transition="all 0.2s ease"
                    >
                      <Text fontSize="sm" fontWeight="700" color="red.600" mb={3} textTransform="uppercase" letterSpacing="wide">
                        💰 Platform Rates
                      </Text>
                      <VStack spacing={2} mt={2}>
                        {(viewingKOL.rate && parseFloat(viewingKOL.rate) > 0) && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(34, 197, 94, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <DollarSign size={14} color="#22c55e" />
                              <Text fontSize="sm" color="green.700" fontWeight="600">General Rate</Text>
                            </HStack>
                            <Text fontSize="md" color="green.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.rate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.instagramrate || viewingKOL.instagramRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(236, 72, 153, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Instagram size={14} color="#E4405F" />
                              <Text fontSize="sm" color="pink.700" fontWeight="600">Instagram</Text>
                            </HStack>
                            <Text fontSize="md" color="pink.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.instagramrate || viewingKOL.instagramRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.tiktokrate || viewingKOL.tiktokRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(0, 0, 0, 0.05)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Text fontSize="sm">🎵</Text>
                              <Text fontSize="sm" color="gray.700" fontWeight="600">TikTok</Text>
                            </HStack>
                            <Text fontSize="md" color="gray.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.tiktokrate || viewingKOL.tiktokRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.facebookrate || viewingKOL.facebookRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(59, 130, 246, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Facebook size={14} color="#1877F2" />
                              <Text fontSize="sm" color="blue.700" fontWeight="600">Facebook</Text>
                            </HStack>
                            <Text fontSize="md" color="blue.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.facebookrate || viewingKOL.facebookRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.twitterrate || viewingKOL.twitterRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(29, 161, 242, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Twitter size={14} color="#1DA1F2" />
                              <Text fontSize="sm" color="blue.700" fontWeight="600">Twitter</Text>
                            </HStack>
                            <Text fontSize="md" color="blue.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.twitterrate || viewingKOL.twitterRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.threadrate || viewingKOL.threadRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(147, 51, 234, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Text fontSize="sm">🧵</Text>
                              <Text fontSize="sm" color="purple.700" fontWeight="600">Threads</Text>
                            </HStack>
                            <Text fontSize="md" color="purple.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.threadrate || viewingKOL.threadRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.blograte || viewingKOL.blogRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(249, 115, 22, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <FileText size={14} color="#F97316" />
                              <Text fontSize="sm" color="orange.700" fontWeight="600">Blog</Text>
                            </HStack>
                            <Text fontSize="md" color="orange.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.blograte || viewingKOL.blogRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.youtuberate || viewingKOL.youtubeRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(220, 38, 38, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Text fontSize="sm">▶️</Text>
                              <Text fontSize="sm" color="red.700" fontWeight="600">YouTube</Text>
                            </HStack>
                            <Text fontSize="md" color="red.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.youtuberate || viewingKOL.youtubeRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.xhsrate || viewingKOL.xhsRate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(220, 38, 38, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Text fontSize="sm">📕</Text>
                              <Text fontSize="sm" color="red.700" fontWeight="600">XHS</Text>
                            </HStack>
                            <Text fontSize="md" color="red.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.xhsrate || viewingKOL.xhsRate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.lemon8rate || viewingKOL.lemon8Rate) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(234, 179, 8, 0.1)" p={2} borderRadius="md">
                            <HStack spacing={2}>
                              <Text fontSize="sm">🍋</Text>
                              <Text fontSize="sm" color="yellow.700" fontWeight="600">Lemon8</Text>
                            </HStack>
                            <Text fontSize="md" color="yellow.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.lemon8rate || viewingKOL.lemon8Rate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {parseFloat(viewingKOL.sellingprice) > 0 && (
                          <HStack spacing={2} justify="space-between" w="full" bg="rgba(147, 51, 234, 0.15)" p={2} borderRadius="md" borderWidth="2px" borderColor="purple.300">
                            <HStack spacing={2}>
                              <DollarSign size={14} color="#9333ea" />
                              <Text fontSize="sm" color="purple.700" fontWeight="700">Selling Price</Text>
                            </HStack>
                            <Text fontSize="md" color="purple.800" fontWeight="800" fontFamily="mono">
                              RM{parseFloat(viewingKOL.sellingprice).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                        {!viewingKOL.rate && !viewingKOL.instagramrate && !viewingKOL.instagramRate &&
                          !viewingKOL.tiktokrate && !viewingKOL.tiktokRate && !viewingKOL.facebookrate &&
                          !viewingKOL.facebookRate && !viewingKOL.twitterrate && !viewingKOL.twitterRate &&
                          !viewingKOL.threadrate && !viewingKOL.threadRate && !viewingKOL.blograte &&
                          !viewingKOL.blogRate && (
                            <Text fontSize="sm" color="gray.500" fontStyle="italic" bg="gray.50" p={3} borderRadius="md">
                              No platform rates set
                            </Text>
                          )}
                      </VStack>
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
                        {viewingKOL.contact_number || viewingKOL.contactNumber || 'Not provided'}
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

                  {/* Rate Details */}
                  {(viewingKOL.rate_details || viewingKOL.rateDetails) && (
                    <Box
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Box p={1} bg="rgba(220, 38, 38, 0.2)" borderRadius="full">
                          <FileText size={14} color="#dc2626" />
                        </Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">Rate Details</Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.700">
                        {viewingKOL.rate_details || viewingKOL.rateDetails}
                      </Text>
                    </Box>
                  )}

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
                          {viewingKOL.hair_style || viewingKOL.hairStyle || 'N/A'}
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
                          {viewingKOL.picusername || viewingKOL.picUserName || viewingKOL.pic || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Rating</Text>
                        <Text fontSize="sm" fontWeight="600" color="yellow.600">
                          {viewingKOL.rating > 0 ? '⭐'.repeat(viewingKOL.rating) : 'No rating'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Status</Text>
                        <Badge colorScheme={viewingKOL.is_active ? "green" : "red"} variant="subtle">
                          {viewingKOL.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Box>
                    </SimpleGrid>

                    {/* Date Information */}
                    <Box mt={3} p={3} bg="rgba(220, 38, 38, 0.05)" borderRadius="lg">
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Calendar size={14} color="#666" />
                          <Text fontSize="xs" fontWeight="600" color="gray.600">Added:</Text>
                          <Text fontSize="sm" fontWeight="600" color="gray.800">
                            {formatDate(viewingKOL.submission_date || viewingKOL.created_at || viewingKOL.createdAt)}
                          </Text>
                        </HStack>
                        {viewingKOL.rate_updated_at && (
                          <HStack spacing={2}>
                            <Calendar size={14} color="#dc2626" />
                            <Text fontSize="xs" fontWeight="600" color="red.600">Rate Updated:</Text>
                            <Text fontSize="sm" fontWeight="600" color="red.700">
                              {formatDate(viewingKOL.rate_updated_at)}
                            </Text>
                          </HStack>
                        )}
                        {viewingKOL.updated_at && (
                          <HStack spacing={2}>
                            <Calendar size={14} color="#666" />
                            <Text fontSize="xs" fontWeight="600" color="gray.600">Last Updated:</Text>
                            <Text fontSize="sm" fontWeight="600" color="gray.800">
                              {formatDate(viewingKOL.updated_at)}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </Box>

                    {viewingKOL.notes && (
                      <Box mt={3} p={3} bg="rgba(0, 0, 0, 0.05)" borderRadius="lg">
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Notes</Text>
                        <Text fontSize="sm" color="gray.700" fontStyle="italic">
                          {viewingKOL.notes}
                        </Text>
                      </Box>
                    )}

                    {/* Custom Fields */}
                    {viewingKOL.custom_fields && Object.keys(viewingKOL.custom_fields).length > 0 && (
                      <Box mt={3} p={3} bg="rgba(220, 38, 38, 0.05)" borderRadius="lg">
                        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>Additional Information</Text>
                        <SimpleGrid columns={2} spacing={2}>
                          {Object.entries(viewingKOL.custom_fields).map(([key, value]) => (
                            value && (
                              <Box key={key}>
                                <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </Text>
                                <Text fontSize="sm" color="gray.800" fontWeight="600">
                                  {value}
                                </Text>
                              </Box>
                            )
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}
                  </Box>

                  {/* Social Media Links */}
                  {(viewingKOL.instagram || viewingKOL.tiktok || viewingKOL.facebook || viewingKOL.twitter ||
                    viewingKOL.thread || viewingKOL.blog || viewingKOL.youtube || viewingKOL.xhs || viewingKOL.lemon8) && (
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
                              X
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
                              Threads
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
                          {viewingKOL.youtube && (
                            <Button
                              leftIcon={<span>▶️</span>}
                              colorScheme="red"
                              variant="ghost"
                              size="xs"
                              onClick={() => openLink(viewingKOL.youtube)}
                              _hover={{ bg: 'rgba(220, 38, 38, 0.1)' }}
                              transition="all 0.2s ease"
                            >
                              YouTube
                            </Button>
                          )}
                          {viewingKOL.xhs && (
                            <Button
                              leftIcon={<span>📕</span>}
                              colorScheme="red"
                              variant="ghost"
                              size="xs"
                              onClick={() => openLink(viewingKOL.xhs)}
                              _hover={{ bg: 'rgba(220, 38, 38, 0.1)' }}
                              transition="all 0.2s ease"
                            >
                              XHS
                            </Button>
                          )}
                          {viewingKOL.lemon8 && (
                            <Button
                              leftIcon={<span>🍋</span>}
                              colorScheme="yellow"
                              variant="ghost"
                              size="xs"
                              onClick={() => openLink(viewingKOL.lemon8)}
                              _hover={{ bg: 'rgba(234, 179, 8, 0.1)' }}
                              transition="all 0.2s ease"
                            >
                              Lemon8
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

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={isProposalOpen}
        onClose={onProposalClose}
        selectedKols={Array.from(selectedKOLs)}
        onGenerate={handleGeneratePDF}
      />
    </Box>
  );
};

export default memo(SocialMediaKOL);

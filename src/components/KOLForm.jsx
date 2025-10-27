import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Grid,
  GridItem,
  Text,
  useToast,
  Checkbox,
  CheckboxGroup,
  IconButton,
  Tooltip,
  Divider,
  Heading,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Plus, X, Save, User, Link, DollarSign, Users, MapPin, Phone, Calendar, FileText, UserCheck } from 'lucide-react';
import {
  TIERS,
  GENDERS,
  NICHES,
  HAIR_STYLES,
  RACES,
  STATES,
  PICS,
  KOL_TYPES
} from '../data/models';
import { getApiUrl } from '../config/api';

const MotionBox = motion(Box);

const KOLForm = ({ 
  initialData = null, 
  kolType = KOL_TYPES.SOCIAL_MEDIA, 
  onSave, 
  onCancel,
  title = "Add New KOL"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    twitter: '',
    thread: '',
    blog: '',
  youtube: '',
  lemon8: '',
  xhs: '',
    rate: 0,
    tier: TIERS[0],
    gender: GENDERS[0],
    niches: [],
    hairStyle: HAIR_STYLES[0],
    race: RACES[0],
    address: STATES[0],
    contactNumber: '',
    rateDetails: '',
    rateUpdatedAt: new Date().toISOString().split('T')[0],
    rating: 0,
    sellingPrice: 0,
    pic: PICS[0],
    kolType: kolType,
    notes: '',
    customFields: {}
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFieldConfigs, setCustomFieldConfigs] = useState([]);
  const toast = useToast();

  // Glassmorphism colors
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const glassShadow = useColorModeValue('0 8px 32px 0 rgba(31, 38, 135, 0.37)', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        customFields: initialData.custom_fields || initialData.customFields || {}
      });
    }
  }, [initialData]);

  // Fetch custom field configurations
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const response = await fetch(getApiUrl('/api/custom-fields'));
        const data = await response.json();
        setCustomFieldConfigs(data);
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      }
    };
    fetchCustomFields();
  }, []);

  const handleInputChange = (field, value) => {
    // Handle platform fields - convert username to full URL
    let processedValue = value;
    if (['instagram', 'tiktok', 'facebook', 'twitter', 'thread'].includes(field)) {
      processedValue = constructPlatformURL(field, value);
    }

    if (['youtube', 'lemon8', 'xhs'].includes(field)) {
      processedValue = constructPlatformURL(field, value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldKey]: value
      }
    }));
  };

  // Utility function to construct full URLs from usernames
  const constructPlatformURL = (platform, username) => {
    if (!username || !username.trim()) return '';
    
    // Remove @ symbol if present
    const cleanUsername = username.replace(/^@/, '');
    
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanUsername}`;
      case 'tiktok':
        return `https://tiktok.com/@${cleanUsername}`;
      case 'facebook':
        return `https://facebook.com/${cleanUsername}`;
      case 'twitter':
        return `https://twitter.com/${cleanUsername}`;
      case 'thread':
        return `https://threads.net/@${cleanUsername}`;
      case 'youtube':
        // Support @username or channel IDs
        return `https://youtube.com/@${cleanUsername}`;
      case 'lemon8':
        return `https://www.lemon8.co/${cleanUsername}`;
      case 'xhs':
        return `https://www.xiaohongshu.com/user/profile/${cleanUsername}`;
      default:
        return username;
    }
  };

  // Extract username from URL for display purposes
  const extractUsername = (url, platform) => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      switch (platform) {
        case 'instagram':
        case 'facebook':
        case 'twitter':
          return pathname.replace('/', '');
        case 'tiktok':
        case 'thread':
          return pathname.replace('/@', '').replace('/', '');
        case 'youtube':
          return pathname.replace('/@', '').replace('/channel/', '').replace('/', '');
        case 'lemon8':
          return pathname.replace('/', '');
        case 'xhs':
          return pathname.replace('/user/profile/', '').replace('/', '');
        default:
          return url;
      }
    } catch {
      return url;
    }
  };

  const handleNichesChange = (selectedNiches) => {
    setFormData(prev => ({ ...prev, niches: selectedNiches }));
    if (errors.niches) {
      setErrors(prev => ({ ...prev, niches: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (formData.rate < 0) {
      newErrors.rate = 'Rate must be a positive number';
    }

    if (formData.sellingPrice < 0) {
      newErrors.sellingPrice = 'Selling price must be a positive number';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    if (formData.niches.length === 0) {
      newErrors.niches = 'At least one niche must be selected';
    }

    // Platform-specific validation
    if (kolType === KOL_TYPES.SOCIAL_MEDIA) {
      // Check if at least one social media platform has a username
      const hasInstagram = extractUsername(formData.instagram, 'instagram').trim();
      const hasTiktok = extractUsername(formData.tiktok, 'tiktok').trim();
      const hasFacebook = extractUsername(formData.facebook, 'facebook').trim();
      
      if (!hasInstagram && !hasTiktok && !hasFacebook) {
        newErrors.platforms = 'At least one social media platform username is required';
      }
    } else if (kolType === KOL_TYPES.TWITTER_THREAD) {
      // Check if at least one platform has a username
      const hasTwitter = extractUsername(formData.twitter, 'twitter').trim();
      const hasThread = extractUsername(formData.thread, 'thread').trim();
      
      if (!hasTwitter && !hasThread) {
        newErrors.platforms = 'At least one platform username is required';
      }
    } else if (kolType === KOL_TYPES.BLOGGER) {
      if (!formData.blog) {
        newErrors.blog = 'Blog URL is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add submission date
      const dataToSave = {
        ...formData,
        submissionDate: new Date().toISOString()
      };
      
      await onSave(dataToSave);
      
      toast({
        title: 'Success!',
        description: 'KOL record saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form if not editing
      if (!initialData) {
        setFormData({
          name: '',
          instagram: '',
          tiktok: '',
          facebook: '',
          twitter: '',
          thread: '',
          blog: '',
          rate: 0,
          tier: TIERS[0],
          gender: GENDERS[0],
          niches: [],
          hairStyle: HAIR_STYLES[0],
          race: RACES[0],
          address: STATES[0],
          contactNumber: '',
          rateDetails: '',
          rateUpdatedAt: new Date().toISOString().split('T')[0],
          pic: PICS[0],
          kolType: kolType,
          notes: '',
          customFields: {}
        });
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description: error.message || 'Failed to save KOL record',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlatformFields = () => {
    switch (kolType) {
      case KOL_TYPES.SOCIAL_MEDIA:
        return (
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>Instagram Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.instagram, 'instagram')}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>TikTok Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.tiktok, 'tiktok')}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>Facebook Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.facebook, 'facebook')}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>YouTube Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @) or channel id"
                value={extractUsername(formData.youtube, 'youtube')}
                onChange={(e) => handleInputChange('youtube', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>Lemon8 Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.lemon8, 'lemon8')}
                onChange={(e) => handleInputChange('lemon8', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>XHS (XiaoHongShu) Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.xhs, 'xhs')}
                onChange={(e) => handleInputChange('xhs', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>
          </Grid>
        );
        
      case KOL_TYPES.TWITTER_THREAD:
        return (
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>Twitter Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.twitter, 'twitter')}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                <HStack spacing={2}>
                  <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                    <User size={14} color="#dc2626" />
                  </Box>
                  <Text>Thread Username</Text>
                </HStack>
              </FormLabel>
              <Input
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(220, 38, 38, 0.2)"
                borderRadius="lg"
                placeholder="username (without @)"
                value={extractUsername(formData.thread, 'thread')}
                onChange={(e) => handleInputChange('thread', e.target.value)}
                _focus={{
                  borderColor: 'red.400',
                  boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.95)'
                }}
                _hover={{
                  borderColor: 'red.300'
                }}
                transition="all 0.2s ease"
              />
            </FormControl>
          </Grid>
        );
        
      case KOL_TYPES.BLOGGER:
        return (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              <HStack spacing={2}>
                <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                  <FileText size={14} color="#dc2626" />
                </Box>
                <Text>Blog URL</Text>
              </HStack>
            </FormLabel>
            <Input
              bg="rgba(255, 255, 255, 0.8)"
              backdropFilter="blur(15px)"
              border="1px solid"
              borderColor="rgba(220, 38, 38, 0.2)"
              borderRadius="lg"
              placeholder="https://blogname.blogspot.com or https://blogname.com"
              value={formData.blog}
              onChange={(e) => handleInputChange('blog', e.target.value)}
              _focus={{
                borderColor: 'red.400',
                boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                bg: 'rgba(255, 255, 255, 0.95)'
              }}
              _hover={{
                borderColor: 'red.300'
              }}
              transition="all 0.2s ease"
            />
            {errors.blog && <FormErrorMessage>{errors.blog}</FormErrorMessage>}
          </FormControl>
        );
        
      default:
        return null;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box 
        bg={glassBg}
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor={glassBorder}
        p={6} 
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
          height: '3px',
          background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
          opacity: 0.8
        }}
      >
        <VStack spacing={5} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Heading 
              size="lg" 
              bgGradient="linear(to-r, red.500, red.700)" 
              bgClip="text"
              fontWeight="800"
              mb={3}
            >
              {title}
            </Heading>
            <Badge 
              colorScheme="red" 
              variant="subtle" 
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="600"
            >
              {kolType.replace('-', ' ').toUpperCase()}
            </Badge>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              {/* Basic Information */}
              <Box 
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                  <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                    <User size={18} color="#dc2626" />
                  </Box>
                  Basic Information
                </Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Full Name *</FormLabel>
                    <Input
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isInvalid={!!errors.contactNumber}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      <HStack spacing={2}>
                        <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                          <Phone size={14} color="#dc2626" />
                        </Box>
                        <Text>Contact Number *</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      placeholder="+60123456789"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.contactNumber && <FormErrorMessage>{errors.contactNumber}</FormErrorMessage>}
                  </FormControl>
                </Grid>
              </Box>

              {/* Platform Information */}
              <Box 
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                  <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                    <Link size={18} color="#dc2626" />
                  </Box>
                  Platform Information
                </Heading>
                {renderPlatformFields()}
                {errors.platforms && (
                  <Text color="red.500" fontSize="sm" mt={2}>
                    {errors.platforms}
                  </Text>
                )}
              </Box>

              {/* Rate & Tier */}
              <Box 
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                  <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                    <DollarSign size={18} color="#dc2626" />
                  </Box>
                  Rate & Tier
                </Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                  <FormControl isInvalid={!!errors.rate}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Rate (RM) *</FormLabel>
                    <Input
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      type="number"
                      placeholder="1500"
                      value={formData.rate}
                      onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.rate && <FormErrorMessage>{errors.rate}</FormErrorMessage>}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Tier</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.tier}
                      onChange={(e) => handleInputChange('tier', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {TIERS.map(tier => (
                        <option key={tier} value={tier}>{tier}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mt={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      <HStack spacing={2}>
                        <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                          <Calendar size={14} color="#dc2626" />
                        </Box>
                        <Text>Rate Last Updated</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      type="date"
                      value={formData.rateUpdatedAt ? formData.rateUpdatedAt.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('rateUpdatedAt', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Selling Price (internal RM)</FormLabel>
                    <Input
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      type="number"
                      placeholder="Internal selling price"
                      value={formData.sellingPrice}
                      onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Rating (stars)</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || 0)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </Select>
                  </FormControl>
                </Grid>

                <FormControl mt={4}>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Rate Details</FormLabel>
                  <Textarea
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.2)"
                    borderRadius="lg"
                    placeholder="e.g., Includes 3 posts + 5 stories + 1 reel"
                    value={formData.rateDetails}
                    onChange={(e) => handleInputChange('rateDetails', e.target.value)}
                    rows={3}
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300'
                    }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
              </Box>

              {/* Demographics */}
              <Box 
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                  <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                    <Users size={18} color="#dc2626" />
                  </Box>
                  Demographics
                </Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Gender</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {GENDERS.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Hair Style</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.hairStyle}
                      onChange={(e) => handleInputChange('hairStyle', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {HAIR_STYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Race</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.race}
                      onChange={(e) => handleInputChange('race', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {RACES.map(race => (
                        <option key={race} value={race}>{race}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      <HStack spacing={2}>
                        <Box p={1} borderRadius="md" bg="rgba(220, 38, 38, 0.1)">
                          <MapPin size={14} color="#dc2626" />
                        </Box>
                        <Text>State</Text>
                      </HStack>
                    </FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Box>

              {/* Niche & PIC */}
              <Box 
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                  <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                    <UserCheck size={18} color="#dc2626" />
                  </Box>
                  Niche & Management
                </Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                  <FormControl isInvalid={!!errors.niches}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Niche(s) *</FormLabel>
                    <Box 
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      p={4}
                    >
                      <CheckboxGroup value={formData.niches} onChange={handleNichesChange}>
                        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3}>
                          {NICHES.map(niche => (
                            <Checkbox 
                              key={niche} 
                              value={niche} 
                              colorScheme="red"
                              size="md"
                            >
                              <Text fontSize="sm" fontWeight="500">{niche}</Text>
                            </Checkbox>
                          ))}
                        </Grid>
                      </CheckboxGroup>
                    </Box>
                    {errors.niches && <FormErrorMessage>{errors.niches}</FormErrorMessage>}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">PIC (Person in Charge)</FormLabel>
                    <Select
                      bg="rgba(255, 255, 255, 0.8)"
                      backdropFilter="blur(15px)"
                      border="1px solid"
                      borderColor="rgba(220, 38, 38, 0.2)"
                      borderRadius="lg"
                      value={formData.pic}
                      onChange={(e) => handleInputChange('pic', e.target.value)}
                      _focus={{
                        borderColor: 'red.400',
                        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                        bg: 'rgba(255, 255, 255, 0.95)'
                      }}
                      _hover={{
                        borderColor: 'red.300'
                      }}
                      transition="all 0.2s ease"
                    >
                      {PICS.map(pic => (
                        <option key={pic} value={pic}>{pic}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Box>

              {/* Notes */}
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Additional Notes</FormLabel>
                  <Textarea
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.2)"
                    borderRadius="lg"
                    placeholder="Any additional information about this KOL..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    _focus={{
                      borderColor: 'red.400',
                      boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.95)'
                    }}
                    _hover={{
                      borderColor: 'red.300'
                    }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
              </Box>

              {/* Custom Fields */}
              {customFieldConfigs.length > 0 && (
                <Box
                  bg="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(10px)"
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                >
                  <Heading size="md" color="gray.700" mb={4} display="flex" alignItems="center">
                    <Box p={2} borderRadius="lg" bg="rgba(220, 38, 38, 0.1)" mr={3}>
                      <FileText size={18} color="#dc2626" />
                    </Box>
                    Additional Information
                  </Heading>
                  <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                    {customFieldConfigs.map(config => (
                      <FormControl key={config.field_key} isRequired={config.is_required}>
                        <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                          {config.field_label}
                          {config.is_required && <Text as="span" color="red.500" ml={1}>*</Text>}
                        </FormLabel>
                        {config.field_type === 'text' && (
                          <Input
                            bg="rgba(255, 255, 255, 0.8)"
                            backdropFilter="blur(15px)"
                            border="1px solid"
                            borderColor="rgba(220, 38, 38, 0.2)"
                            borderRadius="lg"
                            placeholder={`Enter ${config.field_label.toLowerCase()}`}
                            value={formData.customFields[config.field_key] || ''}
                            onChange={(e) => handleCustomFieldChange(config.field_key, e.target.value)}
                            _focus={{
                              borderColor: 'red.400',
                              boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                              bg: 'rgba(255, 255, 255, 0.95)'
                            }}
                            _hover={{
                              borderColor: 'red.300'
                            }}
                            transition="all 0.2s ease"
                          />
                        )}
                        {config.field_type === 'select' && (
                          <Select
                            bg="rgba(255, 255, 255, 0.8)"
                            backdropFilter="blur(15px)"
                            border="1px solid"
                            borderColor="rgba(220, 38, 38, 0.2)"
                            borderRadius="lg"
                            value={formData.customFields[config.field_key] || ''}
                            onChange={(e) => handleCustomFieldChange(config.field_key, e.target.value)}
                            _focus={{
                              borderColor: 'red.400',
                              boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                              bg: 'rgba(255, 255, 255, 0.95)'
                            }}
                            _hover={{
                              borderColor: 'red.300'
                            }}
                            transition="all 0.2s ease"
                          >
                            <option value="">Select {config.field_label.toLowerCase()}</option>
                            {config.field_options && config.field_options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Select>
                        )}
                        {config.field_type === 'textarea' && (
                          <Textarea
                            bg="rgba(255, 255, 255, 0.8)"
                            backdropFilter="blur(15px)"
                            border="1px solid"
                            borderColor="rgba(220, 38, 38, 0.2)"
                            borderRadius="lg"
                            placeholder={`Enter ${config.field_label.toLowerCase()}`}
                            value={formData.customFields[config.field_key] || ''}
                            onChange={(e) => handleCustomFieldChange(config.field_key, e.target.value)}
                            rows={3}
                            _focus={{
                              borderColor: 'red.400',
                              boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
                              bg: 'rgba(255, 255, 255, 0.95)'
                            }}
                            _hover={{
                              borderColor: 'red.300'
                            }}
                            transition="all 0.2s ease"
                          />
                        )}
                      </FormControl>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Action Buttons */}
              <HStack spacing={4} justify="center" pt={2}>
                <Button
                  type="button"
                  variant="outline"
                  colorScheme="red"
                  size="lg"
                  onClick={onCancel}
                  borderRadius="xl"
                  fontWeight="600"
                  px={8}
                  py={3}
                  borderWidth="2px"
                  _hover={{
                    bg: 'red.50',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.2)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="red"
                  size="lg"
                  leftIcon={<Save size={18} />}
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                  borderRadius="xl"
                  fontWeight="600"
                  px={8}
                  py={3}
                  bg="rgba(220, 38, 38, 0.9)"
                  backdropFilter="blur(15px)"
                  border="1px solid"
                  borderColor="rgba(220, 38, 38, 0.3)"
                  _hover={{
                    bg: 'rgba(220, 38, 38, 1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  Save KOL
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default KOLForm;

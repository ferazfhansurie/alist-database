import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Flex,
  SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Users,
  Upload,
  Download,
  UserPlus,
  Settings as SettingsIcon,
  Database,
  FileText,
  Trash2,
  Edit3,
  MoreVertical,
  Search,
  RefreshCw,
  Archive,
  Sliders
} from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    department: '',
    password: ''
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const fileInputRef = useRef(null);

  // Custom Fields State
  const [customFields, setCustomFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [customFieldForm, setCustomFieldForm] = useState({
    fieldKey: '',
    fieldLabel: '',
    fieldType: 'text',
    isRequired: false,
    displayOrder: 0
  });

  const toast = useToast();
  const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isCustomFieldOpen, onOpen: onCustomFieldOpen, onClose: onCustomFieldClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState(null);

  const { kols, createKOL, refreshData } = useDatabase();
  const { user: currentUser } = useAuth();

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.8)');

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch('https://e8c11521c11e51ab.ngrok.app/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCustomFields();
  }, [toast]);

  // Load custom fields from API
  const loadCustomFields = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/custom-fields');
      if (!response.ok) {
        throw new Error('Failed to fetch custom fields');
      }
      const data = await response.json();
      setCustomFields(data);
    } catch (error) {
      console.error('Error loading custom fields:', error);
    }
  };



  // Enhanced CSV parsing function that handles commas and quotes properly
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    return result;
  };

  // Helper function to clean and parse rate values
  const parseRate = (rateString) => {
    if (!rateString || rateString.trim() === '') return 0;
    
    // Remove "RM" prefix, commas, and spaces
    const cleaned = rateString.replace(/RM/g, '').replace(/,/g, '').replace(/\s/g, '');
    
    // Extract numeric value
    const match = cleaned.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper function to determine KOL type based on available platforms
  const determineKOLType = (instagram, tiktok, facebook, twitter, thread, blog) => {
    const platforms = [instagram, tiktok, facebook, twitter, thread, blog].filter(p => p && p.trim() !== '');
    
    if (platforms.length === 0) return 'social-media';
    if (instagram && tiktok) return 'social-media';
    if (tiktok && !instagram) return 'tiktok';
    if (instagram && !tiktok) return 'instagram';
    if (twitter || thread) return 'twitter-thread';
    if (blog) return 'blogger';
    
    return 'social-media';
  };

  // Helper function to clean and format hair style
  const formatHairStyle = (hairStyle) => {
    if (!hairStyle || hairStyle.trim() === '') return 'Free Hair';
    
    const cleaned = hairStyle.trim().toLowerCase();
    if (cleaned.includes('hijab')) return 'Hijab';
    if (cleaned.includes('free')) return 'Free Hair';
    if (cleaned.includes('not related')) return 'Not Related';
    
    // Handle exact matches
    const upperCleaned = hairStyle.trim().toUpperCase();
    if (upperCleaned === 'HIJAB') return 'Hijab';
    if (upperCleaned === 'FREE HAIR') return 'Free Hair';
    if (upperCleaned === 'NOT RELATED') return 'Not Related';
    
    return hairStyle.trim();
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const templateData = [
      'No,Name,IG Link,Rate for IG,TIKTOK link,Rate for Tiktok,Facebook,Facebook Rate,Twitter,Twitter Rate,Thread,Thread Rate,Blog,Blog Rate,Tier,Gender,Niche,Hijab/Free Hair,Race,Address,Contact Number,Date Rates & Details,PIC',
      '1,John Doe,https://instagram.com/johndoe,RM2500,https://tiktok.com/@johndoe,RM3000,https://facebook.com/johndoe,RM2000,https://twitter.com/johndoe,RM1500,https://threads.net/@johndoe,RM1800,https://johndoe.blogspot.com,RM1200,NANO,Male,"Fashion & Beauty;Lifestyle",Free Hair,Chinese,Selangor,+60123456789,Includes 3 posts + 5 stories,Amir',
      '2,Jane Smith,,,,,https://facebook.com/janesmith,RM1800,https://twitter.com/janesmith,RM2000,https://threads.net/@janesmith,RM2200,https://janesmith.blogspot.com,RM1500,MICRO,Female,"Technology;Education",Hijab,Malay,Kuala Lumpur,+60187654321,Includes 2 posts,Tika'
    ].join('\n');

    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'juta_kol_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'JUTA KOL CSV template downloaded successfully. Use this format for importing KOLs.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('https://e8c11521c11e51ab.ngrok.app/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const createdUser = await response.json();
      setUsers(prev => [...prev, createdUser]);

      toast({
        title: 'User Created Successfully',
        description: `User can login with email: ${createdUser.email} and password: ${createdUser.tempPassword}`,
        status: 'success',
        duration: 8000,
        isClosable: true,
      });

      setNewUser({ name: '', email: '', role: 'viewer', department: '', password: '' });
      onAddUserClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`https://e8c11521c11e51ab.ngrok.app/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));

      toast({
        title: 'Success',
        description: 'User deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUserToDelete(null);
      onDeleteClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please select a JSON or CSV file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      // Read and parse file content
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      let importData = [];
      
      if (file.name.endsWith('.json')) {
        importData = JSON.parse(fileContent);
        } else if (file.name.endsWith('.csv')) {
          // Enhanced CSV parsing with better handling of commas and quotes
          const lines = fileContent.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            throw new Error('CSV file must have at least a header row and one data row');
          }
          
          const headers = parseCSVLine(lines[0]);
          importData = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
            });
            return obj;
          });
        }

        // Filter out empty or invalid records before processing
        const validImportData = importData.filter(kolData => {
          const name = kolData.name || kolData.Name || '';
          const hasName = name.trim() !== '';
          const hasAnyPlatform = (kolData.instagram || kolData.Instagram || kolData['IG Link'] || '').trim() !== '' ||
                                (kolData.tiktok || kolData.TikTok || kolData['TIKTOK link'] || '').trim() !== '' ||
                                (kolData.facebook || kolData.Facebook || '').trim() !== '' ||
                                (kolData.twitter || kolData.Twitter || '').trim() !== '' ||
                                (kolData.thread || kolData.Thread || '').trim() !== '' ||
                                (kolData.blog || kolData.Blog || '').trim() !== '';
          
          return hasName && hasAnyPlatform;
        });

        // Import data to database
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;
        
        for (let i = 0; i < validImportData.length; i++) {
          const kolData = validImportData[i];
          
          // Update progress
          const progress = Math.round(((i + 1) / validImportData.length) * 100);
          setImportProgress(progress);
          
          try {
            // Map CSV/JSON data to KOL format - handle both old and new CSV formats
            const instagramLink = kolData.instagram || kolData.Instagram || kolData['IG Link'] || '';
            const tiktokLink = kolData.tiktok || kolData.TikTok || kolData['TIKTOK link'] || '';
            const facebookLink = kolData.facebook || kolData.Facebook || '';
            const twitterLink = kolData.twitter || kolData.Twitter || '';
            const threadLink = kolData.thread || kolData.Thread || '';
            const blogLink = kolData.blog || kolData.Blog || '';
            
            const instagramRate = parseRate(kolData.instagramRate || kolData.instagram_rate || kolData['Rate for IG'] || 0);
            const tiktokRate = parseRate(kolData.tiktokRate || kolData.tiktok_rate || kolData['Rate for Tiktok'] || 0);
            const facebookRate = parseRate(kolData.facebookRate || kolData.facebook_rate || kolData['Facebook Rate'] || 0);
            const twitterRate = parseRate(kolData.twitterRate || kolData.twitter_rate || kolData['Twitter Rate'] || 0);
            const threadRate = parseRate(kolData.threadRate || kolData.thread_rate || kolData['Thread Rate'] || 0);
            const blogRate = parseRate(kolData.blogRate || kolData.blog_rate || kolData['Blog Rate'] || 0);
            
            // Calculate overall rate as the highest platform rate
            const overallRate = Math.max(instagramRate, tiktokRate, facebookRate, twitterRate, threadRate, blogRate, parseRate(kolData.rate || kolData.Rate || 0));
            
            // Parse niches from various possible column names
            let niches = [];
            const nicheValue = kolData.niches || kolData.niche || kolData['Niche '] || kolData['Niche'] || '';
            if (nicheValue && nicheValue.trim() !== '') {
              if (Array.isArray(nicheValue)) {
                niches = nicheValue;
              } else {
                // Split by semicolon, comma, or pipe, then trim and filter empty values
                niches = nicheValue
                  .split(/[;,|]/)
                  .map(n => n.trim())
                  .filter(n => n && n !== '');
              }
            }

            const mappedData = {
              name: kolData.name || kolData.Name || '',
              instagram: instagramLink,
              tiktok: tiktokLink,
              facebook: facebookLink,
              twitter: twitterLink,
              thread: threadLink,
              blog: blogLink,
              rate: overallRate,
              instagramRate: instagramRate,
              tiktokRate: tiktokRate,
              facebookRate: facebookRate,
              twitterRate: twitterRate,
              threadRate: threadRate,
              blogRate: blogRate,
              tier: kolData.tier || kolData.Tier || 'Tier 3 (Emerging)',
              gender: kolData.gender || kolData.Gender || 'Other',
              hairStyle: formatHairStyle(kolData.hairStyle || kolData.hair_style || kolData['Hijab/Free Hair'] || 'Free Hair'),
              race: kolData.race || kolData.Race || 'Other',
              address: kolData.address || kolData.Address || 'Selangor',
              contactNumber: kolData.contactNumber || kolData.contact_number || kolData.contact || kolData['Contact Number'] || '',
              rateDetails: kolData.rateDetails || kolData.rate_details || kolData['Date Rates & Details'] || '',
              pic: kolData.pic || kolData.PIC || 'Amir',
              kolType: determineKOLType(instagramLink, tiktokLink, facebookLink, twitterLink, threadLink, blogLink),
              notes: kolData.notes || kolData.Notes || '',
              niches: niches
            };

            // Send to API
            const response = await fetch('https://e8c11521c11e51ab.ngrok.app/api/kols', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(mappedData),
            });

            if (response.ok) {
              successCount++;
            } else {
              errorCount++;
              console.error(`Failed to import KOL: ${mappedData.name}`);
            }
          } catch (error) {
            errorCount++;
            console.error(`Error importing KOL: ${kolData.name}`, error);
          }
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Calculate skipped count
        skippedCount = importData.length - validImportData.length;

        toast({
          title: 'Import Complete',
          description: `Successfully imported ${successCount} KOLs from ${file.name}. ${skippedCount > 0 ? `${skippedCount} empty records skipped.` : ''} ${errorCount > 0 ? `${errorCount} records failed.` : ''}`,
          status: successCount > 0 ? 'success' : 'warning',
          duration: 5000,
          isClosable: true,
        });

        // Refresh KOL data
        refreshData();
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import data. Please check file format.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExportData = async (format) => {
    if (!kols || kols.length === 0) {
      toast({
        title: 'No Data',
        description: 'No KOL data available to export',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Export Started',
      description: `Exporting ${kols.length} KOL records in ${format.toUpperCase()} format...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    try {
      let exportContent = '';
      let mimeType = '';
      let fileName = '';

      if (format === 'json') {
        exportContent = JSON.stringify(kols, null, 2);
        mimeType = 'application/json';
        fileName = `kol_export_${new Date().toISOString().split('T')[0]}.json`;
      } else if (format === 'csv') {
        // Convert to CSV with platform-specific rates
        const headers = ['id', 'name', 'instagram', 'instagramRate', 'tiktok', 'tiktokRate', 'facebook', 'facebookRate', 'twitter', 'twitterRate', 'thread', 'threadRate', 'blog', 'blogRate', 'rate', 'tier', 'gender', 'niches', 'race', 'address', 'contactNumber', 'kolType'];
        const csvRows = [headers.join(',')];
        
        kols.forEach(kol => {
          const row = headers.map(header => {
            let value = kol[header];
            if (Array.isArray(value)) {
              value = value.join(';');
            }
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csvRows.push(row.join(','));
        });
        
        exportContent = csvRows.join('\n');
        mimeType = 'text/csv';
        fileName = `kol_export_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (format === 'xlsx') {
        // For Excel format, we'll export as CSV since creating actual XLSX requires a library
        const headers = ['ID', 'Name', 'Instagram', 'Instagram Rate', 'TikTok', 'TikTok Rate', 'Facebook', 'Facebook Rate', 'Twitter', 'Twitter Rate', 'Thread', 'Thread Rate', 'Blog', 'Blog Rate', 'Overall Rate', 'Tier', 'Gender', 'Niches', 'Race', 'Address', 'Contact Number', 'KOL Type'];
        const csvRows = [headers.join(',')];
        
        kols.forEach(kol => {
          const row = [
            kol.id,
            kol.name,
            kol.instagram,
            kol.instagramRate || 0,
            kol.tiktok,
            kol.tiktokRate || 0,
            kol.facebook,
            kol.facebookRate || 0,
            kol.twitter,
            kol.twitterRate || 0,
            kol.thread,
            kol.threadRate || 0,
            kol.blog,
            kol.blogRate || 0,
            kol.rate,
            kol.tier,
            kol.gender,
            Array.isArray(kol.niches) ? kol.niches.join(';') : kol.niches,
            kol.race,
            kol.address,
            kol.contactNumber,
            kol.kolType
          ].map(value => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csvRows.push(row.join(','));
        });
        
        exportContent = csvRows.join('\n');
        mimeType = 'text/csv';
        fileName = `kol_export_${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create and download file
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: `Successfully exported ${kols.length} KOL records as ${format.toUpperCase()}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'editor':
        return 'blue';
      case 'viewer':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'green' : 'gray';
  };

  // Custom Field Handlers
  const handleAddCustomField = () => {
    setEditingField(null);
    setCustomFieldForm({
      fieldKey: '',
      fieldLabel: '',
      fieldType: 'text',
      isRequired: false,
      displayOrder: 0
    });
    onCustomFieldOpen();
  };

  const handleEditCustomField = (field) => {
    setEditingField(field);
    setCustomFieldForm({
      fieldKey: field.field_key,
      fieldLabel: field.field_label,
      fieldType: field.field_type,
      isRequired: field.is_required,
      displayOrder: field.display_order
    });
    onCustomFieldOpen();
  };

  const handleSaveCustomField = async () => {
    if (!customFieldForm.fieldKey || !customFieldForm.fieldLabel || !customFieldForm.fieldType) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const url = editingField
        ? `http://localhost:3001/api/custom-fields/${editingField.id}`
        : 'http://localhost:3001/api/custom-fields';

      const method = editingField ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customFieldForm),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Custom field ${editingField ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        loadCustomFields();
        onCustomFieldClose();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save custom field');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCustomField = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom field?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/custom-fields/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Custom field deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        loadCustomFields();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete custom field',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8} px={4}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <VStack spacing={6} align="stretch">
      


          {/* Main Content Tabs */}
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="red">
            <TabList
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(220, 38, 38, 0.1)"
              p={1}
            >
              <Tab
                _selected={{
                  bg: 'red.500',
                  color: 'white',
                  borderRadius: 'lg'
                }}
                borderRadius="lg"
                fontWeight="600"
              >
                <HStack spacing={2}>
                  <Users size={18} />
                  <Text>User Management</Text>
                </HStack>
              </Tab>
              <Tab
                _selected={{
                  bg: 'red.500',
                  color: 'white',
                  borderRadius: 'lg'
                }}
                borderRadius="lg"
                fontWeight="600"
              >
                <HStack spacing={2}>
                  <Database size={18} />
                  <Text>Data Management</Text>
                </HStack>
              </Tab>
              <Tab
                _selected={{
                  bg: 'red.500',
                  color: 'white',
                  borderRadius: 'lg'
                }}
                borderRadius="lg"
                fontWeight="600"
              >
                <HStack spacing={2}>
                  <Sliders size={18} />
                  <Text>Custom Fields</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* User Management Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Card
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.1)"
                    borderRadius="xl"
                  >
                    <CardHeader>
                      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Heading size="md" color="red.600">User Management</Heading>
                        <HStack spacing={3}>
                          <InputGroup maxW="300px">
                            <InputLeftElement pointerEvents="none">
                              <Search size={16} color="#666" />
                            </InputLeftElement>
                            <Input
                              placeholder="Search users..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              borderRadius="lg"
                              bg="rgba(255, 255, 255, 0.8)"
                            />
                          </InputGroup>
                          <Button
                            leftIcon={<UserPlus size={16} />}
                            colorScheme="red"
                            size="sm"
                            onClick={onAddUserOpen}
                            borderRadius="lg"
                            px={6}
                            py={2}
                          >
                            Add User
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Box overflowX="auto">
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>User</Th>
                              <Th>Role</Th>
                              <Th>Department</Th>
                              <Th>Status</Th>
                              <Th>Last Active</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredUsers.map((user) => (
                              <Tr key={user.id}>
                                <Td>
                                  <HStack spacing={3}>
                                    <Avatar
                                      size="sm"
                                      name={user.name}
                                      bg="red.500"
                                      color="white"
                                    />
                                    <VStack align="start" spacing={0}>
                                      <Text fontWeight="600" fontSize="sm">
                                        {user.name}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {user.email}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={getRoleBadgeColor(user.role)}
                                    variant="subtle"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                  >
                                    {user.role.toUpperCase()}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Text fontSize="sm">{user.department}</Text>
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={getStatusBadgeColor(user.status)}
                                    variant="subtle"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                  >
                                    {user.status.toUpperCase()}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" color="gray.600">
                                    {user.lastActive}
                                  </Text>
                                </Td>
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      as={IconButton}
                                      icon={<MoreVertical size={16} />}
                                      variant="ghost"
                                      size="sm"
                                      borderRadius="lg"
                                    />
                                    <MenuList>
                                      <MenuItem icon={<Edit3 size={16} />}>
                                        Edit User
                                      </MenuItem>
                                      <MenuItem
                                        icon={<Trash2 size={16} />}
                                        color="red.500"
                                        onClick={() => {
                                          setUserToDelete(user);
                                          onDeleteOpen();
                                        }}
                                      >
                                        Delete User
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Data Management Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {/* Import Section */}
                  <Card
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.1)"
                    borderRadius="xl"
                  >
                    <CardHeader>
                      <HStack spacing={3}>
                        <Upload size={20} color="#dc2626" />
                        <Heading size="md" color="red.600">Import Data</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Text color="gray.600" fontSize="sm">
                          Import KOL data from JSON or CSV files. Download the template to see the required format. 
                          Supported formats: .json, .csv
                        </Text>
                        
                        <Alert status="info" borderRadius="lg" fontSize="sm">
                          <AlertIcon />
                          <Box>
                            <AlertTitle fontSize="sm">JUTA CSV Format:</AlertTitle>
                            <AlertDescription fontSize="xs">
                              Supports the JUTA database format with columns: Name, IG Link, Rate for IG, TIKTOK link, Rate for Tiktok, Tier, Gender, Niche, Hijab/Free Hair, Race, Address, Contact Number, Date Rates & Details, PIC. 
                              Rate values can include "RM" prefix and commas (e.g., "RM2,000.00"). 
                              Multiple niches can be separated by semicolons (e.g., "Fashion & Beauty;Lifestyle").
                            </AlertDescription>
                          </Box>
                        </Alert>
                        
                        {isImporting && (
                          <Box>
                            <Text fontSize="sm" mb={2} color="blue.600">
                              Importing data... {importProgress}%
                            </Text>
                            <Progress value={importProgress} colorScheme="blue" borderRadius="md" />
                          </Box>
                        )}
                        
                        <HStack spacing={3}>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.csv"
                            onChange={handleFileImport}
                            style={{ display: 'none' }}
                          />
                          <Button
                            leftIcon={<Upload size={16} />}
                            colorScheme="blue"
                            onClick={() => fileInputRef.current?.click()}
                            isDisabled={isImporting}
                            borderRadius="lg"
                          >
                            Select File to Import
                          </Button>
                          <Button
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FileText size={16} />}
                            borderRadius="lg"
                            onClick={handleDownloadTemplate}
                          >
                            Download Template
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Export Section */}
                  <Card
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.1)"
                    borderRadius="xl"
                  >
                    <CardHeader>
                      <HStack spacing={3}>
                        <Download size={20} color="#dc2626" />
                        <Heading size="md" color="red.600">Export Data</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Text color="gray.600" fontSize="sm">
                          Export your KOL database in various formats for backup or analysis
                        </Text>
                        
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                          <Button
                            leftIcon={<Download size={16} />}
                            colorScheme="green"
                            onClick={() => handleExportData('json')}
                            borderRadius="lg"
                          >
                            Export as JSON
                          </Button>
                          <Button
                            leftIcon={<Download size={16} />}
                            colorScheme="orange"
                            onClick={() => handleExportData('csv')}
                            borderRadius="lg"
                          >
                            Export as CSV
                          </Button>
                          <Button
                            leftIcon={<Download size={16} />}
                            colorScheme="purple"
                            onClick={() => handleExportData('xlsx')}
                            borderRadius="lg"
                          >
                            Export as Excel
                          </Button>
                        </SimpleGrid>
                      </VStack>
                    </CardBody>
                  </Card>

                </VStack>
              </TabPanel>

              {/* Custom Fields Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Card
                    bg={cardBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="rgba(220, 38, 38, 0.1)"
                    borderRadius="xl"
                  >
                    <CardHeader>
                      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Heading size="md" color="red.600">Custom Fields Configuration</Heading>
                        <Button
                          leftIcon={<UserPlus size={16} />}
                          colorScheme="red"
                          size="sm"
                          onClick={handleAddCustomField}
                          borderRadius="lg"
                          px={6}
                          py={2}
                        >
                          Add Custom Field
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={4} align="stretch">
                        <Text color="gray.600" fontSize="sm">
                          Configure additional fields that will appear in KOL forms. These fields are dynamic and can be added without modifying the database schema.
                        </Text>

                        <Box overflowX="auto">
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Field Key</Th>
                                <Th>Field Label</Th>
                                <Th>Type</Th>
                                <Th>Required</Th>
                                <Th>Display Order</Th>
                                <Th>Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {customFields.map((field) => (
                                <Tr key={field.id}>
                                  <Td fontFamily="mono" fontSize="sm" fontWeight="600">
                                    {field.field_key}
                                  </Td>
                                  <Td fontWeight="600">{field.field_label}</Td>
                                  <Td>
                                    <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                                      {field.field_type}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    {field.is_required ? (
                                      <Badge colorScheme="red" fontSize="xs">Required</Badge>
                                    ) : (
                                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                                    )}
                                  </Td>
                                  <Td>{field.display_order}</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton
                                        size="sm"
                                        icon={<Edit3 size={16} />}
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEditCustomField(field)}
                                        aria-label="Edit field"
                                      />
                                      <IconButton
                                        size="sm"
                                        icon={<Trash2 size={16} />}
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDeleteCustomField(field.id)}
                                        aria-label="Delete field"
                                      />
                                    </HStack>
                                  </Td>
                                </Tr>
                              ))}
                              {customFields.length === 0 && (
                                <Tr>
                                  <Td colSpan={6} textAlign="center" py={8}>
                                    <VStack spacing={2}>
                                      <Text color="gray.500">No custom fields configured yet</Text>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="red"
                                        onClick={handleAddCustomField}
                                      >
                                        Add Your First Custom Field
                                      </Button>
                                    </VStack>
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

            </TabPanels>
          </Tabs>
        </VStack>
      </MotionBox>

      {/* Add User Modal */}
      <Modal isOpen={isAddUserOpen} onClose={onAddUserClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
        >
          <ModalHeader color="red.600" fontWeight="700">
            Add New User
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.8)"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.8)"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.8)"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Department</FormLabel>
                <Input
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="Enter department"
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.8)"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password (Optional)</FormLabel>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Leave empty for auto-generated password"
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.8)"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  If left empty, a random password will be generated
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddUserClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleAddUser}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
        >
          <ModalHeader color="red.600" fontWeight="700">
            Delete User
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="center">
              <Box
                p={4}
                borderRadius="full"
                bg="rgba(220, 38, 38, 0.1)"
              >
                <Trash2 size={32} color="#dc2626" />
              </Box>
              <Text textAlign="center">
                Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
                This action cannot be undone.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Custom Field Modal */}
      <Modal isOpen={isCustomFieldOpen} onClose={onCustomFieldClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
        >
          <ModalHeader color="red.600" fontWeight="700">
            {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">
                  Field Key (no spaces, lowercase)
                </FormLabel>
                <Input
                  value={customFieldForm.fieldKey}
                  onChange={(e) =>
                    setCustomFieldForm({ ...customFieldForm, fieldKey: e.target.value.toLowerCase().replace(/\s/g, '_') })
                  }
                  placeholder="e.g., ic_number"
                  isDisabled={!!editingField}
                  bg="rgba(255, 255, 255, 0.8)"
                  borderRadius="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  This is the unique identifier for the field (cannot be changed after creation)
                </Text>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">
                  Field Label
                </FormLabel>
                <Input
                  value={customFieldForm.fieldLabel}
                  onChange={(e) =>
                    setCustomFieldForm({ ...customFieldForm, fieldLabel: e.target.value })
                  }
                  placeholder="e.g., IC Number"
                  bg="rgba(255, 255, 255, 0.8)"
                  borderRadius="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  This is what users will see in the form
                </Text>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">
                  Field Type
                </FormLabel>
                <Select
                  value={customFieldForm.fieldType}
                  onChange={(e) =>
                    setCustomFieldForm({ ...customFieldForm, fieldType: e.target.value })
                  }
                  bg="rgba(255, 255, 255, 0.8)"
                  borderRadius="lg"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Text Area</option>
                  <option value="select">Select (Dropdown)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">
                  Display Order
                </FormLabel>
                <Input
                  type="number"
                  value={customFieldForm.displayOrder}
                  onChange={(e) =>
                    setCustomFieldForm({ ...customFieldForm, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  bg="rgba(255, 255, 255, 0.8)"
                  borderRadius="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Lower numbers appear first
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCustomFieldClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleSaveCustomField}>
              {editingField ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Settings;
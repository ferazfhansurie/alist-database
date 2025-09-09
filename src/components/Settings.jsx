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
  Archive
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
  
  const toast = useToast();
  const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
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
  }, [toast]);



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

  // Download CSV template
  const handleDownloadTemplate = () => {
    const templateData = [
      'name,instagram,tiktok,facebook,twitter,thread,blog,rate,tier,gender,hair_style,race,address,contact_number,rate_details,pic,kol_type,notes,niches',
      'John Doe,https://instagram.com/johndoe,https://tiktok.com/@johndoe,,,,,2500,Tier 1 (Premium),Male,Free Hair,Chinese,Selangor,+60123456789,Includes 3 posts + 5 stories,Amir,social-media,Sample KOL,Fashion & Beauty;Lifestyle',
      'Jane Smith,,,,https://twitter.com/janesmith,https://threads.net/@janesmith,,,1800,Tier 2 (Mid-tier),Female,Free Hair,Malay,Kuala Lumpur,+60187654321,Includes 2 tweets + 1 thread,Tika,twitter-thread,Another sample,Technology;Business & Finance'
    ].join('\n');

    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kol_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'CSV template downloaded successfully. Use this format for importing KOLs.',
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

        // Import data to database
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < importData.length; i++) {
          const kolData = importData[i];
          
          // Update progress
          const progress = Math.round(((i + 1) / importData.length) * 100);
          setImportProgress(progress);
          
          try {
            // Map CSV/JSON data to KOL format
            const mappedData = {
              name: kolData.name || kolData.Name || '',
              instagram: kolData.instagram || kolData.Instagram || '',
              tiktok: kolData.tiktok || kolData.TikTok || '',
              facebook: kolData.facebook || kolData.Facebook || '',
              twitter: kolData.twitter || kolData.Twitter || '',
              thread: kolData.thread || kolData.Thread || '',
              blog: kolData.blog || kolData.Blog || '',
              rate: parseFloat(kolData.rate || kolData.Rate || 0),
              tier: kolData.tier || kolData.Tier || 'Tier 3 (Emerging)',
              gender: kolData.gender || kolData.Gender || 'Other',
              hairStyle: kolData.hairStyle || kolData.hair_style || 'Free Hair',
              race: kolData.race || kolData.Race || 'Other',
              address: kolData.address || kolData.Address || 'Selangor',
              contactNumber: kolData.contactNumber || kolData.contact_number || kolData.contact || '',
              rateDetails: kolData.rateDetails || kolData.rate_details || '',
              pic: kolData.pic || kolData.PIC || 'Amir',
              kolType: kolData.kolType || kolData.kol_type || 'social-media',
              notes: kolData.notes || kolData.Notes || '',
              niches: kolData.niches ? (Array.isArray(kolData.niches) ? kolData.niches : kolData.niches.split(';')) : []
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

        toast({
          title: 'Import Complete',
          description: `Successfully imported ${successCount} KOLs from ${file.name}. ${errorCount > 0 ? `${errorCount} records failed.` : ''}`,
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
        // Convert to CSV
        const headers = ['id', 'name', 'instagram', 'tiktok', 'facebook', 'twitter', 'thread', 'blog', 'rate', 'tier', 'gender', 'niches', 'race', 'address', 'contactNumber', 'kolType'];
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
        const headers = ['ID', 'Name', 'Instagram', 'TikTok', 'Facebook', 'Twitter', 'Thread', 'Blog', 'Rate', 'Tier', 'Gender', 'Niches', 'Race', 'Address', 'Contact Number', 'KOL Type'];
        const csvRows = [headers.join(',')];
        
        kols.forEach(kol => {
          const row = [
            kol.id,
            kol.name,
            kol.instagram,
            kol.tiktok,
            kol.facebook,
            kol.twitter,
            kol.thread,
            kol.blog,
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
                            <AlertTitle fontSize="sm">CSV Format:</AlertTitle>
                            <AlertDescription fontSize="xs">
                              Use semicolons (;) to separate multiple niches. Include quotes around values with commas. 
                              Download template for exact column names and format.
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
    </Container>
  );
};

export default Settings;
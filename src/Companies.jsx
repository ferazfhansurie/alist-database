import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  InputGroup,
  InputLeftElement,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Container,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { 
  Search, 
  Download,
  Eye,
  ExternalLink,
  Building2,
  Users,
  DollarSign,
  Globe
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VerticalHeader from './VerticalHeader';
import { hierarchicalService } from '../data/sampleData';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Get companies from hierarchical service
  const getCompanies = () => {
    const companiesArray = [];
    for (const [id, company] of hierarchicalService.companies) {
      // Ensure we have proper company names and meaningful data
      const companyName = company.companyName || company.displayedName || company.identification || `Company ${id}`;
      const country = company.country || 'Unknown';
      const industry = company.industry || 'Other';
      
      companiesArray.push({
        ...company,
        id: id,
        companyName: companyName,
        displayedName: companyName,
        country: country,
        industry: industry
      });
    }
    return companiesArray;
  };

  // Get related data for a company
  const getCompanyRelatedData = (companyId) => {
    if (!companyId) return { investors: [], funds: [], deals: [] };
    
    return {
      investors: hierarchicalService.getCompanyRelatedInvestors(companyId) || [],
      funds: hierarchicalService.getCompanyRelatedFunds(companyId) || [],
      deals: hierarchicalService.getCompanyDeals(companyId) || []
    };
  };

  useEffect(() => {
    // Populate sample data if not already populated
    if (hierarchicalService.companies.size === 0) {
      import('../data/sampleData.js').then(({ populateSampleData }) => {
        populateSampleData(hierarchicalService);
        const companiesData = getCompanies();
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
      });
    } else {
      const companiesData = getCompanies();
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
    }
  }, []);

  // Check for highlight parameter in URL
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      // Find the company and filter to show only that company
      const companyIndex = companies.findIndex(company => company.id === highlightId);
      if (companyIndex !== -1) {
        const highlightedCompany = companies[companyIndex];
        // Filter to show only the highlighted company
        setFilteredCompanies([highlightedCompany]);
        setCurrentPage(1);
        // Set search term to help user see what's filtered
        setSearchTerm(highlightedCompany.companyName || highlightedCompany.displayedName || highlightId);
        toast({
          title: 'Company Filtered',
          description: `Showing only: ${highlightedCompany.companyName || highlightedCompany.displayedName || highlightId}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [companies, searchParams, toast]);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, selectedIndustry, selectedStatus, selectedCountry, companies]);

  const filterCompanies = () => {
    let filtered = companies;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.chineseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.displayedName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply industry filter
    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(company => company.listingStatus === selectedStatus);
    }

    // Apply country filter
    if (selectedCountry) {
      filtered = filtered.filter(company => company.country === selectedCountry);
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  };

  // Clear all filters and show all companies
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedStatus('');
    setSelectedCountry('');
    setFilteredCompanies(companies);
    setCurrentPage(1);
    // Clear URL parameters
    setSearchParams({});
  };

  const exportToCSV = () => {
    const headers = [
      'Company ID', 'Company Name', 'Chinese Name', 'Industry', 'Country', 'Listing Status',
      'Tech Category', 'AI Deal', 'Healthcare Deal', 'Website', 'Email'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredCompanies.map(company => [
        company.id,
        `"${company.companyName || ''}"`,
        `"${company.chineseName || ''}"`,
        `"${company.industry || ''}"`,
        `"${company.country || ''}"`,
        `"${company.listingStatus || ''}"`,
        company.techCategory ? 'Yes' : 'No',
        company.aiDeal ? 'Yes' : 'No',
        company.healthcareDeal ? 'Yes' : 'No',
        `"${company.website || ''}"`,
        `"${company.email || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'companies_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: `Exported ${filteredCompanies.length} companies to CSV`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const openCompanyDetail = (company) => {
    setSelectedCompany(company);
    onOpen();
  };

  const navigateToInvestor = (investorId) => {
    navigate(`/investors?highlight=${investorId}`);
    toast({
      title: 'Navigating to Investor',
      description: 'Filtering to show the specific investor',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const navigateToFund = (fundId) => {
    navigate(`/funds?highlight=${fundId}`);
    toast({
      title: 'Navigating to Fund',
      description: 'Filtering to show the specific fund',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const navigateToDeal = (dealId) => {
    navigate(`/deals?highlight=${dealId}`);
    toast({
      title: 'Navigating to Deal',
      description: 'Filtering to show the specific deal',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getIndustryOptions = () => {
    const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))];
    return industries.sort();
  };

  const getStatusOptions = () => {
    const statuses = [...new Set(companies.map(company => company.listingStatus).filter(Boolean))];
    return statuses.sort();
  };

  const getCountryOptions = () => {
    const countries = [...new Set(companies.map(company => company.country).filter(Boolean))];
    return countries.sort();
  };

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  return (
    <Box bg={bgColor} minH="100vh">
      <VerticalHeader />
      <Box ml={{ base: 0, lg: "280px" }}>
        <Container maxW="1400px" py={8}>
          <VStack spacing={8} align="stretch">
            
            {/* Search and Filters */}
            <Card 
              bg="rgba(59, 130, 246, 0.05)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(59, 130, 246, 0.2)"
              shadow="xl"
              borderRadius="2xl"
              overflow="hidden"
            >
              <CardBody p={4}>
                <VStack spacing={4} align="stretch">
                  
                  {/* Search Bar */}
                  <Box>
                    <Text fontSize="xs" color="blue.600" mb={1} fontWeight="medium">
                      Search
                    </Text>
                    <InputGroup size="md">
                      <InputLeftElement pointerEvents="none">
                        <Search color="blue.400" size={18} />
                      </InputLeftElement>
                      <Input
                        placeholder="Search companies by name, industry, or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        border="1px solid"
                        borderColor="rgba(59, 130, 246, 0.2)"
                        _focus={{ 
                          boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
                          borderColor: 'blue.400'
                        }}
                        _hover={{ borderColor: 'blue.300' }}
                        borderRadius="lg"
                      />
                    </InputGroup>
                  </Box>

                  {/* Filters Row */}
                  <Box>
                    <Text fontSize="sm" color="blue.600" mb={3} fontWeight="medium">
                      Filters
                    </Text>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                      <Box>
                        <Text fontSize="xs" color="blue.600" mb={2}>Industry</Text>
                        <Select
                          size="md"
                          placeholder="All Industries"
                          value={selectedIndustry}
                          onChange={(e) => setSelectedIndustry(e.target.value)}
                          bg="white"
                          border="1px solid"
                          borderColor="rgba(59, 130, 246, 0.2)"
                          _focus={{ borderColor: 'blue.400' }}
                          borderRadius="lg"
                        >
                          {getIndustryOptions().map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </Select>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color="blue.600" mb={2}>Listing Status</Text>
                        <Select
                          size="md"
                          placeholder="All Statuses"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          bg="white"
                          border="1px solid"
                          borderColor="rgba(59, 130, 246, 0.2)"
                          _focus={{ borderColor: 'blue.400' }}
                          borderRadius="lg"
                        >
                          {getStatusOptions().map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </Select>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color="blue.600" mb={2}>Country</Text>
                        <Select
                          size="md"
                          placeholder="All Countries"
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          bg="white"
                          border="1px solid"
                          borderColor="rgba(59, 130, 246, 0.2)"
                          _focus={{ borderColor: 'blue.400' }}
                          borderRadius="lg"
                        >
                          {getCountryOptions().map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </Select>
                      </Box>
                    </Grid>
                  </Box>

                  {/* Action Buttons */}
                  <HStack spacing={4} justify="center" pt={2}>
                    <Button
                      size="md"
                      colorScheme="blue"
                      leftIcon={<Download size={18} />}
                      onClick={exportToCSV}
                      bg="blue.500"
                      _hover={{ bg: 'blue.600' }}
                      _active={{ bg: 'blue.700' }}
                      borderRadius="xl"
                      px={8}
                    >
                      Export CSV
                    </Button>
                    <Button
                      size="md"
                      colorScheme="gray"
                      variant="outline"
                      onClick={clearFilters}
                      borderColor="rgba(59, 130, 246, 0.3)"
                      color="blue.600"
                      _hover={{ 
                        bg: 'rgba(59, 130, 246, 0.05)',
                        borderColor: 'blue.400'
                      }}
                      borderRadius="xl"
                      px={8}
                    >
                      Clear All Filters
                    </Button>
                  </HStack>

                  {/* Active Filters Summary */}
                  {(selectedIndustry || selectedStatus || selectedCountry) && (
                    <Box>
                      <Text fontSize="sm" color="blue.600" mb={2} fontWeight="medium">
                        Active Filters
                      </Text>
                      <HStack spacing={2} wrap="wrap">
                        {selectedIndustry && (
                          <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1}>
                            Industry: {selectedIndustry}
                          </Badge>
                        )}
                        {selectedStatus && (
                          <Badge colorScheme="green" variant="subtle" borderRadius="full" px={3} py={1}>
                            Status: {selectedStatus}
                          </Badge>
                        )}
                        {selectedCountry && (
                          <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3} py={1}>
                            Country: {selectedCountry}
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Results Summary */}
            <Card 
              bg="rgba(59, 130, 246, 0.05)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(59, 130, 246, 0.2)"
              shadow="xl"
              borderRadius="2xl"
              overflow="hidden"
            >
              <CardBody p={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">
                      Company Search Results
                    </Text>
                    <Text fontSize="sm" color="blue.500">
                      Showing {filteredCompanies.length} of {companies.length} companies
                      {filteredCompanies.length !== companies.length && ` (filtered from ${companies.length} total)`}
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={3} py={1}>
                      {filteredCompanies.length} Companies
                    </Badge>
                    {filteredCompanies.length !== companies.length && (
                      <Badge colorScheme="green" variant="subtle" fontSize="sm" px={3} py={1}>
                        {companies.length - filteredCompanies.length} Hidden
                      </Badge>
                    )}
                    <Text fontSize="sm" color="blue.600" fontWeight="medium">
                      Page {currentPage} of {totalPages}
                    </Text>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>

            {/* Companies Table */}
            <Card 
              bg="rgba(59, 130, 246, 0.05)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(59, 130, 246, 0.2)"
              shadow="xl"
              borderRadius="2xl"
              overflow="hidden"
            >
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg="rgba(59, 130, 246, 0.1)" zIndex={1} borderBottom="1px solid" borderColor="rgba(59, 130, 246, 0.2)">
                      <Tr>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Company Name</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Chinese Name</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Industry</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Country</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Status</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Tech</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Related Investors</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Related Funds</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Related Deals</Th>
                        <Th px={3} py={3} fontSize="xs" fontWeight="bold" color="blue.700">Actions</Th>
                      </Tr>
                    </Thead>
                      <Tbody>
                        {paginatedCompanies.map((company) => {
                          // Get related data for this company
                          const { investors: relatedInvestors, funds: relatedFunds, deals: relatedDeals } = getCompanyRelatedData(company.id);
                          
                          return (
                          <Tr key={company.id} _hover={{ bg: 'rgba(59, 130, 246, 0.05)' }} fontSize="xs" borderBottom="1px solid" borderColor="rgba(59, 130, 246, 0.1)" height="80px">
                            <Td px={3} py={3}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium" noOfLines={2}>
                                  {company.companyName}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  ID: {company.id}
                                </Text>
                              </VStack>
                            </Td>
                            <Td px={3} py={3}>
                              <Text fontSize="sm" noOfLines={2}>{company.chineseName || '-'}</Text>
                            </Td>
                            <Td px={3} py={3}>
                              <Badge colorScheme="blue" noOfLines={1}>{company.industry || '-'}</Badge>
                            </Td>
                            <Td px={3} py={3}>
                              <Text fontSize="sm" noOfLines={1}>{company.country || '-'}</Text>
                            </Td>
                            <Td px={3} py={3}>
                              <Badge 
                                colorScheme={
                                  company.listingStatus === 'Listed' ? 'green' : 
                                  company.listingStatus === 'Private' ? 'orange' : 'gray'
                                }
                                noOfLines={1}
                              >
                                {company.listingStatus || '-'}
                              </Badge>
                            </Td>
                            <Td px={3} py={3}>
                              <Badge 
                                colorScheme={company.techCategory ? 'purple' : 'gray'}
                                noOfLines={1}
                              >
                                {company.techCategory ? 'Yes' : 'No'}
                              </Badge>
                            </Td>
                            <Td px={3} py={3}>
                              <VStack align="start" spacing={1} maxH="60px" overflow="hidden">
                                {relatedInvestors.length > 0 ? (
                                  <>
                                    {relatedInvestors.slice(0, 2).map((investor, idx) => (
                                      <Link
                                        key={investor.id}
                                        color="blue.500"
                                        fontSize="xs"
                                        onClick={() => navigateToInvestor(investor.id)}
                                        _hover={{ textDecoration: 'underline' }}
                                        cursor="pointer"
                                        noOfLines={1}
                                      >
                                        {hierarchicalService.getEntityName('investor', investor.id)}
                                      </Link>
                                    ))}
                                    {relatedInvestors.length > 2 && (
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        color="blue.500"
                                        onClick={() => {
                                          setSelectedCompany(company);
                                          onOpen();
                                        }}
                                      >
                                        +{relatedInvestors.length - 2} more
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Text fontSize="xs" color="gray.400">-</Text>
                                )}
                              </VStack>
                            </Td>
                            <Td px={3} py={3}>
                              <VStack align="start" spacing={1} maxH="60px" overflow="hidden">
                                {relatedFunds.length > 0 ? (
                                  <>
                                    {relatedFunds.slice(0, 2).map((fund, idx) => (
                                      <Link
                                        key={fund.id}
                                        color="green.500"
                                        fontSize="xs"
                                        onClick={() => navigateToFund(fund.id)}
                                        _hover={{ textDecoration: 'underline' }}
                                        cursor="pointer"
                                        noOfLines={1}
                                      >
                                        {hierarchicalService.getEntityName('fund', fund.id)}
                                      </Link>
                                    ))}
                                    {relatedFunds.length > 2 && (
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        color="green.500"
                                        onClick={() => {
                                          setSelectedCompany(company);
                                          onOpen();
                                        }}
                                      >
                                        +{relatedFunds.length - 2} more
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Text fontSize="xs" color="gray.400">-</Text>
                                )}
                              </VStack>
                            </Td>
                            <Td px={3} py={3}>
                              <VStack align="start" spacing={1} maxH="60px" overflow="hidden">
                                {relatedDeals.length > 0 ? (
                                  <>
                                    {relatedDeals.slice(0, 2).map((deal, idx) => (
                                      <Link
                                        key={deal.id}
                                        color="purple.500"
                                        fontSize="xs"
                                        onClick={() => navigateToDeal(deal.id)}
                                        _hover={{ textDecoration: 'underline' }}
                                        cursor="pointer"
                                        noOfLines={1}
                                      >
                                        {hierarchicalService.getEntityName('deal', deal.id)}
                                      </Link>
                                    ))}
                                    {relatedDeals.length > 2 && (
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        color="purple.500"
                                        onClick={() => {
                                          setSelectedCompany(company);
                                          onOpen();
                                        }}
                                      >
                                        +{relatedDeals.length - 2} more
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Text fontSize="xs" color="gray.400">-</Text>
                                )}
                              </VStack>
                            </Td>
                            <Td px={3} py={3}>
                              <IconButton
                                size="sm"
                                icon={<Eye />}
                                aria-label="View details"
                                onClick={() => openCompanyDetail(company)}
                                colorScheme="blue"
                                variant="outline"
                              />
                            </Td>
                          </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box 
                    bg="rgba(59, 130, 246, 0.05)"
                    borderTop="1px solid"
                    borderColor="rgba(59, 130, 246, 0.1)"
                    p={4}
                  >
                    <HStack justify="center" spacing={4}>
                      <Button
                        size="md"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                        colorScheme="blue"
                        variant="outline"
                        borderColor="rgba(59, 130, 246, 0.3)"
                        _hover={{ 
                          bg: 'rgba(59, 130, 246, 0.1)',
                          borderColor: 'blue.400'
                        }}
                        borderRadius="xl"
                        px={6}
                      >
                        Previous
                      </Button>
                      
                      <HStack spacing={2} align="center">
                        <Text fontSize="sm" color="blue.600" fontWeight="medium">
                          Page {currentPage} of {totalPages}
                        </Text>
                        <Text fontSize="xs" color="blue.500">
                          ({paginatedCompanies.length} items per page)
                        </Text>
                      </HStack>
                      
                      <Button
                        size="md"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                        colorScheme="blue"
                        variant="outline"
                        borderColor="rgba(59, 130, 246, 0.3)"
                        _hover={{ 
                          bg: 'rgba(59, 130, 246, 0.1)',
                          borderColor: 'blue.400'
                        }}
                        borderRadius="xl"
                        px={6}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Box>
                )}
              </CardBody>
            </Card>

          </VStack>
        </Container>
      </Box>

      {/* Company Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">
                {selectedCompany?.companyName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Company Details & Relationships
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCompany && (
              <VStack spacing={6} align="stretch">
                {/* Basic Company Information */}
                <Card>
                  <CardHeader bg="blue.50">
                    <Heading size="md" color="blue.700">
                      Company Information
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Company Name</Text>
                        <Text>{selectedCompany.companyName}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Chinese Name</Text>
                        <Text>{selectedCompany.chineseName || 'Not provided'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Industry</Text>
                        <Badge colorScheme="blue">{selectedCompany.industry || 'Unknown'}</Badge>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Country</Text>
                        <Text>{selectedCompany.country || 'Unknown'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Listing Status</Text>
                        <Badge 
                          colorScheme={
                            selectedCompany.listingStatus === 'Listed' ? 'green' : 
                            selectedCompany.listingStatus === 'Private' ? 'orange' : 'gray'
                          }
                        >
                          {selectedCompany.listingStatus || 'Unknown'}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="gray.600">Tech Category</Text>
                        <Badge colorScheme={selectedCompany.techCategory ? 'purple' : 'gray'}>
                          {selectedCompany.techCategory ? 'Yes' : 'No'}
                        </Badge>
                      </Box>
                    </Grid>
                    
                    {/* Contact Information */}
                    <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.200">
                      <Text fontWeight="bold" color="gray.700" mb={3}>Contact Information</Text>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <Text fontWeight="bold" color="gray.600">Email</Text>
                          <Text>{selectedCompany.email || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="gray.600">Website</Text>
                          {selectedCompany.website ? (
                            <Link color="blue.500" href={selectedCompany.website} isExternal>
                              {selectedCompany.website} <ExternalLink size={14} />
                            </Link>
                          ) : (
                            <Text>Not provided</Text>
                          )}
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="gray.600">Phone</Text>
                          <Text>{selectedCompany.tel || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="gray.600">Fax</Text>
                          <Text>{selectedCompany.fax || 'Not provided'}</Text>
                        </Box>
                      </Grid>
                    </Box>
                  </CardBody>
                </Card>

                {/* Related Investors */}
                <Card>
                  <CardHeader bg="green.50">
                    <Heading size="md" color="green.700">
                      Related Investors ({hierarchicalService.getCompanyRelatedInvestors(selectedCompany.id)?.length || 0})
                    </Heading>
                    <Text fontSize="sm" color="green.600">
                      All investors who have invested in this company
                    </Text>
                  </CardHeader>
                  <CardBody>
                    {hierarchicalService.getCompanyRelatedInvestors(selectedCompany.id)?.length > 0 ? (
                      <VStack align="stretch" spacing={3}>
                        {hierarchicalService.getCompanyRelatedInvestors(selectedCompany.id).map((investor, idx) => (
                          <HStack key={investor.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" spacing={1} flex={1}>
                              <Link
                                color="blue.500"
                                fontWeight="medium"
                                onClick={() => {
                                  onClose();
                                  navigateToInvestor(investor.id);
                                }}
                                _hover={{ textDecoration: 'underline' }}
                                cursor="pointer"
                              >
                                {hierarchicalService.getEntityName('investor', investor.id)}
                              </Link>
                              <HStack spacing={4} fontSize="xs" color="gray.500">
                                <Text>ID: {investor.id}</Text>
                                {investor.firmCategory && (
                                  <Badge size="sm" colorScheme="blue">{investor.firmCategory}</Badge>
                                )}
                                {investor.firmLocation && (
                                  <Text>📍 {investor.firmLocation}</Text>
                                )}
                              </HStack>
                            </VStack>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => {
                                onClose();
                                navigateToInvestor(investor.id);
                              }}
                            >
                              View Details
                            </Button>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500">No related investors found.</Text>
                    )}
                  </CardBody>
                </Card>

                {/* Related Funds */}
                <Card>
                  <CardHeader bg="purple.50">
                    <Heading size="md" color="purple.700">
                      Related Funds ({hierarchicalService.getCompanyRelatedFunds(selectedCompany.id)?.length || 0})
                    </Heading>
                    <Text fontSize="sm" color="purple.600">
                      All funds that have invested in this company
                    </Text>
                  </CardHeader>
                  <CardBody>
                    {hierarchicalService.getCompanyRelatedFunds(selectedCompany.id)?.length > 0 ? (
                      <VStack align="stretch" spacing={3}>
                        {hierarchicalService.getCompanyRelatedFunds(selectedCompany.id).map((fund, idx) => (
                          <HStack key={fund.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" spacing={1} flex={1}>
                              <Link
                                color="green.500"
                                fontWeight="medium"
                                onClick={() => {
                                  onClose();
                                  navigateToFund(fund.id);
                                }}
                                _hover={{ textDecoration: 'underline' }}
                                cursor="pointer"
                              >
                                {hierarchicalService.getEntityName('fund', fund.id)}
                              </Link>
                              <HStack spacing={4} fontSize="xs" color="gray.500">
                                <Text>ID: {fund.id}</Text>
                                {fund.category && (
                                  <Badge size="sm" colorScheme="green">{fund.category}</Badge>
                                )}
                                {fund.country && (
                                  <Text>📍 {fund.country}</Text>
                                )}
                              </HStack>
                            </VStack>
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              onClick={() => {
                                onClose();
                                navigateToFund(fund.id);
                              }}
                            >
                              View Details
                            </Button>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500">No related funds found.</Text>
                    )}
                  </CardBody>
                </Card>

                {/* Related Deals */}
                <Card>
                  <CardHeader bg="orange.50">
                    <Heading size="md" color="orange.700">
                      Related Deals ({hierarchicalService.getCompanyDeals(selectedCompany.id)?.length || 0})
                    </Heading>
                    <Text fontSize="sm" color="orange.600">
                      All investment deals involving this company
                    </Text>
                  </CardHeader>
                  <CardBody>
                    {hierarchicalService.getCompanyDeals(selectedCompany.id)?.length > 0 ? (
                      <VStack align="stretch" spacing={3}>
                        {hierarchicalService.getCompanyDeals(selectedCompany.id).map((deal, idx) => (
                          <HStack key={deal.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" spacing={1} flex={1}>
                              <Link
                                color="purple.500"
                                fontWeight="medium"
                                onClick={() => {
                                  onClose();
                                  navigateToDeal(deal.id);
                                }}
                                _hover={{ textDecoration: 'underline' }}
                                cursor="pointer"
                              >
                                {hierarchicalService.getEntityName('deal', deal.id)}
                              </Link>
                              <HStack spacing={4} fontSize="xs" color="gray.500">
                                <Text>ID: {deal.id}</Text>
                                {deal.fundingRound && (
                                  <Badge size="sm" colorScheme="purple">{deal.fundingRound}</Badge>
                                )}
                                {deal.stage && (
                                  <Badge size="sm" colorScheme="orange">{deal.stage}</Badge>
                                )}
                                {deal.date && (
                                  <Text>📅 {deal.date}</Text>
                                )}
                              </HStack>
                            </VStack>
                            <Button
                              size="sm"
                              colorScheme="purple"
                              variant="outline"
                              onClick={() => {
                                onClose();
                                navigateToDeal(deal.id);
                              }}
                            >
                              View Details
                            </Button>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500">No related deals found.</Text>
                    )}
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Companies;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Badge,
  Divider,
  Grid,
  GridItem,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Flex,
  Select,
  Button,
  Circle
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Instagram,
  Twitter,
  MessageSquare,
  Video,
  Calendar,
  Eye,
  Heart,
  Share2,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  CreditCard,
  Building,
  Wifi,
  Car,
  Monitor,
  Briefcase,
  PiggyBank,
  Sparkles,
  Receipt,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useDatabase } from '../contexts/DatabaseContext';
import AIDataChat from './AIDataChat';

const MotionBox = motion(Box);

// Dummy data
const revenueData = [
  { month: 'Jan', revenue: 125000, expenses: 85000, profit: 40000 },
  { month: 'Feb', revenue: 142000, expenses: 92000, profit: 50000 },
  { month: 'Mar', revenue: 168000, expenses: 98000, profit: 70000 },
  { month: 'Apr', revenue: 195000, expenses: 105000, profit: 90000 },
  { month: 'May', revenue: 215000, expenses: 112000, profit: 103000 },
  { month: 'Jun', revenue: 242000, expenses: 125000, profit: 117000 }
];

const campaignPerformance = [
  { month: 'Jan', impressions: 1250000, engagement: 85000, conversions: 4200 },
  { month: 'Feb', impressions: 1420000, engagement: 102000, conversions: 5100 },
  { month: 'Mar', impressions: 1680000, engagement: 125000, conversions: 6800 },
  { month: 'Apr', impressions: 1950000, engagement: 145000, conversions: 7900 },
  { month: 'May', impressions: 2150000, engagement: 168000, conversions: 9200 },
  { month: 'Jun', impressions: 2420000, engagement: 195000, conversions: 10500 }
];

const topKOLs = [
  { id: 1, name: 'Sarah Johnson', platform: 'Instagram', followers: '2.5M', engagement: '8.5%', revenue: '$45,000', campaigns: 12, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Mike Chen', platform: 'Twitter', followers: '1.8M', engagement: '7.2%', revenue: '$38,500', campaigns: 10, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Emma Davis', platform: 'Instagram', followers: '3.2M', engagement: '9.1%', revenue: '$52,000', campaigns: 15, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Alex Rivera', platform: 'YouTube', followers: '980K', engagement: '6.8%', revenue: '$32,000', campaigns: 8, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Priya Patel', platform: 'TikTok', followers: '4.1M', engagement: '12.3%', revenue: '$65,000', campaigns: 18, avatar: 'https://i.pravatar.cc/150?img=5' }
];

const platformDistribution = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'Twitter', value: 25, color: '#1DA1F2' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'TikTok', value: 15, color: '#000000' },
  { name: 'Others', value: 5, color: '#718096' }
];

const audienceDemographics = [
  { age: '18-24', male: 45, female: 55 },
  { age: '25-34', male: 38, female: 62 },
  { age: '35-44', male: 48, female: 52 },
  { age: '45-54', male: 42, female: 58 },
  { age: '55+', male: 50, female: 50 }
];

const recentCampaigns = [
  { id: 1, name: 'Summer Collection Launch', kols: 8, budget: '$125,000', roi: '3.2x', status: 'Active', completion: 75 },
  { id: 2, name: 'Holiday Gift Guide', kols: 12, budget: '$85,000', roi: '2.8x', status: 'Active', completion: 60 },
  { id: 3, name: 'Brand Awareness Q2', kols: 15, budget: '$200,000', roi: '4.1x', status: 'Completed', completion: 100 },
  { id: 4, name: 'Product Review Series', kols: 6, budget: '$45,000', roi: '2.5x', status: 'Active', completion: 40 },
  { id: 5, name: 'Influencer Takeover', kols: 10, budget: '$95,000', roi: '3.7x', status: 'Planning', completion: 20 }
];

const engagementTrends = [
  { date: 'Week 1', likes: 125000, comments: 8500, shares: 4200, saves: 12000 },
  { date: 'Week 2', likes: 142000, comments: 9200, shares: 4800, saves: 14500 },
  { date: 'Week 3', likes: 168000, comments: 11000, shares: 5600, saves: 16800 },
  { date: 'Week 4', likes: 195000, comments: 13500, shares: 6800, saves: 19500 }
];

const Analytics = () => {
  const { kols } = useDatabase();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [tabIndex, setTabIndex] = useState(0);

  // Calculate stats from dummy data
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgEngagementRate = 8.5;
  const totalCampaigns = recentCampaigns.length;

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={8}
        >
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Circle size="50px" bg="blue.500" color="white">
                  <Icon as={BarChart3} boxSize={6} />
                </Circle>
                <VStack align="start" spacing={0}>
                  <Heading size="lg" color="gray.800">Analytics Dashboard</Heading>
                  <Text color="gray.600" fontSize="sm">Track your KOL campaign performance</Text>
                </VStack>
              </HStack>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                w="200px"
                bg="white"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </Select>
            </HStack>
          </VStack>
        </MotionBox>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card bg="white" shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel color="gray.600" fontSize="sm">Total Revenue</StatLabel>
                    <Circle size="40px" bg="green.50">
                      <Icon as={DollarSign} color="green.500" boxSize={5} />
                    </Circle>
                  </HStack>
                  <StatNumber fontSize="2xl" color="gray.800">
                    ${(totalRevenue / 1000).toFixed(0)}K
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.5% from last period
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card bg="white" shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel color="gray.600" fontSize="sm">Active KOLs</StatLabel>
                    <Circle size="40px" bg="purple.50">
                      <Icon as={Users} color="purple.500" boxSize={5} />
                    </Circle>
                  </HStack>
                  <StatNumber fontSize="2xl" color="gray.800">{kols.length || 156}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12 new this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card bg="white" shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel color="gray.600" fontSize="sm">Avg Engagement</StatLabel>
                    <Circle size="40px" bg="orange.50">
                      <Icon as={TrendingUp} color="orange.500" boxSize={5} />
                    </Circle>
                  </HStack>
                  <StatNumber fontSize="2xl" color="gray.800">{avgEngagementRate}%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    1.2% from last period
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card bg="white" shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel color="gray.600" fontSize="sm">Total Profit</StatLabel>
                    <Circle size="40px" bg="blue.50">
                      <Icon as={Target} color="blue.500" boxSize={5} />
                    </Circle>
                  </HStack>
                  <StatNumber fontSize="2xl" color="gray.800">
                    ${(totalProfit / 1000).toFixed(0)}K
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    18.7% from last period
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>
        </SimpleGrid>

        {/* Tabs */}
        <Card bg="white" shadow="sm">
          <CardBody>
            <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="blue">
              <TabList borderColor="gray.200">
                <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600', fontWeight: 'semibold' }}>
                  <Icon as={BarChart3} mr={2} />
                  Overview
                </Tab>
                <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600', fontWeight: 'semibold' }}>
                  <Icon as={Users} mr={2} />
                  KOL Performance
                </Tab>
                <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600', fontWeight: 'semibold' }}>
                  <Icon as={Target} mr={2} />
                  Campaigns
                </Tab>
                <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600', fontWeight: 'semibold' }}>
                  <Icon as={Eye} mr={2} />
                  Engagement
                </Tab>
                <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600', fontWeight: 'semibold' }}>
                  <Icon as={MessageSquare} mr={2} />
                  AI Chat
                </Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4} color="gray.700">Revenue & Profit Trends</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3182CE" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38A169" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#38A169" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stroke="#3182CE" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="profit" stroke="#38A169" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>

                    <Divider />

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Box>
                        <Heading size="md" mb={4} color="gray.700">Platform Distribution</Heading>
                        <Box h="250px">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={platformDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {platformDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </Box>

                      <Box>
                        <Heading size="md" mb={4} color="gray.700">Campaign Performance</Heading>
                        <VStack spacing={3} align="stretch">
                          {recentCampaigns.slice(0, 3).map((campaign) => (
                            <Box key={campaign.id} p={3} bg="gray.50" borderRadius="md">
                              <HStack justify="space-between" mb={2}>
                                <Text fontWeight="medium" fontSize="sm">{campaign.name}</Text>
                                <Badge colorScheme={campaign.status === 'Active' ? 'green' : campaign.status === 'Completed' ? 'blue' : 'gray'}>
                                  {campaign.status}
                                </Badge>
                              </HStack>
                              <Progress value={campaign.completion} size="sm" colorScheme="blue" borderRadius="full" />
                              <HStack justify="space-between" mt={2}>
                                <Text fontSize="xs" color="gray.600">{campaign.kols} KOLs • {campaign.budget}</Text>
                                <Text fontSize="xs" fontWeight="bold" color="green.600">ROI: {campaign.roi}</Text>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                {/* KOL Performance Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color="gray.700">Top Performing KOLs</Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>KOL</Th>
                          <Th>Platform</Th>
                          <Th isNumeric>Followers</Th>
                          <Th isNumeric>Engagement</Th>
                          <Th isNumeric>Campaigns</Th>
                          <Th isNumeric>Revenue</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {topKOLs.map((kol) => (
                          <Tr key={kol.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <HStack>
                                <Avatar size="sm" src={kol.avatar} name={kol.name} />
                                <Text fontWeight="medium">{kol.name}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge colorScheme={
                                kol.platform === 'Instagram' ? 'pink' :
                                kol.platform === 'Twitter' ? 'blue' :
                                kol.platform === 'YouTube' ? 'red' : 'gray'
                              }>
                                {kol.platform}
                              </Badge>
                            </Td>
                            <Td isNumeric>{kol.followers}</Td>
                            <Td isNumeric>
                              <Badge colorScheme="green">{kol.engagement}</Badge>
                            </Td>
                            <Td isNumeric>{kol.campaigns}</Td>
                            <Td isNumeric fontWeight="bold" color="green.600">{kol.revenue}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    <Divider />

                    <Box>
                      <Heading size="md" mb={4} color="gray.700">Audience Demographics</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={audienceDemographics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="age" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="male" fill="#3182CE" name="Male" />
                            <Bar dataKey="female" fill="#D53F8C" name="Female" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Campaigns Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="md" color="gray.700">Active Campaigns</Heading>
                      <Button colorScheme="blue" size="sm" leftIcon={<Target />}>
                        New Campaign
                      </Button>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {recentCampaigns.map((campaign) => (
                        <Card key={campaign.id} variant="outline" _hover={{ shadow: 'md' }} transition="all 0.2s">
                          <CardBody>
                            <VStack align="stretch" spacing={3}>
                              <HStack justify="space-between">
                                <Text fontWeight="bold" fontSize="lg">{campaign.name}</Text>
                                <Badge colorScheme={campaign.status === 'Active' ? 'green' : campaign.status === 'Completed' ? 'blue' : 'gray'}>
                                  {campaign.status}
                                </Badge>
                              </HStack>
                              <Progress value={campaign.completion} size="sm" colorScheme="blue" borderRadius="full" />
                              <SimpleGrid columns={2} spacing={2}>
                                <Box>
                                  <Text fontSize="xs" color="gray.600">KOLs</Text>
                                  <Text fontWeight="bold">{campaign.kols}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.600">Budget</Text>
                                  <Text fontWeight="bold">{campaign.budget}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.600">ROI</Text>
                                  <Text fontWeight="bold" color="green.600">{campaign.roi}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.600">Progress</Text>
                                  <Text fontWeight="bold">{campaign.completion}%</Text>
                                </Box>
                              </SimpleGrid>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>

                    <Divider />

                    <Box>
                      <Heading size="md" mb={4} color="gray.700">Campaign Metrics</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={campaignPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="impressions" stroke="#3182CE" strokeWidth={2} />
                            <Line type="monotone" dataKey="engagement" stroke="#805AD5" strokeWidth={2} />
                            <Line type="monotone" dataKey="conversions" stroke="#38A169" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Engagement Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color="gray.700">Engagement Trends</Heading>
                    
                    <Box h="350px">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={engagementTrends}>
                          <defs>
                            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#E53E3E" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3182CE" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#38A169" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#38A169" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#718096" />
                          <YAxis stroke="#718096" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="likes" stroke="#E53E3E" strokeWidth={2} fillOpacity={1} fill="url(#colorLikes)" />
                          <Area type="monotone" dataKey="comments" stroke="#3182CE" strokeWidth={2} fillOpacity={1} fill="url(#colorComments)" />
                          <Area type="monotone" dataKey="shares" stroke="#38A169" strokeWidth={2} fillOpacity={1} fill="url(#colorShares)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>

                    <Divider />

                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={2}>
                            <Circle size="50px" bg="red.50">
                              <Icon as={Heart} color="red.500" boxSize={6} />
                            </Circle>
                            <Text fontSize="2xl" fontWeight="bold">630K</Text>
                            <Text fontSize="sm" color="gray.600">Total Likes</Text>
                            <Badge colorScheme="green">
                              <HStack spacing={1}>
                                <ArrowUpRight size={12} />
                                <Text>24.5%</Text>
                              </HStack>
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={2}>
                            <Circle size="50px" bg="blue.50">
                              <Icon as={MessageSquare} color="blue.500" boxSize={6} />
                            </Circle>
                            <Text fontSize="2xl" fontWeight="bold">42.2K</Text>
                            <Text fontSize="sm" color="gray.600">Total Comments</Text>
                            <Badge colorScheme="green">
                              <HStack spacing={1}>
                                <ArrowUpRight size={12} />
                                <Text>18.2%</Text>
                              </HStack>
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={2}>
                            <Circle size="50px" bg="green.50">
                              <Icon as={Share2} color="green.500" boxSize={6} />
                            </Circle>
                            <Text fontSize="2xl" fontWeight="bold">21.4K</Text>
                            <Text fontSize="sm" color="gray.600">Total Shares</Text>
                            <Badge colorScheme="green">
                              <HStack spacing={1}>
                                <ArrowUpRight size={12} />
                                <Text>32.1%</Text>
                              </HStack>
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={2}>
                            <Circle size="50px" bg="purple.50">
                              <Icon as={Eye} color="purple.500" boxSize={6} />
                            </Circle>
                            <Text fontSize="2xl" fontWeight="bold">62.8K</Text>
                            <Text fontSize="sm" color="gray.600">Total Saves</Text>
                            <Badge colorScheme="green">
                              <HStack spacing={1}>
                                <ArrowUpRight size={12} />
                                <Text>28.7%</Text>
                              </HStack>
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                {/* AI Chat Tab */}
                <TabPanel>
                  <AIDataChat />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Analytics;

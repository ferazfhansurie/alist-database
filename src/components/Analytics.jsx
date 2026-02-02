import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Icon,
  Circle,
  Badge,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  DollarSign,
  Users,
  Target,
  Building2,
  Receipt,
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
} from 'lucide-react';

const MotionBox = motion(Box);

// ========== MONTHLY OPERATIONAL EXPENSES DATA ==========
const monthlyOperationalExpenses = [
  {
    month: 'Jan',
    adSpend: 45000,
    salaries: 85000,
    kolPayments: 120000,
    office: 12000,
    software: 8500,
    production: 25000,
    travel: 6000,
    utilities: 3500,
    marketing: 15000,
    misc: 5000,
    total: 325000,
  },
  {
    month: 'Feb',
    adSpend: 52000,
    salaries: 85000,
    kolPayments: 135000,
    office: 12000,
    software: 8500,
    production: 28000,
    travel: 8000,
    utilities: 3500,
    marketing: 18000,
    misc: 4500,
    total: 354500,
  },
  {
    month: 'Mar',
    adSpend: 68000,
    salaries: 88000,
    kolPayments: 155000,
    office: 12000,
    software: 9000,
    production: 32000,
    travel: 12000,
    utilities: 3800,
    marketing: 22000,
    misc: 6200,
    total: 408000,
  },
  {
    month: 'Apr',
    adSpend: 55000,
    salaries: 88000,
    kolPayments: 142000,
    office: 12000,
    software: 9000,
    production: 30000,
    travel: 9500,
    utilities: 3800,
    marketing: 19000,
    misc: 5700,
    total: 374000,
  },
  {
    month: 'May',
    adSpend: 72000,
    salaries: 92000,
    kolPayments: 168000,
    office: 12500,
    software: 9500,
    production: 35000,
    travel: 14000,
    utilities: 4000,
    marketing: 25000,
    misc: 7000,
    total: 439000,
  },
  {
    month: 'Jun',
    adSpend: 85000,
    salaries: 92000,
    kolPayments: 185000,
    office: 12500,
    software: 9500,
    production: 38000,
    travel: 16000,
    utilities: 4200,
    marketing: 28000,
    misc: 7800,
    total: 478000,
  },
  {
    month: 'Jul',
    adSpend: 78000,
    salaries: 95000,
    kolPayments: 175000,
    office: 13000,
    software: 10000,
    production: 36000,
    travel: 15000,
    utilities: 4500,
    marketing: 26000,
    misc: 6500,
    total: 459000,
  },
  {
    month: 'Aug',
    adSpend: 92000,
    salaries: 95000,
    kolPayments: 195000,
    office: 13000,
    software: 10000,
    production: 42000,
    travel: 18000,
    utilities: 4500,
    marketing: 32000,
    misc: 8500,
    total: 510000,
  },
  {
    month: 'Sep',
    adSpend: 105000,
    salaries: 98000,
    kolPayments: 215000,
    office: 13500,
    software: 10500,
    production: 45000,
    travel: 20000,
    utilities: 4800,
    marketing: 35000,
    misc: 9200,
    total: 556000,
  },
  {
    month: 'Oct',
    adSpend: 118000,
    salaries: 98000,
    kolPayments: 235000,
    office: 13500,
    software: 10500,
    production: 48000,
    travel: 22000,
    utilities: 4800,
    marketing: 38000,
    misc: 10200,
    total: 598000,
  },
  {
    month: 'Nov',
    adSpend: 125000,
    salaries: 102000,
    kolPayments: 255000,
    office: 14000,
    software: 11000,
    production: 52000,
    travel: 25000,
    utilities: 5000,
    marketing: 42000,
    misc: 11000,
    total: 642000,
  },
  {
    month: 'Dec',
    adSpend: 145000,
    salaries: 102000,
    kolPayments: 285000,
    office: 14000,
    software: 11000,
    production: 58000,
    travel: 28000,
    utilities: 5200,
    marketing: 48000,
    misc: 12800,
    total: 709000,
  },
];

// ========== EMPLOYEE COST BREAKDOWN ==========
const employeeCostsByDepartment = [
  { department: 'Account Management', headcount: 8, monthlyCost: 32000, avgSalary: 4000 },
  { department: 'Creative & Content', headcount: 6, monthlyCost: 27000, avgSalary: 4500 },
  { department: 'KOL Relations', headcount: 5, monthlyCost: 22500, avgSalary: 4500 },
  { department: 'Production & Video', headcount: 4, monthlyCost: 18000, avgSalary: 4500 },
  { department: 'Sales & BD', headcount: 4, monthlyCost: 20000, avgSalary: 5000 },
  { department: 'Finance & Admin', headcount: 3, monthlyCost: 10500, avgSalary: 3500 },
  { department: 'Management', headcount: 2, monthlyCost: 15000, avgSalary: 7500 },
];

// ========== AD SPEND BY PLATFORM ==========
const adSpendByPlatform = [
  { platform: 'Meta (FB/IG)', spend: 420000, percentage: 42, campaigns: 85, cpm: 12.5, color: '#1877F2' },
  { platform: 'TikTok Ads', spend: 280000, percentage: 28, campaigns: 62, cpm: 8.2, color: '#000000' },
  { platform: 'Google Ads', spend: 150000, percentage: 15, campaigns: 35, cpm: 15.8, color: '#4285F4' },
  { platform: 'YouTube Ads', spend: 85000, percentage: 8.5, campaigns: 22, cpm: 18.5, color: '#FF0000' },
  { platform: 'Twitter/X Ads', spend: 45000, percentage: 4.5, campaigns: 15, cpm: 22.0, color: '#1DA1F2' },
  { platform: 'LinkedIn Ads', spend: 20000, percentage: 2, campaigns: 8, cpm: 35.0, color: '#0A66C2' },
];

// ========== MONTHLY REVENUE VS EXPENSES ==========
const monthlyPL = [
  { month: 'Jan', revenue: 425000, expenses: 325000, profit: 100000, margin: 23.5 },
  { month: 'Feb', revenue: 468000, expenses: 354500, profit: 113500, margin: 24.3 },
  { month: 'Mar', revenue: 545000, expenses: 408000, profit: 137000, margin: 25.1 },
  { month: 'Apr', revenue: 498000, expenses: 374000, profit: 124000, margin: 24.9 },
  { month: 'May', revenue: 585000, expenses: 439000, profit: 146000, margin: 25.0 },
  { month: 'Jun', revenue: 642000, expenses: 478000, profit: 164000, margin: 25.5 },
  { month: 'Jul', revenue: 612000, expenses: 459000, profit: 153000, margin: 25.0 },
  { month: 'Aug', revenue: 695000, expenses: 510000, profit: 185000, margin: 26.6 },
  { month: 'Sep', revenue: 758000, expenses: 556000, profit: 202000, margin: 26.6 },
  { month: 'Oct', revenue: 825000, expenses: 598000, profit: 227000, margin: 27.5 },
  { month: 'Nov', revenue: 892000, expenses: 642000, profit: 250000, margin: 28.0 },
  { month: 'Dec', revenue: 985000, expenses: 709000, profit: 276000, margin: 28.0 },
];

// ========== FIXED VS VARIABLE COSTS ==========
const fixedVsVariableCosts = [
  { category: 'Fixed Costs', items: [
    { name: 'Office Rent', monthly: 14000, annual: 168000 },
    { name: 'Staff Salaries (Base)', monthly: 85000, annual: 1020000 },
    { name: 'Software Subscriptions', monthly: 10500, annual: 126000 },
    { name: 'Insurance', monthly: 2500, annual: 30000 },
    { name: 'Utilities (Base)', monthly: 3000, annual: 36000 },
  ]},
  { category: 'Variable Costs', items: [
    { name: 'KOL Payments', monthly: 195000, annual: 2340000 },
    { name: 'Ad Spend (Client)', monthly: 95000, annual: 1140000 },
    { name: 'Production Costs', monthly: 38000, annual: 456000 },
    { name: 'Travel & Entertainment', monthly: 16000, annual: 192000 },
    { name: 'Commissions & Bonuses', monthly: 12000, annual: 144000 },
  ]},
];

// ========== CLIENT BILLING & RECEIVABLES ==========
const clientBilling = [
  { client: 'L\'Oreal Malaysia', billed: 185000, collected: 165000, outstanding: 20000, status: 'Current' },
  { client: 'Shopee Malaysia', billed: 245000, collected: 125000, outstanding: 120000, status: 'Overdue' },
  { client: 'Grab Malaysia', billed: 320000, collected: 280000, outstanding: 40000, status: 'Current' },
  { client: 'Samsung Malaysia', billed: 195000, collected: 195000, outstanding: 0, status: 'Paid' },
  { client: 'Uniqlo Malaysia', billed: 145000, collected: 80000, outstanding: 65000, status: 'Overdue' },
  { client: 'Petronas', billed: 280000, collected: 180000, outstanding: 100000, status: 'Current' },
  { client: 'Maybank', billed: 125000, collected: 45000, outstanding: 80000, status: 'Current' },
  { client: 'Watsons Malaysia', billed: 98000, collected: 53000, outstanding: 45000, status: 'Current' },
];

// ========== EXPENSE CATEGORIES SUMMARY ==========
const expenseCategorySummary = [
  { category: 'KOL Payments', amount: 2265000, percentage: 40.2, icon: Users, color: '#E4405F', trend: '+18%' },
  { category: 'Staff Costs', amount: 1140000, percentage: 20.2, icon: Briefcase, color: '#3182CE', trend: '+8%' },
  { category: 'Ad Spend', amount: 1000000, percentage: 17.7, icon: Megaphone, color: '#805AD5', trend: '+35%' },
  { category: 'Production', amount: 469000, percentage: 8.3, icon: Monitor, color: '#38A169', trend: '+22%' },
  { category: 'Marketing', amount: 348000, percentage: 6.2, icon: Target, color: '#D69E2E', trend: '+15%' },
  { category: 'Travel', amount: 193500, percentage: 3.4, icon: Car, color: '#DD6B20', trend: '+28%' },
  { category: 'Office & Rent', amount: 156000, percentage: 2.8, icon: Building, color: '#718096', trend: '+5%' },
  { category: 'Software & Tech', amount: 117500, percentage: 2.1, icon: Wifi, color: '#00B5D8', trend: '+12%' },
];

// ========== PENDING KOL PAYMENTS ==========
const pendingKOLPayments = [
  { kol: 'Neelofa', platform: 'Instagram', amount: 45000, campaign: 'Sephora Holiday', dueDate: '2024-02-10' },
  { kol: 'Khairul Aming', platform: 'TikTok', amount: 35000, campaign: 'Grab Food', dueDate: '2024-02-05' },
  { kol: 'Vivy Yusof', platform: 'Instagram', amount: 38000, campaign: 'Fashion Valet', dueDate: '2024-02-15' },
  { kol: 'Harith Iskander', platform: 'YouTube', amount: 28000, campaign: 'Petronas', dueDate: '2024-02-08' },
  { kol: 'Jane Chuck', platform: 'Instagram', amount: 22000, campaign: 'L\'Oreal', dueDate: '2024-02-12' },
  { kol: 'Jinnyboy', platform: 'YouTube', amount: 32000, campaign: 'Samsung', dueDate: '2024-02-20' },
];

// ========== REVENUE BY CLIENT INDUSTRY ==========
const revenueByIndustry = [
  { industry: 'Beauty & Skincare', revenue: 1850000, percentage: 24 },
  { industry: 'E-Commerce', revenue: 1540000, percentage: 20 },
  { industry: 'F&B', revenue: 1155000, percentage: 15 },
  { industry: 'Fashion & Retail', revenue: 925000, percentage: 12 },
  { industry: 'Technology', revenue: 770000, percentage: 10 },
  { industry: 'Automotive', revenue: 616000, percentage: 8 },
  { industry: 'Finance & Banking', revenue: 462000, percentage: 6 },
  { industry: 'Others', revenue: 385000, percentage: 5 },
];

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Access control - only azri@thealist.my can access this page
  useEffect(() => {
    if (user?.email !== 'azri@thealist.my') {
      navigate('/');
    }
  }, [user, navigate]);

  // If not authorized, don't render anything
  if (user?.email !== 'azri@thealist.my') {
    return null;
  }

  // Calculate totals
  const totalRevenue = monthlyPL.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyPL.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = monthlyPL.reduce((sum, m) => sum + m.profit, 0);
  const totalAdSpend = adSpendByPlatform.reduce((sum, p) => sum + p.spend, 0);
  const totalSalaries = employeeCostsByDepartment.reduce((sum, d) => sum + (d.monthlyCost * 12), 0);
  const totalHeadcount = employeeCostsByDepartment.reduce((sum, d) => sum + d.headcount, 0);

  const kpiCards = [
    {
      label: 'Total Revenue (YTD)',
      value: `RM ${(totalRevenue / 1000000).toFixed(2)}M`,
      change: '+28.5%',
      isPositive: true,
      icon: DollarSign,
      bgGradient: 'linear(to-br, green.50, emerald.100)',
      gradient: 'linear(to-br, green.400, emerald.600)',
      description: 'vs last year',
    },
    {
      label: 'Total Expenses (YTD)',
      value: `RM ${(totalExpenses / 1000000).toFixed(2)}M`,
      change: '+22.3%',
      isPositive: false,
      icon: CreditCard,
      bgGradient: 'linear(to-br, red.50, orange.100)',
      gradient: 'linear(to-br, red.400, orange.600)',
      description: 'Operational costs',
    },
    {
      label: 'Net Profit (YTD)',
      value: `RM ${(totalProfit / 1000000).toFixed(2)}M`,
      change: '+35.2%',
      isPositive: true,
      icon: PiggyBank,
      bgGradient: 'linear(to-br, blue.50, cyan.100)',
      gradient: 'linear(to-br, blue.400, cyan.600)',
      description: '26.5% margin',
    },
    {
      label: 'Ad Spend (YTD)',
      value: `RM ${(totalAdSpend / 1000000).toFixed(2)}M`,
      change: '+35%',
      isPositive: true,
      icon: Megaphone,
      bgGradient: 'linear(to-br, purple.50, pink.100)',
      gradient: 'linear(to-br, purple.400, pink.600)',
      description: 'Across platforms',
    },
    {
      label: 'Staff Costs (Annual)',
      value: `RM ${(totalSalaries / 1000000).toFixed(2)}M`,
      change: '+8%',
      isPositive: false,
      icon: Users,
      bgGradient: 'linear(to-br, orange.50, yellow.100)',
      gradient: 'linear(to-br, orange.400, yellow.600)',
      description: `${totalHeadcount} employees`,
    },
    {
      label: 'Outstanding AR',
      value: 'RM 470K',
      change: '-15%',
      isPositive: true,
      icon: Receipt,
      bgGradient: 'linear(to-br, teal.50, cyan.100)',
      gradient: 'linear(to-br, teal.400, cyan.600)',
      description: '45 days avg',
    },
  ];

  const departmentTabs = [
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'campaigns', label: 'Campaigns', icon: Target, disabled: true },
    { id: 'kol', label: 'KOL Management', icon: Users, disabled: true },
    { id: 'clients', label: 'Clients', icon: Building2, disabled: true },
  ];

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, blue.50, purple.50)"
      py={{ base: 4, md: 6 }}
      px={{ base: 2, md: 4 }}
    >
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color="gray.800">
                  Analytics Dashboard
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Financial overview for THE A-LIST Malaysia
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Select
                  size="sm"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  bg="white"
                  borderRadius="lg"
                  w="120px"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="Q4">Q4 2024</option>
                  <option value="Q3">Q3 2024</option>
                </Select>
              </HStack>
            </Flex>

            {/* Department Tabs */}
            <Box bg="white" borderRadius="xl" p={1} boxShadow="sm">
              <Tabs variant="soft-rounded" colorScheme="red" index={0}>
                <TabList>
                  {departmentTabs.map((dept) => (
                    <Tab
                      key={dept.id}
                      isDisabled={dept.disabled}
                      _selected={{ bg: 'red.500', color: 'white' }}
                      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                      fontSize="sm"
                      fontWeight="600"
                    >
                      <HStack spacing={2}>
                        <Icon as={dept.icon} boxSize={4} />
                        <Text display={{ base: 'none', md: 'block' }}>{dept.label}</Text>
                      </HStack>
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  {/* Finance Dashboard */}
                  <TabPanel px={0} pt={6}>
                    <VStack spacing={6} align="stretch">
                      {/* KPI Cards */}
                      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                        {kpiCards.map((kpi, index) => (
                          <MotionBox
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <Box
                              bgGradient={kpi.bgGradient}
                              border="2px solid white"
                              borderRadius="xl"
                              p={4}
                              boxShadow="sm"
                              transition="all 0.3s"
                              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                            >
                              <VStack spacing={2} align="start">
                                <Flex justify="space-between" w="full" align="center">
                                  <Circle size="36px" bgGradient={kpi.gradient} color="white">
                                    <Icon as={kpi.icon} boxSize={4} />
                                  </Circle>
                                  <Badge
                                    colorScheme={kpi.isPositive ? 'green' : 'red'}
                                    variant="subtle"
                                    fontSize="xs"
                                    px={2}
                                    borderRadius="full"
                                  >
                                    <HStack spacing={1}>
                                      <Icon as={kpi.isPositive ? ArrowUpRight : ArrowDownRight} boxSize={3} />
                                      <Text>{kpi.change}</Text>
                                    </HStack>
                                  </Badge>
                                </Flex>
                                <Text fontSize="xs" color="gray.500" fontWeight="500">{kpi.label}</Text>
                                <Text fontSize="lg" fontWeight="700" color="gray.800">{kpi.value}</Text>
                                <Text fontSize="xs" color="gray.400">{kpi.description}</Text>
                              </VStack>
                            </Box>
                          </MotionBox>
                        ))}
                      </SimpleGrid>

                      {/* Monthly P&L Chart */}
                      <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <Text fontSize="md" fontWeight="600" color="gray.700" mb={4}>
                          Monthly Revenue vs Expenses
                        </Text>
                        <Box h="300px">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={monthlyPL}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                              <Tooltip
                                formatter={(value) => [`RM ${value.toLocaleString()}`, '']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              />
                              <Legend />
                              <Bar dataKey="revenue" name="Revenue" fill="#38A169" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="expenses" name="Expenses" fill="#E53E3E" radius={[4, 4, 0, 0]} />
                              <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#3182CE" strokeWidth={3} dot={{ fill: '#3182CE' }} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </Box>
                      </Box>

                      {/* Monthly Expense Breakdown Chart */}
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Text fontSize="md" fontWeight="600" color="gray.700" mb={4}>
                            Monthly Expense Breakdown
                          </Text>
                          <Box h="300px">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={monthlyOperationalExpenses}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                  formatter={(value) => [`RM ${value.toLocaleString()}`, '']}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="kolPayments" name="KOL Payments" stackId="1" stroke="#E4405F" fill="#E4405F" />
                                <Area type="monotone" dataKey="salaries" name="Salaries" stackId="1" stroke="#3182CE" fill="#3182CE" />
                                <Area type="monotone" dataKey="adSpend" name="Ad Spend" stackId="1" stroke="#805AD5" fill="#805AD5" />
                                <Area type="monotone" dataKey="production" name="Production" stackId="1" stroke="#38A169" fill="#38A169" />
                                <Area type="monotone" dataKey="marketing" name="Marketing" stackId="1" stroke="#D69E2E" fill="#D69E2E" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>

                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Text fontSize="md" fontWeight="600" color="gray.700" mb={4}>
                            Expense Categories (Annual)
                          </Text>
                          <VStack spacing={3} align="stretch">
                            {expenseCategorySummary.map((expense) => (
                              <Box key={expense.category}>
                                <Flex justify="space-between" mb={1} align="center">
                                  <HStack>
                                    <Circle size="24px" bg={expense.color} color="white">
                                      <Icon as={expense.icon} boxSize={3} />
                                    </Circle>
                                    <Text fontSize="sm" color="gray.600">{expense.category}</Text>
                                  </HStack>
                                  <HStack spacing={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                                      RM {(expense.amount / 1000).toFixed(0)}K
                                    </Text>
                                    <Badge colorScheme={expense.trend.startsWith('+') ? 'green' : 'red'} fontSize="xs">
                                      {expense.trend}
                                    </Badge>
                                  </HStack>
                                </Flex>
                                <Progress
                                  value={expense.percentage}
                                  size="sm"
                                  colorScheme="red"
                                  borderRadius="full"
                                  bg="gray.100"
                                />
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      </SimpleGrid>

                      {/* Ad Spend & Employee Costs */}
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="md" fontWeight="600" color="gray.700">
                              Ad Spend by Platform (YTD)
                            </Text>
                            <Badge colorScheme="purple" fontSize="xs">
                              RM {(totalAdSpend / 1000000).toFixed(2)}M Total
                            </Badge>
                          </Flex>
                          <Box overflowX="auto">
                            <Table size="sm" variant="simple">
                              <Thead>
                                <Tr>
                                  <Th fontSize="xs">Platform</Th>
                                  <Th fontSize="xs" isNumeric>Spend</Th>
                                  <Th fontSize="xs" isNumeric>Campaigns</Th>
                                  <Th fontSize="xs" isNumeric>Avg CPM</Th>
                                  <Th fontSize="xs" isNumeric>%</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {adSpendByPlatform.map((platform) => (
                                  <Tr key={platform.platform}>
                                    <Td>
                                      <HStack>
                                        <Box w="8px" h="8px" borderRadius="sm" bg={platform.color} />
                                        <Text fontSize="sm">{platform.platform}</Text>
                                      </HStack>
                                    </Td>
                                    <Td isNumeric fontSize="sm" fontWeight="500">
                                      RM {(platform.spend / 1000).toFixed(0)}K
                                    </Td>
                                    <Td isNumeric fontSize="sm">{platform.campaigns}</Td>
                                    <Td isNumeric fontSize="sm">RM {platform.cpm}</Td>
                                    <Td isNumeric>
                                      <Badge colorScheme="gray" fontSize="xs">{platform.percentage}%</Badge>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        </Box>

                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="md" fontWeight="600" color="gray.700">
                              Employee Costs by Department
                            </Text>
                            <Badge colorScheme="blue" fontSize="xs">
                              {totalHeadcount} Total Staff
                            </Badge>
                          </Flex>
                          <Box overflowX="auto">
                            <Table size="sm" variant="simple">
                              <Thead>
                                <Tr>
                                  <Th fontSize="xs">Department</Th>
                                  <Th fontSize="xs" isNumeric>Staff</Th>
                                  <Th fontSize="xs" isNumeric>Monthly</Th>
                                  <Th fontSize="xs" isNumeric>Avg Salary</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {employeeCostsByDepartment.map((dept) => (
                                  <Tr key={dept.department}>
                                    <Td fontSize="sm">{dept.department}</Td>
                                    <Td isNumeric fontSize="sm">{dept.headcount}</Td>
                                    <Td isNumeric fontSize="sm" fontWeight="500">
                                      RM {(dept.monthlyCost / 1000).toFixed(1)}K
                                    </Td>
                                    <Td isNumeric fontSize="sm">
                                      RM {dept.avgSalary.toLocaleString()}
                                    </Td>
                                  </Tr>
                                ))}
                                <Tr bg="gray.50" fontWeight="600">
                                  <Td fontSize="sm">Total</Td>
                                  <Td isNumeric fontSize="sm">{totalHeadcount}</Td>
                                  <Td isNumeric fontSize="sm">
                                    RM {(employeeCostsByDepartment.reduce((s, d) => s + d.monthlyCost, 0) / 1000).toFixed(1)}K
                                  </Td>
                                  <Td isNumeric fontSize="sm">-</Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </Box>
                        </Box>
                      </SimpleGrid>

                      {/* Client Billing & KOL Payments */}
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="md" fontWeight="600" color="gray.700">
                              Client Billing & Receivables
                            </Text>
                            <Badge colorScheme="orange" fontSize="xs">
                              RM 470K Outstanding
                            </Badge>
                          </Flex>
                          <Box overflowX="auto">
                            <Table size="sm" variant="simple">
                              <Thead>
                                <Tr>
                                  <Th fontSize="xs">Client</Th>
                                  <Th fontSize="xs" isNumeric>Billed</Th>
                                  <Th fontSize="xs" isNumeric>Outstanding</Th>
                                  <Th fontSize="xs">Status</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {clientBilling.map((client) => (
                                  <Tr key={client.client}>
                                    <Td fontSize="sm">{client.client}</Td>
                                    <Td isNumeric fontSize="sm">RM {(client.billed / 1000).toFixed(0)}K</Td>
                                    <Td isNumeric fontSize="sm" fontWeight="500" color={client.outstanding > 50000 ? 'red.500' : 'gray.700'}>
                                      {client.outstanding > 0 ? `RM ${(client.outstanding / 1000).toFixed(0)}K` : '-'}
                                    </Td>
                                    <Td>
                                      <Badge
                                        colorScheme={
                                          client.status === 'Paid' ? 'green' :
                                          client.status === 'Overdue' ? 'red' : 'yellow'
                                        }
                                        fontSize="xs"
                                      >
                                        {client.status}
                                      </Badge>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        </Box>

                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="md" fontWeight="600" color="gray.700">
                              Pending KOL Payments
                            </Text>
                            <Badge colorScheme="red" fontSize="xs">
                              RM 200K Due
                            </Badge>
                          </Flex>
                          <VStack spacing={3} align="stretch">
                            {pendingKOLPayments.map((payment) => (
                              <Box
                                key={payment.kol}
                                p={3}
                                bg="gray.50"
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="gray.100"
                              >
                                <Flex justify="space-between" align="center">
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">{payment.kol}</Text>
                                    <HStack spacing={2}>
                                      <Badge colorScheme="purple" fontSize="xs">{payment.platform}</Badge>
                                      <Text fontSize="xs" color="gray.500">{payment.campaign}</Text>
                                    </HStack>
                                  </VStack>
                                  <VStack align="end" spacing={0}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                                      RM {payment.amount.toLocaleString()}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">Due: {payment.dueDate}</Text>
                                  </VStack>
                                </Flex>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      </SimpleGrid>

                      {/* Fixed vs Variable & Revenue by Industry */}
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Text fontSize="md" fontWeight="600" color="gray.700" mb={4}>
                            Fixed vs Variable Costs (Monthly Avg)
                          </Text>
                          {fixedVsVariableCosts.map((section) => (
                            <Box key={section.category} mb={4}>
                              <Text fontSize="sm" fontWeight="600" color={section.category === 'Fixed Costs' ? 'blue.600' : 'orange.600'} mb={2}>
                                {section.category}
                              </Text>
                              <VStack spacing={2} align="stretch">
                                {section.items.map((item) => (
                                  <Flex key={item.name} justify="space-between" align="center" py={1}>
                                    <Text fontSize="sm" color="gray.600">{item.name}</Text>
                                    <HStack spacing={3}>
                                      <Text fontSize="sm" fontWeight="500" color="gray.700">
                                        RM {(item.monthly / 1000).toFixed(1)}K/mo
                                      </Text>
                                      <Text fontSize="xs" color="gray.400">
                                        (RM {(item.annual / 1000).toFixed(0)}K/yr)
                                      </Text>
                                    </HStack>
                                  </Flex>
                                ))}
                              </VStack>
                              {section.category === 'Fixed Costs' && <Divider my={3} />}
                            </Box>
                          ))}
                        </Box>

                        <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
                          <Text fontSize="md" fontWeight="600" color="gray.700" mb={4}>
                            Revenue by Client Industry
                          </Text>
                          <Box h="280px">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueByIndustry} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                <YAxis dataKey="industry" type="category" tick={{ fontSize: 10 }} width={110} />
                                <Tooltip
                                  formatter={(value) => [`RM ${value.toLocaleString()}`, 'Revenue']}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#E4405F" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>
                      </SimpleGrid>

                    </VStack>
                  </TabPanel>

                  {/* Placeholder for other departments */}
                  <TabPanel>
                    <Box textAlign="center" py={20}>
                      <Text color="gray.500">Campaigns dashboard coming soon...</Text>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box textAlign="center" py={20}>
                      <Text color="gray.500">KOL Management dashboard coming soon...</Text>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box textAlign="center" py={20}>
                      <Text color="gray.500">Clients dashboard coming soon...</Text>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Analytics;

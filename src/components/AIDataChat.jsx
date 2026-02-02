import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Avatar,
  Badge,
  SimpleGrid,
  Icon,
  Divider,
  Code,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const MotionBox = motion(Box);

const AIDataChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI analytics assistant. I can help you understand your business data. Try asking me questions like:",
      suggestions: [
        "What's our profit margin trend?",
        "Which platform has the best ROI?",
        "Compare Q3 vs Q4 revenue",
        "Show me top performing KOLs",
      ],
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample AI responses with data insights
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Profit margin related
    if (lowerMessage.includes('profit') && lowerMessage.includes('margin')) {
      return {
        content: "Based on your 2024 data, your profit margins are showing strong growth:",
        data: {
          type: 'metrics',
          metrics: [
            { label: 'Q1 Average', value: '24.2%', trend: '+2.3%' },
            { label: 'Q2 Average', value: '25.2%', trend: '+4.1%' },
            { label: 'Q3 Average', value: '26.1%', trend: '+7.8%' },
            { label: 'Q4 Average', value: '27.8%', trend: '+15.2%' },
          ],
        },
        insight: "Your profit margin improved by 14.9% year-over-year. The strongest growth came from Q4, likely due to holiday campaigns and better cost management. KOL payment optimization in November contributed an additional 2.3% margin improvement.",
      };
    }
    
    // ROI and platform performance
    if (lowerMessage.includes('roi') || (lowerMessage.includes('platform') && lowerMessage.includes('perform'))) {
      return {
        content: "Here's your platform ROI analysis based on ad spend vs revenue generated:",
        data: {
          type: 'platforms',
          platforms: [
            { name: 'TikTok', roi: '385%', spend: 280000, revenue: 1078000, color: '#000000' },
            { name: 'Instagram', roi: '342%', spend: 420000, revenue: 1436400, color: '#E4405F' },
            { name: 'YouTube', roi: '298%', spend: 85000, revenue: 253300, color: '#FF0000' },
            { name: 'Facebook', roi: '265%', spend: 180000, revenue: 477000, color: '#1877F2' },
          ],
        },
        insight: "TikTok delivers the highest ROI at 385%, driven by lower CPM (RM 8.2) and high engagement rates. Consider reallocating 15% of Facebook budget to TikTok for Q1 2025.",
      };
    }
    
    // Revenue comparison
    if (lowerMessage.includes('revenue') && (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('q3') || lowerMessage.includes('q4'))) {
      return {
        content: "Q3 vs Q4 2024 revenue comparison:",
        data: {
          type: 'comparison',
          periods: [
            { period: 'Q3 2024', revenue: 2065000, expenses: 1525000, profit: 540000 },
            { period: 'Q4 2024', revenue: 2702000, expenses: 1949000, profit: 753000 },
          ],
          growth: {
            revenue: '+30.8%',
            expenses: '+27.8%',
            profit: '+39.4%',
          }
        },
        insight: "Q4 showed exceptional growth with revenue up 30.8% quarter-over-quarter. The major drivers were: holiday campaigns (+45%), new client acquisitions (Samsung, L'Oreal expansion), and increased KOL partnerships. Profit grew faster than revenue, indicating improved operational efficiency.",
      };
    }
    
    // KOL performance
    if (lowerMessage.includes('kol') && lowerMessage.includes('perform')) {
      return {
        content: "Top performing KOLs by revenue generated (2024):",
        data: {
          type: 'kols',
          kols: [
            { name: 'Neelofa', revenue: 485000, campaigns: 12, roi: '425%', platform: 'Instagram' },
            { name: 'Khairul Aming', revenue: 420000, campaigns: 15, roi: '512%', platform: 'TikTok' },
            { name: 'Vivy Yusof', revenue: 395000, campaigns: 10, roi: '389%', platform: 'Instagram' },
            { name: 'Jinnyboy', revenue: 325000, campaigns: 8, roi: '356%', platform: 'YouTube' },
          ],
        },
        insight: "Khairul Aming delivers the best ROI at 512% despite lower overall revenue. His TikTok content has exceptional engagement (avg 8.2% engagement rate). Consider increasing campaign frequency with him from 15 to 20+ annually.",
      };
    }
    
    // Default response
    return {
      content: "I can help you analyze various aspects of your business data. Here are some insights I can provide:",
      suggestions: [
        "Revenue and profit analysis by month/quarter",
        "ROI comparison across advertising platforms",
        "KOL performance metrics and recommendations",
        "Expense breakdown and cost optimization",
        "Client receivables and cash flow analysis",
        "Industry-specific revenue trends",
      ],
      insight: "Try asking specific questions about metrics, trends, or comparisons to get detailed insights.",
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        ...aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <VStack spacing={4} align="stretch" h="calc(100vh - 280px)">
      {/* Chat Header */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Box
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="xl"
              p={3}
            >
              <Icon as={Sparkles} boxSize={6} color="white" />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                AI Data Assistant
              </Text>
              <Text fontSize="sm" color="gray.500">
                Ask me anything about your business metrics
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
            <HStack spacing={1}>
              <Box w="6px" h="6px" bg="green.400" borderRadius="full" />
              <Text>Online</Text>
            </HStack>
          </Badge>
        </Flex>
      </Box>

      {/* Messages Container */}
      <Box
        flex="1"
        bg="white"
        borderRadius="xl"
        p={4}
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#A0AEC0',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {messages.map((message, index) => (
            <MotionBox
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Flex
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                align="start"
                gap={3}
              >
                {message.role === 'assistant' && (
                  <Avatar
                    size="sm"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    icon={<Icon as={Bot} boxSize={4} color="white" />}
                  />
                )}
                
                <Box
                  maxW="75%"
                  bg={message.role === 'user' ? 'red.500' : 'gray.50'}
                  color={message.role === 'user' ? 'white' : 'gray.800'}
                  borderRadius="xl"
                  p={4}
                  boxShadow="sm"
                >
                  <Text fontSize="sm" mb={message.suggestions ? 3 : 0}>
                    {message.content}
                  </Text>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <VStack spacing={2} align="stretch" mt={3}>
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          colorScheme="purple"
                          justifyContent="flex-start"
                          onClick={() => handleSuggestionClick(suggestion)}
                          leftIcon={<Icon as={Sparkles} boxSize={3} />}
                          _hover={{ bg: 'purple.50' }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </VStack>
                  )}

                  {/* Data Visualizations */}
                  {message.data?.type === 'metrics' && (
                    <SimpleGrid columns={2} spacing={3} mt={3}>
                      {message.data.metrics.map((metric, idx) => (
                        <Box
                          key={idx}
                          bg="white"
                          p={3}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            {metric.label}
                          </Text>
                          <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="700" color="gray.800">
                              {metric.value}
                            </Text>
                            <Badge colorScheme="green" fontSize="xs">
                              {metric.trend}
                            </Badge>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}

                  {message.data?.type === 'platforms' && (
                    <VStack spacing={2} mt={3} align="stretch">
                      {message.data.platforms.map((platform, idx) => (
                        <Box
                          key={idx}
                          bg="white"
                          p={3}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <Flex justify="space-between" align="center" mb={2}>
                            <HStack>
                              <Box w="3" h="3" bg={platform.color} borderRadius="sm" />
                              <Text fontSize="sm" fontWeight="600">
                                {platform.name}
                              </Text>
                            </HStack>
                            <Badge colorScheme="green" fontSize="sm">
                              ROI: {platform.roi}
                            </Badge>
                          </Flex>
                          <HStack justify="space-between" fontSize="xs" color="gray.600">
                            <Text>Spend: RM {(platform.spend / 1000).toFixed(0)}K</Text>
                            <Text>Revenue: RM {(platform.revenue / 1000).toFixed(0)}K</Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}

                  {message.data?.type === 'comparison' && (
                    <Box mt={3}>
                      <SimpleGrid columns={2} spacing={3} mb={3}>
                        {message.data.periods.map((period, idx) => (
                          <Box
                            key={idx}
                            bg="white"
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2}>
                              {period.period}
                            </Text>
                            <VStack spacing={1} align="stretch" fontSize="xs">
                              <Flex justify="space-between">
                                <Text color="gray.500">Revenue:</Text>
                                <Text fontWeight="600">RM {(period.revenue / 1000).toFixed(0)}K</Text>
                              </Flex>
                              <Flex justify="space-between">
                                <Text color="gray.500">Profit:</Text>
                                <Text fontWeight="600" color="green.600">RM {(period.profit / 1000).toFixed(0)}K</Text>
                              </Flex>
                            </VStack>
                          </Box>
                        ))}
                      </SimpleGrid>
                      <Box bg="green.50" p={2} borderRadius="lg">
                        <HStack justify="space-around" fontSize="xs">
                          <Text>
                            <Text as="span" fontWeight="600" color="green.700">
                              Revenue: {message.data.growth.revenue}
                            </Text>
                          </Text>
                          <Text>
                            <Text as="span" fontWeight="600" color="green.700">
                              Profit: {message.data.growth.profit}
                            </Text>
                          </Text>
                        </HStack>
                      </Box>
                    </Box>
                  )}

                  {message.data?.type === 'kols' && (
                    <VStack spacing={2} mt={3} align="stretch">
                      {message.data.kols.map((kol, idx) => (
                        <Box
                          key={idx}
                          bg="white"
                          p={3}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <Flex justify="space-between" align="start" mb={2}>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="600">
                                {kol.name}
                              </Text>
                              <HStack spacing={2}>
                                <Badge colorScheme="purple" fontSize="xs">
                                  {kol.platform}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {kol.campaigns} campaigns
                                </Text>
                              </HStack>
                            </VStack>
                            <Badge colorScheme="green" fontSize="sm">
                              {kol.roi}
                            </Badge>
                          </Flex>
                          <Text fontSize="xs" color="gray.600">
                            Revenue: RM {(kol.revenue / 1000).toFixed(0)}K
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}

                  {/* Insight Box */}
                  {message.insight && (
                    <Box
                      mt={3}
                      p={3}
                      bg="blue.50"
                      borderRadius="lg"
                      borderLeft="3px solid"
                      borderColor="blue.400"
                    >
                      <HStack align="start" spacing={2}>
                        <Icon as={AlertCircle} boxSize={4} color="blue.500" mt={0.5} />
                        <Text fontSize="xs" color="gray.700" lineHeight="1.6">
                          {message.insight}
                        </Text>
                      </HStack>
                    </Box>
                  )}

                  <Text fontSize="xs" color={message.role === 'user' ? 'whiteAlpha.700' : 'gray.400'} mt={2}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Box>

                {message.role === 'user' && (
                  <Avatar
                    size="sm"
                    bg="red.500"
                    icon={<Icon as={User} boxSize={4} color="white" />}
                  />
                )}
              </Flex>
            </MotionBox>
          ))}

          {isTyping && (
            <Flex align="start" gap={3}>
              <Avatar
                size="sm"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                icon={<Icon as={Bot} boxSize={4} color="white" />}
              />
              <Box bg="gray.50" borderRadius="xl" p={4} boxShadow="sm">
                <HStack spacing={2}>
                  <Box w="2" h="2" bg="gray.400" borderRadius="full" animation="bounce 1s infinite" />
                  <Box w="2" h="2" bg="gray.400" borderRadius="full" animation="bounce 1s infinite 0.2s" />
                  <Box w="2" h="2" bg="gray.400" borderRadius="full" animation="bounce 1s infinite 0.4s" />
                </HStack>
              </Box>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <Flex gap={3}>
          <Input
            placeholder="Ask about revenue trends, KOL performance, costs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            size="lg"
            borderRadius="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{
              bg: 'white',
              borderColor: 'purple.400',
              boxShadow: '0 0 0 1px #805AD5',
            }}
          />
          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleSend}
            isDisabled={!inputValue.trim()}
            rightIcon={<Icon as={Send} boxSize={4} />}
            px={8}
          >
            Send
          </Button>
        </Flex>
        <Text fontSize="xs" color="gray.400" mt={2} textAlign="center">
          AI Assistant powered by advanced analytics • All data is processed securely
        </Text>
      </Box>
    </VStack>
  );
};

export default AIDataChat;

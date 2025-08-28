import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Center>
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="red.500"
              size="xl"
            />
            <Text color="gray.600" fontSize="sm">
              Loading...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

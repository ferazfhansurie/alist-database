import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { getApiUrl } from '../config/api';

const CustomFieldsManager = () => {
  const [customFields, setCustomFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    fieldKey: '',
    fieldLabel: '',
    fieldType: 'text',
    isRequired: false,
    displayOrder: 0
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.25)', 'rgba(26, 32, 44, 0.25)');
  const glassBorder = useColorModeValue('rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.18)');

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(getApiUrl('/api/custom-fields'));
      const data = await response.json();
      setCustomFields(data);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch custom fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingField
        ? getApiUrl(`/api/custom-fields/${editingField.id}`)
        : getApiUrl('/api/custom-fields');

      const method = editingField ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Custom field ${editingField ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchCustomFields();
        handleClose();
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

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({
      fieldKey: field.field_key,
      fieldLabel: field.field_label,
      fieldType: field.field_type,
      isRequired: field.is_required,
      displayOrder: field.display_order
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom field?')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/custom-fields/${id}`), {
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
        fetchCustomFields();
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

  const handleClose = () => {
    setEditingField(null);
    setFormData({
      fieldKey: '',
      fieldLabel: '',
      fieldType: 'text',
      isRequired: false,
      displayOrder: 0
    });
    onClose();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Box p={2} bg="rgba(220, 38, 38, 0.1)" borderRadius="lg">
              <Settings size={24} color="#dc2626" />
            </Box>
            <Heading size="lg" color="gray.800">
              Manage Custom Fields
            </Heading>
          </HStack>
          <Button
            leftIcon={<Plus size={18} />}
            colorScheme="red"
            onClick={onOpen}
            borderRadius="xl"
          >
            Add Custom Field
          </Button>
        </HStack>

        <Box
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        >
          <Table variant="simple">
            <Thead bg="rgba(220, 38, 38, 0.1)">
              <Tr>
                <Th color="red.700" fontWeight="700">Field Key</Th>
                <Th color="red.700" fontWeight="700">Field Label</Th>
                <Th color="red.700" fontWeight="700">Type</Th>
                <Th color="red.700" fontWeight="700">Required</Th>
                <Th color="red.700" fontWeight="700">Display Order</Th>
                <Th color="red.700" fontWeight="700">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customFields.map((field) => (
                <Tr key={field.id} _hover={{ bg: 'rgba(254, 226, 226, 0.3)' }}>
                  <Td fontFamily="mono" fontSize="sm" fontWeight="600">
                    {field.field_key}
                  </Td>
                  <Td fontWeight="600">{field.field_label}</Td>
                  <Td>
                    <Badge colorScheme="blue" borderRadius="full">
                      {field.field_type}
                    </Badge>
                  </Td>
                  <Td>
                    {field.is_required ? (
                      <Badge colorScheme="red">Required</Badge>
                    ) : (
                      <Badge colorScheme="gray">Optional</Badge>
                    )}
                  </Td>
                  <Td>{field.display_order}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        size="sm"
                        icon={<Edit size={16} />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(field)}
                        aria-label="Edit field"
                      />
                      <IconButton
                        size="sm"
                        icon={<Trash2 size={16} />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(field.id)}
                        aria-label="Delete field"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={glassBg}
          backdropFilter="blur(40px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="2xl"
        >
          <ModalHeader color="red.700" fontWeight="700">
            {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Field Key (no spaces, lowercase)
                  </FormLabel>
                  <Input
                    value={formData.fieldKey}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldKey: e.target.value.toLowerCase().replace(/\s/g, '_') })
                    }
                    placeholder="e.g., ic_number"
                    isDisabled={!!editingField}
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Field Label
                  </FormLabel>
                  <Input
                    value={formData.fieldLabel}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldLabel: e.target.value })
                    }
                    placeholder="e.g., IC Number"
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Field Type
                  </FormLabel>
                  <Select
                    value={formData.fieldType}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldType: e.target.value })
                    }
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Select</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Display Order
                  </FormLabel>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    bg="rgba(255, 255, 255, 0.8)"
                    borderRadius="lg"
                  />
                </FormControl>

                <HStack spacing={4} w="full" justify="flex-end" pt={4}>
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="red" borderRadius="xl">
                    {editingField ? 'Update' : 'Create'}
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CustomFieldsManager;

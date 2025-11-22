import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Spinner,
    Center
} from '@chakra-ui/react';

const ProposalModal = ({ isOpen, onClose, selectedKols, onGenerate }) => {
    const [companyName, setCompanyName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const toast = useToast();

    const handleGenerate = async () => {
        if (!companyName.trim()) {
            toast({
                title: 'Company Name Required',
                description: 'Please enter the company name for the proposal.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsGenerating(true);
        try {
            await onGenerate(companyName);
            onClose();
            setCompanyName('');
        } catch (error) {
            // Error handling is done in the parent component usually, but we can show a toast here too if needed
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Generate Proposal</ModalHeader>
                <ModalCloseButton isDisabled={isGenerating} />
                <ModalBody>
                    {isGenerating ? (
                        <Center py={8} flexDirection="column">
                            <Spinner size="xl" color="blue.500" mb={4} />
                            <Text>Generating proposal...</Text>
                            <Text fontSize="sm" color="gray.500">This may take a minute to capture screenshots.</Text>
                        </Center>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            <Text>
                                You are about to generate a proposal for <strong>{selectedKols.length}</strong> selected KOLs.
                            </Text>
                            <FormControl isRequired>
                                <FormLabel>Proposed To (Company Name)</FormLabel>
                                <Input
                                    placeholder="e.g. Pretzley"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    autoFocus
                                />
                            </FormControl>
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isGenerating}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        loadingText="Generating"
                    >
                        Generate PDF
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ProposalModal;

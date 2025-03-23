import { useState, useEffect } from 'react';
import { Box, Header, Button, Modal, Form, FormField, Select, Input, SpaceBetween, Table, Pagination, TextFilter, Icon, Tabs, Link, Textarea, StatusIndicator, Alert } from '@cloudscape-design/components';

// Define types for document
interface Document {
  id: number;
  employeeName: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: 'Available' | 'Pending' | 'Not Available' | 'Processing' | 'Requested from Admin';
  downloadUrl?: string;
}

// Define type for document type option
interface DocumentTypeOption {
  label: string;
  value: string;
}

// Define type for document request
interface DocumentRequest {
  id: number;
  documentType: string;
  requestDate: string;
  reason: string;
  status: 'Pending' | 'Available' | 'Not Available' | 'Requested from Admin';
  adminRequestReason?: string;
}

// Define type for form validation errors
interface FormErrors {
  documentType?: string;
  customDocumentType?: string;
  requestReason?: string;
  adminRequestReason?: string;
}

// Mock centralized storage API for document check
const checkCentralizedStorage = async (documentType: string): Promise<boolean> => {
  // Simulate API call to centralized storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes: some document types are available, others are not
      const availableTypes = ['Offer Letter', 'Signed NDA'];
      resolve(availableTypes.includes(documentType));
    }, 1000);
  });
};

const DocumentRequest = () => {
  // State for modal visibility
  const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false);
  const [isAdminRequestModalVisible, setIsAdminRequestModalVisible] = useState<boolean>(false);
  
  // State for form fields
  const [documentType, setDocumentType] = useState<DocumentTypeOption>({ label: 'Recommendation Letter', value: 'recommendation_letter' });
  const [customDocumentType, setCustomDocumentType] = useState<string>('');
  const [requestReason, setRequestReason] = useState<string>('');
  const [adminRequestReason, setAdminRequestReason] = useState<string>('');
  
  // State for form validation
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showFormError, setShowFormError] = useState<boolean>(false);
  
  // State for documents table
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // State for UI
  const [filterText, setFilterText] = useState<string>('');
  const [activeTabId, setActiveTabId] = useState<string>("myDocuments");
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for success alert
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // Document request options for employees
  const requestDocumentTypeOptions: DocumentTypeOption[] = [
    { label: 'Offer Letter', value: 'offer_letter' },
    { label: 'Recommendation Letter', value: 'recommendation_letter' },
    { label: 'Certificate', value: 'certificate' },
    { label: 'Signed NDA', value: 'signed_nda' },
    { label: 'Other', value: 'other' }
  ];
  
  // Validate document request form
  const validateDocumentRequestForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!documentType) {
      errors.documentType = 'Document type is required';
    }
    
    if (documentType.value === 'other' && !customDocumentType.trim()) {
      errors.customDocumentType = 'Custom document type is required';
    }
    
    if (!requestReason.trim()) {
      errors.requestReason = 'Reason is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate admin request form
  const validateAdminRequestForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!adminRequestReason.trim()) {
      errors.adminRequestReason = 'Reason for admin request is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Show success alert message
  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('success');
    setShowAlert(true);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  
  // Handle document request submission
  const handleRequestSubmit = async () => {
    // Validate form
    if (!validateDocumentRequestForm()) {
      setShowFormError(true);
      return;
    }
    
    setLoading(true);
    
    // Get document type name
    const docTypeName = documentType.value === 'other' ? customDocumentType : documentType.label;
    
    // Check if document exists in centralized storage
    const isAvailableInStorage = await checkCentralizedStorage(docTypeName);
    
    // Create a new document request
    const newRequest: DocumentRequest = {
      id: Date.now(),
      documentType: docTypeName,
      requestDate: new Date().toLocaleDateString(),
      reason: requestReason,
      status: isAvailableInStorage ? 'Available' : 'Not Available'
    };
    
    // Add to document requests array
    setDocumentRequests([...documentRequests, newRequest]);
    
    // Also add document to the employee's documents with appropriate status
    const newDocument: Document = {
      id: Date.now() + 1,
      employeeName: "Current User", // Using a placeholder for current user's name
      documentType: docTypeName,
      fileName: isAvailableInStorage ? `${docTypeName.replace(/\s+/g, '_')}.pdf` : 'Not Available',
      uploadDate: new Date().toLocaleDateString(),
      status: isAvailableInStorage ? 'Available' : 'Not Available',
      downloadUrl: isAvailableInStorage ? '#document-download-url' : undefined
    };
    
    setDocuments([...documents, newDocument]);
    
    // Reset form fields
    setDocumentType({ label: 'Recommendation Letter', value: 'recommendation_letter' });
    setCustomDocumentType('');
    setRequestReason('');
    setFormErrors({});
    setShowFormError(false);
    setLoading(false);
    
    // Show success message
    showSuccessAlert('Document request submitted successfully');
    
    // Close modal
    setIsRequestModalVisible(false);
  };
  
  // Handle request to admin
  const handleAdminRequestSubmit = () => {
    if (!selectedDocument) return;
    
    // Validate form
    if (!validateAdminRequestForm()) {
      setShowFormError(true);
      return;
    }
    
    // Update document status - with proper type assertion
    const updatedDocuments = documents.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, status: 'Requested from Admin' as const } 
        : doc
    );
    
    // Update request status - with proper type assertion
    const updatedRequests = documentRequests.map(req => 
      req.documentType === selectedDocument.documentType 
        ? { ...req, status: 'Requested from Admin' as const, adminRequestReason } 
        : req
    );
    
    setDocuments(updatedDocuments);
    setDocumentRequests(updatedRequests);
    setAdminRequestReason('');
    setFormErrors({});
    setShowFormError(false);
    
    // Show success message
    showSuccessAlert('Request sent to admin successfully');
    
    // Close modal
    setIsAdminRequestModalVisible(false);
    setSelectedDocument(null);
  };
  
  // Reset form when closing modals
  const handleRequestModalClose = () => {
    setDocumentType({ label: 'Recommendation Letter', value: 'recommendation_letter' });
    setCustomDocumentType('');
    setRequestReason('');
    setFormErrors({});
    setShowFormError(false);
    setIsRequestModalVisible(false);
  };
  
  const handleAdminRequestModalClose = () => {
    setAdminRequestReason('');
    setFormErrors({});
    setShowFormError(false);
    setIsAdminRequestModalVisible(false);
    setSelectedDocument(null);
  };
  
  // Filter documents based on search text
  const filteredDocuments = documents.filter(
    doc => doc.documentType.toLowerCase().includes(filterText.toLowerCase())
  );
  
  // Render request document modal for employees
  const renderRequestModal = () => (
    <Modal
      visible={isRequestModalVisible}
      onDismiss={handleRequestModalClose}
      header="Request Document"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleRequestModalClose}>Cancel</Button>
            <Button variant="primary" onClick={handleRequestSubmit} loading={loading}>Submit Request</Button>
          </SpaceBetween>
        </Box>
      }
    >
      {showFormError && (
        <Alert
          type="error"
          dismissible
          onDismiss={() => setShowFormError(false)}
          header="Please fill all required fields"
        >
          All fields are mandatory. Please make sure to fill in all required information.
        </Alert>
      )}
      
      <Form>
        <FormField
          label="Document Type"
          description="Select the type of document you need"
          errorText={formErrors.documentType}
          constraintText="Required"
        >
          <Select
            selectedOption={documentType}
            onChange={({ detail }) => {
              setDocumentType(detail.selectedOption as DocumentTypeOption);
            }}
            options={requestDocumentTypeOptions}
          />
        </FormField>
        
        {documentType.value === 'other' && (
          <FormField
            label="Custom Document Type"
            description="Enter the custom document type"
            errorText={formErrors.customDocumentType}
            constraintText="Required"
          >
            <Input
              value={customDocumentType}
              onChange={({ detail }) => {
                setCustomDocumentType(detail.value);
              }}
            />
          </FormField>
        )}
        
        <FormField
          label="Reason for Request"
          description="Please provide a brief reason for your document request"
          errorText={formErrors.requestReason}
          constraintText="Required"
        >
          <Textarea
            value={requestReason}
            onChange={({ detail }) => {
              setRequestReason(detail.value);
            }}
          />
        </FormField>
      </Form>
    </Modal>
  );
  
  // Render admin request modal
  const renderAdminRequestModal = () => (
    <Modal
      visible={isAdminRequestModalVisible}
      onDismiss={handleAdminRequestModalClose}
      header="Request Document from Admin"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleAdminRequestModalClose}>Cancel</Button>
            <Button variant="primary" onClick={handleAdminRequestSubmit}>Submit Request to Admin</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Alert type="info">
          The document "{selectedDocument?.documentType}" is not available in the centralized storage. 
          Please provide a reason for requesting the admin to upload this document.
        </Alert>
        
        {showFormError && (
          <Alert
            type="error"
            dismissible
            onDismiss={() => setShowFormError(false)}
            header="Please fill all required fields"
          >
            All fields are mandatory. Please make sure to fill in the reason for your request.
          </Alert>
        )}
        
        <Form>
          <FormField
            label="Reason for Admin Request"
            description="Please explain why you need the admin to upload this document"
            errorText={formErrors.adminRequestReason}
            constraintText="Required"
          >
            <Textarea
              value={adminRequestReason}
              onChange={({ detail }) => {
                setAdminRequestReason(detail.value);
              }}
            />
          </FormField>
        </Form>
      </SpaceBetween>
    </Modal>
  );
  
  // Function to render status indicator with appropriate color
  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'Available':
        return <StatusIndicator type="success">Available</StatusIndicator>;
      case 'Not Available':
        return <StatusIndicator type="error">Not Available</StatusIndicator>;
      case 'Pending':
        return <StatusIndicator type="pending">Pending</StatusIndicator>;
      case 'Processing':
        return <StatusIndicator type="in-progress">Processing</StatusIndicator>;
      case 'Requested from Admin':
        return <StatusIndicator type="info">Requested from Admin</StatusIndicator>;
      default:
        return <StatusIndicator type="stopped">{status}</StatusIndicator>;
    }
  };
  
  return (
    <div>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header>
            <h1>Documents</h1>
          </Header>
          
          {showAlert && (
            <Alert
              type={alertType}
              dismissible
              onDismiss={() => setShowAlert(false)}
            >
              {alertMessage}
            </Alert>
          )}
          
          <Tabs
            activeTabId={activeTabId}
            onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
            tabs={[
              {
                id: "myDocuments",
                label: "My Documents",
                content: (
                  <SpaceBetween size="l">
                    <Box padding={{ top: "m" }}>
                      <Button
                        onClick={() => setIsRequestModalVisible(true)}
                      >
                        <Icon name="add-plus"/>
                        Request New Document
                      </Button>
                    </Box>
                    
                    {/* Filter for documents */}
                    <TextFilter
                      filteringText={filterText}
                      filteringPlaceholder="Search by document type"
                      filteringAriaLabel="Filter documents"
                      onChange={({ detail }) => setFilterText(detail.filteringText)}
                    />
                    
                    {/* My Documents table */}
                    <Table
                      columnDefinitions={[
                        {
                          id: "documentType",
                          header: "Document Type",
                          cell: (item: Document) => item.documentType,
                          sortingField: "documentType"
                        },
                        {
                          id: "fileName",
                          header: "File Name",
                          cell: (item: Document) => item.fileName
                        },
                        {
                          id: "uploadDate",
                          header: "Date",
                          cell: (item: Document) => item.uploadDate
                        },
                        {
                          id: "status",
                          header: "Status",
                          cell: (item: Document) => renderStatusIndicator(item.status)
                        },
                        {
                          id: "actions",
                          header: "Actions",
                          cell: (item: Document) => {
                            if (item.status === 'Available') {
                              return (
                                <Link href={item.downloadUrl || "#"} external>
                                  Download
                                </Link>
                              );
                            } else if (item.status === 'Not Available') {
                              return (
                                <Button 
                                  variant="link" 
                                  onClick={() => {
                                    setSelectedDocument(item);
                                    setIsAdminRequestModalVisible(true);
                                  }}
                                >
                                  Request from Admin
                                </Button>
                              );
                            } else if (item.status === 'Requested from Admin') {
                              return "Pending Admin Upload";
                            } else {
                              return "Pending";
                            }
                          }
                        }
                      ]}
                      items={filteredDocuments}
                      empty={
                        <Box textAlign="center" color="inherit">
                          <b>No documents</b>
                          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                            You don't have any documents yet. Request a document using the button above.
                          </Box>
                        </Box>
                      }
                      header={<Header>My Documents</Header>}
                    />
                    
                    <Pagination currentPageIndex={1} pagesCount={1} />
                  </SpaceBetween>
                )
              },
              {
                id: "requests",
                label: "My Requests",
                content: (
                  <SpaceBetween size="l">
                    <Box padding={{ top: "m" }}>
                      <Table
                        columnDefinitions={[
                          {
                            id: "documentType",
                            header: "Document Type",
                            cell: (item: DocumentRequest) => item.documentType,
                            sortingField: "documentType"
                          },
                          {
                            id: "requestDate",
                            header: "Request Date",
                            cell: (item: DocumentRequest) => item.requestDate
                          },
                          {
                            id: "reason",
                            header: "Reason",
                            cell: (item: DocumentRequest) => (
                              <div style={{ 
                                maxWidth: "200px", 
                                whiteSpace: "nowrap", 
                                overflow: "hidden", 
                                textOverflow: "ellipsis",
                                cursor: "default" 
                              }}
                              title={item.reason}
                              >
                                {item.reason}
                              </div>
                            ),
                          },
                          {
                            id: "status",
                            header: "Status",
                            cell: (item: DocumentRequest) => renderStatusIndicator(item.status)
                          },
                          {
                            id: "adminReason",
                            header: "Admin Request Details",
                            cell: (item: DocumentRequest) => 
                              item.adminRequestReason 
                                ? item.adminRequestReason 
                                : item.status === 'Not Available' 
                                  ? (
                                    <Button 
                                      variant="link" 
                                      onClick={() => {
                                        const doc = documents.find(d => d.documentType === item.documentType);
                                        if (doc) {
                                          setSelectedDocument(doc);
                                          setIsAdminRequestModalVisible(true);
                                        }
                                      }}
                                    >
                                      Request from Admin
                                    </Button>
                                  ) 
                                  : '-'
                          }
                        ]}
                        items={documentRequests}
                        empty={
                          <Box textAlign="center" color="inherit">
                            <b>No requests</b>
                            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                              You haven't made any document requests yet.
                            </Box>
                          </Box>
                        }
                        header={<Header>My Document Requests</Header>}
                      />
                      
                      <Pagination currentPageIndex={1} pagesCount={1} />
                    </Box>
                  </SpaceBetween>
                )
              }
            ]}
          />
        </SpaceBetween>
      </Box>
      
      {renderRequestModal()}
      {renderAdminRequestModal()}
    </div>
  );
};

export default DocumentRequest;
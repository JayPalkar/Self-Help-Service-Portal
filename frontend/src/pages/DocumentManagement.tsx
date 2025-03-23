import { useState, useEffect, ChangeEvent } from 'react';
import { 
  Box, 
  Header, 
  Button, 
  Modal, 
  Form, 
  FormField, 
  Select, 
  Input, 
  SpaceBetween, 
  Table, 
  Pagination, 
  TextFilter, 
  Icon,
  StatusIndicator,
  Alert,
  Textarea,
  Tabs
} from '@cloudscape-design/components';

// Define types for document
interface Document {
  id: number;
  employeeName: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: string;
}

// Define types for document requests
interface DocumentRequest {
  id: number;
  employeeName: string;
  documentType: string;
  requestDate: string;
  reason: string;
  status: 'Pending' | 'Uploaded' | 'Responded';
}

// Define type for document type option
interface DocumentTypeOption {
  label: string;
  value: string;
}

// Define type for form errors
interface FormErrors {
  employeeName?: string;
  documentType?: string;
  customDocumentType?: string;
  selectedFile?: string;
  adminResponse?: string;
}

// Define type for alerts
interface AlertMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  visible: boolean;
}

const DocumentManagement = () => {
  // Document types
  const documentTypeOptions: DocumentTypeOption[] = [
    { label: 'Offer Letter', value: 'offer_letter' },
    { label: 'Recommendation Letter', value: 'recommendation_letter' },
    { label: 'Certificate', value: 'certificate' },
    { label: 'Signed NDA', value: 'signed_nda' },
    { label: 'Other', value: 'other' }
  ];

  // State for active tab
  const [activeTabId, setActiveTabId] = useState<string>('documents');

  // State for documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filterTextDocuments, setFilterTextDocuments] = useState<string>('');

  // State for document requests
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [filterTextRequests, setFilterTextRequests] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);

  // State for modals
  const [isUploadModalVisible, setIsUploadModalVisible] = useState<boolean>(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState<boolean>(false);
  const [isDirectUploadModalVisible, setIsDirectUploadModalVisible] = useState<boolean>(false);

  // State for form fields
  const [employeeName, setEmployeeName] = useState<string>('');
  const [documentType, setDocumentType] = useState<DocumentTypeOption>({ label: 'Offer Letter', value: 'offer_letter' });
  const [customDocumentType, setCustomDocumentType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [adminResponse, setAdminResponse] = useState<string>('');

  // Form validation and alerts
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Load initial document requests
  useEffect(() => {
    // Mock data for demonstration
    const mockRequests: DocumentRequest[] = [
      {
        id: 1,
        employeeName: 'Jane Doe',
        documentType: 'Recommendation Letter',
        requestDate: '03/20/2025',
        reason: 'Need for job application to another company',
        status: 'Pending'
      },
      {
        id: 2,
        employeeName: 'John Smith',
        documentType: 'Certificate',
        requestDate: '03/19/2025',
        reason: 'Need for professional certification',
        status: 'Pending'
      },
      {
        id: 3,
        employeeName: 'Alice Johnson',
        documentType: 'Signed NDA',
        requestDate: '03/18/2025',
        reason: 'Required for project access',
        status: 'Pending'
      }
    ];
    
    setDocumentRequests(mockRequests);
  }, []);

  // Function to add an alert
  const addAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const newAlert: AlertMessage = {
      id: Date.now(),
      type,
      message,
      visible: true
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-dismiss success alerts after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        dismissAlert(newAlert.id);
      }, 5000);
    }
  };
  
  // Function to dismiss an alert
  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, visible: false } : alert
    ));
    
    // Remove from DOM after animation
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 300);
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Clear any previous file error
      setFormErrors(prev => ({ ...prev, selectedFile: undefined }));
    }
  };

  // Validate direct upload form
  const validateDirectUploadForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!employeeName.trim()) {
      errors.employeeName = 'Employee name is required';
    }
    
    if (documentType.value === 'other' && !customDocumentType.trim()) {
      errors.customDocumentType = 'Custom document type is required';
    }
    
    if (!selectedFile) {
      errors.selectedFile = 'Document file is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate upload for request form
  const validateRequestUploadForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!selectedFile) {
      errors.selectedFile = 'Document file is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate response form
  const validateResponseForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!adminResponse.trim()) {
      errors.adminResponse = 'Response message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle direct document upload
  const handleDirectUploadSubmit = () => {
    if (!validateDirectUploadForm()) {
      addAlert('error', 'Please fill in all required fields');
      return;
    }
    
    // Create a new document entry
    const newDocument: Document = {
      id: Date.now(),
      employeeName,
      documentType: documentType.value === 'other' ? customDocumentType : documentType.label,
      fileName: selectedFile ? selectedFile.name : 'No file selected',
      uploadDate: new Date().toLocaleDateString(),
      status: 'Available'
    };
    
    // Add to documents array
    setDocuments([...documents, newDocument]);
    
    // Reset form fields
    setEmployeeName('');
    setDocumentType({ label: 'Offer Letter', value: 'offer_letter' });
    setCustomDocumentType('');
    setSelectedFile(null);
    
    // Show success message
    addAlert('success', 'Document uploaded successfully');
    
    // Close modal
    setIsDirectUploadModalVisible(false);
  };

  // Handle document upload for request
  const handleRequestUpload = () => {
    if (!selectedRequest) return;
    
    if (!validateRequestUploadForm()) {
      addAlert('error', 'Please select a file to upload');
      return;
    }
    
    // Update the request status
    const updatedRequests = documentRequests.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'Uploaded' as const
          } 
        : req
    );
    
    setDocumentRequests(updatedRequests);
    
    // Add to documents array
    const newDocument: Document = {
      id: Date.now(),
      employeeName: selectedRequest.employeeName,
      documentType: selectedRequest.documentType,
      fileName: selectedFile ? selectedFile.name : 'No file selected',
      uploadDate: new Date().toLocaleDateString(),
      status: 'Available'
    };
    
    setDocuments([...documents, newDocument]);
    
    // Show success message
    addAlert('success', `Document uploaded for ${selectedRequest.employeeName}`);
    
    // Reset and close
    setSelectedFile(null);
    setAdminResponse('');
    setIsUploadModalVisible(false);
    setSelectedRequest(null);
    setFormErrors({});
  };
  
  // Handle sending response to request
  const handleSendResponse = () => {
    if (!selectedRequest) return;
    
    if (!validateResponseForm()) {
      addAlert('error', 'Please provide a response message');
      return;
    }
    
    // Update the request status
    const updatedRequests = documentRequests.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'Responded' as const
          } 
        : req
    );
    
    setDocumentRequests(updatedRequests);
    
    // Show success message
    addAlert('success', `Response sent to ${selectedRequest.employeeName}`);
    
    // Reset and close
    setAdminResponse('');
    setIsResponseModalVisible(false);
    setSelectedRequest(null);
    setFormErrors({});
  };
  
  // Render status indicator
  const renderStatusIndicator = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'Uploaded':
        return <StatusIndicator type="success">Uploaded</StatusIndicator>;
      case 'Responded':
        return <StatusIndicator type="error">Responded</StatusIndicator>;
      case 'Pending':
      default:
        return <StatusIndicator type="pending">Pending</StatusIndicator>;
    }
  };
  
  // Filter documents based on search text
  const filteredDocuments = documents.filter(
    doc => 
      doc.employeeName.toLowerCase().includes(filterTextDocuments.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(filterTextDocuments.toLowerCase())
  );
  
  // Filter requests based on search text
  const filteredRequests = documentRequests.filter(
    req => 
      req.employeeName.toLowerCase().includes(filterTextRequests.toLowerCase()) ||
      req.documentType.toLowerCase().includes(filterTextRequests.toLowerCase())
  );
  
  return (
    <div>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header>
            <h1>Document Management System</h1>
          </Header>
          
          {/* Alert container */}
          {alerts.filter(alert => alert.visible).length > 0 && (
            <div style={{ position: 'sticky', top: '0', zIndex: 1000 }}>
              <SpaceBetween size="xs">
                {alerts.filter(alert => alert.visible).map(alert => (
                  <Alert
                    key={alert.id}
                    type={alert.type}
                    dismissible
                    onDismiss={() => dismissAlert(alert.id)}
                  >
                    {alert.message}
                  </Alert>
                ))}
              </SpaceBetween>
            </div>
          )}
          
          <Tabs
            activeTabId={activeTabId}
            onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
            tabs={[
              {
                id: 'documents',
                label: 'All Documents',
                content: (
                  <SpaceBetween size="l">
                    <Box padding={{ top: 'l' }}>
                      <SpaceBetween size="l">
                        <Header 
                          actions={
                            <Button
                              onClick={() => setIsDirectUploadModalVisible(true)}
                            >
                              <Icon name="add-plus"/>
                              Upload Document
                            </Button>
                          }
                        >
                          Document Repository
                        </Header>
                        
                        {/* Search bar for documents */}
                        <TextFilter
                          filteringText={filterTextDocuments}
                          filteringPlaceholder="Search by employee name or document type"
                          filteringAriaLabel="Filter documents"
                          onChange={({ detail }) => setFilterTextDocuments(detail.filteringText)}
                        />
                        
                        {/* Documents table */}
                        <Table
                          columnDefinitions={[
                            {
                              id: "employeeName",
                              header: "Employee Name",
                              cell: (item: Document) => item.employeeName,
                              sortingField: "employeeName",
                              minWidth: 150,
                              width: 150
                            },
                            {
                              id: "documentType",
                              header: "Document Type",
                              cell: (item: Document) => item.documentType,
                              sortingField: "documentType",
                              minWidth: 150,
                              width: 150
                            },
                            {
                              id: "fileName",
                              header: "File Name",
                              cell: (item: Document) => item.fileName,
                              minWidth: 150,
                              width: 150
                            },
                            {
                              id: "uploadDate",
                              header: "Upload Date",
                              cell: (item: Document) => item.uploadDate,
                              minWidth: 120,
                              width: 120
                            },
                            {
                              id: "status",
                              header: "Status",
                              cell: (item: Document) => item.status || "Available",
                              minWidth: 120,
                              width: 120
                            }
                          ]}
                          items={filteredDocuments}
                          empty={
                            <Box textAlign="center" color="inherit">
                              <b>No documents</b>
                              <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                                No documents to display.
                              </Box>
                            </Box>
                          }
                          header={<Header>All Documents</Header>}
                        />
                        
                        <Pagination currentPageIndex={1} pagesCount={1} />
                      </SpaceBetween>
                    </Box>
                  </SpaceBetween>
                )
              },
              {
                id: 'requests',
                label: 'Document Requests',
                content: (
                  <SpaceBetween size="l">
                    <Box padding={{ top: 'l' }}>
                      <SpaceBetween size="l">
                        <Header>
                          Employee Document Requests
                        </Header>
                        
                        {/* Search bar for requests */}
                        <TextFilter
                          filteringText={filterTextRequests}
                          filteringPlaceholder="Search by employee name or document type"
                          filteringAriaLabel="Filter requests"
                          onChange={({ detail }) => setFilterTextRequests(detail.filteringText)}
                        />
                        
                        {/* Requests Table */}
                        <Table
                          columnDefinitions={[
                            {
                              id: "employeeName",
                              header: "Employee Name",
                              cell: (item: DocumentRequest) => (
                                <div 
                                  style={{ 
                                    maxWidth: "200px", 
                                    whiteSpace: "nowrap", 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis",
                                    cursor: "default" 
                                  }}
                                  title={item.employeeName}
                                >
                                  {item.employeeName}
                                </div>
                              ),
                              minWidth: 150,
                              width: 150
                            },
                            {
                              id: "documentType",
                              header: "Document Type",
                              cell: (item: DocumentRequest) => item.documentType,
                              minWidth: 150,
                              width: 150
                            },
                            {
                              id: "requestDate",
                              header: "Request Date",
                              cell: (item: DocumentRequest) => item.requestDate,
                              minWidth: 120,
                              width: 120
                            },
                            {
                              id: "reason",
                              header: "Reason",
                              cell: (item: DocumentRequest) => (
                                <div 
                                  style={{ 
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
                              minWidth: 200,
                              width: 200
                            },
                            {
                              id: "status",
                              header: "Status",
                              cell: (item: DocumentRequest) => renderStatusIndicator(item.status),
                              minWidth: 120,
                              width: 120
                            },
                            {
                              id: "actions",
                              header: "Actions",
                              cell: (item: DocumentRequest) => {
                                if (item.status === 'Pending') {
                                  return (
                                    <SpaceBetween size="xs" direction="horizontal">
                                      <Button 
                                        onClick={() => {
                                          setSelectedRequest(item);
                                          setIsUploadModalVisible(true);
                                          setFormErrors({});
                                        }}
                                        wrapText={false}
                                      >
                                        <Icon name="add-plus"/>
                                        Upload Document
                                      </Button>
                                      <Button 
                                        onClick={() => {
                                          setSelectedRequest(item);
                                          setIsResponseModalVisible(true);
                                          setFormErrors({});
                                        }}
                                        wrapText={false}
                                      >
                                        Respond
                                      </Button>
                                    </SpaceBetween>
                                  );
                                } else if (item.status === 'Uploaded') {
                                  return "Document Uploaded";
                                } else if (item.status === 'Responded') {
                                  return "Responded";
                                } else {
                                  return null;
                                }
                              },
                              minWidth: 400,
                              width: 400
                            }
                          ]}
                          items={filteredRequests}
                          empty={
                            <Box textAlign="center">
                              <b>No document requests</b>
                              <Box padding={{ bottom: "s" }} variant="p">
                                There are no pending document requests from employees.
                              </Box>
                            </Box>
                          }
                        />
                      </SpaceBetween>
                    </Box>
                  </SpaceBetween>
                )
              }
            ]}
          />
        </SpaceBetween>
      </Box>
      
      {/* Direct Upload Document Modal */}
      <Modal
        visible={isDirectUploadModalVisible}
        onDismiss={() => {
          setIsDirectUploadModalVisible(false);
          setFormErrors({});
        }}
        header="Upload Document"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setIsDirectUploadModalVisible(false);
                setFormErrors({});
              }}>Cancel</Button>
              <Button variant="primary" onClick={handleDirectUploadSubmit}>Upload</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Form>
          <FormField
            label="Employee Name"
            description="Enter the name of the employee"
            errorText={formErrors.employeeName}
          >
            <Input
              value={employeeName}
              onChange={({ detail }) => {
                setEmployeeName(detail.value);
                if (detail.value.trim()) {
                  setFormErrors(prev => ({ ...prev, employeeName: undefined }));
                }
              }}
              placeholder="Enter employee name"
              ariaRequired={true}
            />
            <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
              * Required field
            </div>
          </FormField>
          
          <FormField
            label="Document Type"
            description="Select the type of document"
          >
            <Select
              selectedOption={documentType}
              onChange={({ detail }) => {
                setDocumentType(detail.selectedOption as DocumentTypeOption);
              }}
              options={documentTypeOptions}
            />
            <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
              * Required field
            </div>
          </FormField>
          
          {documentType.value === 'other' && (
            <FormField
              label="Custom Document Type"
              description="Enter the custom document type"
              errorText={formErrors.customDocumentType}
            >
              <Input
                value={customDocumentType}
                onChange={({ detail }) => {
                  setCustomDocumentType(detail.value);
                  if (detail.value.trim()) {
                    setFormErrors(prev => ({ ...prev, customDocumentType: undefined }));
                  }
                }}
                placeholder="Enter custom document type"
                ariaRequired={true}
              />
              <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
                * Required field
              </div>
            </FormField>
          )}
          
          <FormField
            label="Document File"
            description="Upload the document file"
            errorText={formErrors.selectedFile}
          >
            <input 
              type="file" 
              onChange={handleFileChange}
              style={{ marginTop: '8px' }}
              required
              aria-required="true"
            />
            <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
              * Required field
            </div>
          </FormField>
        </Form>
      </Modal>
      
      {/* Upload Modal for Request */}
      <Modal
        visible={isUploadModalVisible}
        onDismiss={() => {
          setIsUploadModalVisible(false);
          setSelectedRequest(null);
          setFormErrors({});
        }}
        header={`Upload Document for ${selectedRequest?.employeeName}`}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setIsUploadModalVisible(false);
                setSelectedRequest(null);
                setFormErrors({});
              }}>Cancel</Button>
              <Button variant="primary" onClick={handleRequestUpload}>Upload</Button>
            </SpaceBetween>
          </Box>
        }
      >
        {selectedRequest && (
          <Form>
            <SpaceBetween size="m">
              <Alert type="info">
                Uploading document: <strong>{selectedRequest.documentType}</strong> for employee <strong>{selectedRequest.employeeName}</strong>
              </Alert>
              
              <FormField
                label="Document File"
                description="Upload the document file"
                errorText={formErrors.selectedFile}
              >
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  style={{ marginTop: '8px' }}
                  required
                  aria-required="true"
                />
                <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
                  * Required field
                </div>
              </FormField>
              
              <FormField
                label="Remarks"
                description="Add any notes for the employee"
              >
                <Textarea
                  value={adminResponse}
                  onChange={({ detail }) => setAdminResponse(detail.value)}
                  placeholder="Add your remarks here..."
                />
              </FormField>
            </SpaceBetween>
          </Form>
        )}
      </Modal>
      
      {/* Response Modal */}
      <Modal
        visible={isResponseModalVisible}
        onDismiss={() => {
          setIsResponseModalVisible(false);
          setSelectedRequest(null);
          setFormErrors({});
        }}
        header={`Respond to ${selectedRequest?.employeeName}`}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setIsResponseModalVisible(false);
                setSelectedRequest(null);
                setFormErrors({});
              }}>Cancel</Button>
              <Button variant="primary" onClick={handleSendResponse}>Send Response</Button>
            </SpaceBetween>
          </Box>
        }
      >
        {selectedRequest && (
          <Form>
            <SpaceBetween size="m">
              <Alert 
                type="warning"
                dismissible
                onDismiss={() => {
                  // Just to demonstrate alert dismissal
                }}
              >
                You are responding without uploading a document.
              </Alert>
              
              <FormField
                label="Response"
                description="Explain why the document cannot be provided"
                errorText={formErrors.adminResponse}
              >
                <Textarea
                  value={adminResponse}
                  onChange={({ detail }) => {
                    setAdminResponse(detail.value);
                    if (detail.value.trim()) {
                      setFormErrors(prev => ({ ...prev, adminResponse: undefined }));
                    }
                  }}
                  placeholder="Explain why you cannot upload this document..."
                />
                <div style={{ color: '#d91515', fontSize: '12px', marginTop: '4px' }}>
                  * Required field
                </div>
              </FormField>
            </SpaceBetween>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default DocumentManagement;
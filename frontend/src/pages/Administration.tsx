import React, { useState, useEffect } from 'react';
import { Box, Header, Button, Modal, FormField, Input, Select, DatePicker, Table, SpaceBetween, TextFilter, Alert } from '@cloudscape-design/components';

// Interface for Employee Data
interface Employee {
    employeeName: string;
    team: string;
    role: string;
    email: string;
    password: string;
    dateOfBirth: string;
    dateOfJoining: string;
    upiId: string;
}

// Interface for Employee Data returned from API (without password)
interface EmployeeResponse {
    employeeName: string;
    team: string;
    role: string;
    email: string;
    dateOfBirth: string;
    dateOfJoining: string;
    upiId: string;
}

const Administration: React.FC = () => {
    // State for Modal Visibility
    const [isModalVisible, setIsModalVisible] = useState(false);

    // State for Form Data
    const [formData, setFormData] = useState<Employee>({
        employeeName: '',
        team: '',
        role: '',
        email: '',
        password: '',
        dateOfBirth: '',
        dateOfJoining: '',
        upiId: '',
    });

    // State for Employees Data
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

    // State for Search and Filter
    const [searchText, setSearchText] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    // State for Error Handling
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    
    // State for Loading
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    
    // State to track if form has been submitted
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Fetch employees from API
    const fetchEmployees = async () => {
        setIsFetching(true);
        setFetchError('');
        
        try {
            const apiUrl = '/api/auth/admin/employees';
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setFetchError(errorData.message || `Failed to fetch employees. Server returned status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setFetchError('Network error. Please check your internet connection or the API endpoint may be unavailable.');
            } else {
                setFetchError(`Failed to fetch employees: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        } finally {
            setIsFetching(false);
        }
    };

    // Fetch employees when component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle Form Input Change
    const handleInputChange = (field: keyof Employee, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    // Validate all required fields
    const validateForm = (): boolean => {
        if (!formData.employeeName || 
            !formData.team || 
            !formData.role || 
            !formData.email || 
            !formData.password ||
            !formData.dateOfBirth ||
            !formData.dateOfJoining ||
            !formData.upiId) {
            setError('Please fill in all required fields.');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }

        return true;
    };

    // Handle Form Submission
    const handleSubmit = async () => {
        setFormSubmitted(true);
        
        // Validate all fields
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const payload = { ...formData };

            // POST request to API
            const apiUrl = '/api/auth/admin/create-employee';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (response.ok) {
                handleCloseModal(); // Close modal and reset form
                fetchEmployees(); // Refresh employee list from API
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.message || `Failed to create employee. Server returned status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error creating employee:', err);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Network error. Please check your internet connection or the API endpoint may be unavailable.');
            } else {
                setError(`Failed to create employee: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Function to reset modal state when closing
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setFormSubmitted(false);
        setError('');
        setFormData({
            employeeName: '',
            team: '',
            role: '',
            email: '',
            password: '',
            dateOfBirth: '',
            dateOfJoining: '',
            upiId: '',
        });
    };

    // Function to dismiss fetch error alert
    const handleDismissFetchError = () => {
        setFetchError('');
    };

    // Function to dismiss form error alert
    const handleDismissFormError = () => {
        setError('');
    };

    // Filtered Employees based on Search and Team Filter
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.team.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchText.toLowerCase());

        const matchesTeam = selectedTeam ? employee.team === selectedTeam : true;

        return matchesSearch && matchesTeam;
    });

    // Table Column Definitions
    const tableColumnDefinitions = [
        { 
          header: 'Employee Name',
          cell: (item: EmployeeResponse) => item.employeeName,
          minWidth: 200,
          width: 200
        },
        { 
          header: 'Team',
          cell: (item: EmployeeResponse) => item.team,
          minWidth: 200,
          width: 200
        },
        { 
          header: 'Role',
          cell: (item: EmployeeResponse) => item.role,
          minWidth: 150,
          width: 150
        },
        { 
          header: 'Date of Joining',
          cell: (item: EmployeeResponse) => item.dateOfJoining || '-',
          minWidth: 100,
          width: 100
        },
        {
            header: 'Actions',
            cell: (item: EmployeeResponse) => (
                <Button variant="link" onClick={() => console.log('Edit:', item.email)}>
                    Edit
                </Button>
            ),
            minWidth: 150,
            width: 150
        },
    ];

    return (
        <Box>
            <Header><h1>Administration</h1></Header>
            <h3>Manage Employees and Roles.</h3>

            {/* Add Employee Button */}
            <Box padding={{ top: 'l', bottom: 'l' }}>
                <Button variant="primary" iconName="add-plus" onClick={() => setIsModalVisible(true)}>
                    Create Employee
                </Button>
            </Box>

            <SpaceBetween direction="vertical" size="m">
              {/* Error message for fetching employees with dismiss button */}
              {fetchError && (
                <Alert 
                  type="error" 
                  dismissible={true}
                  onDismiss={handleDismissFetchError}
                >
                  {fetchError}
                </Alert>
              )}
            
              {/* Search and Filter */}
              <SpaceBetween direction="horizontal" size="m">
                <TextFilter
                  filteringText={searchText}
                  onChange={({ detail }) => setSearchText(detail.filteringText)}
                  filteringPlaceholder="Search by name, team, or role"
                />
                <Select
                    selectedOption={selectedTeam ? { label: selectedTeam, value: selectedTeam } : null}
                    onChange={({ detail }) => setSelectedTeam(detail.selectedOption?.value || '')}
                    options={[
                        { label: 'All Teams', value: '' },
                        { label: 'Design', value: 'Design' },
                        { label: 'Developer', value: 'Developer' },
                        { label: 'Testing', value: 'Testing' },
                        { label: 'Editing', value: 'Editing' },
                    ]}
                    placeholder="Filter by Team"
                />
              </SpaceBetween>

              {/* Employees Table */}
              <Table
                  columnDefinitions={tableColumnDefinitions}
                  items={filteredEmployees}
                  loading={isFetching}
                  loadingText="Loading employees"
                  empty={
                      <Box textAlign="center" padding="l">
                          <b>No employees found</b>
                          <Box padding={{ top: 'xs' }}>
                              Create a new employee or adjust your search criteria.
                          </Box>
                      </Box>
                  }
                  header={
                    <Header 
                      variant="h1" 
                      actions={
                        <Button 
                          onClick={fetchEmployees} 
                          iconName="refresh" 
                          disabled={isFetching}
                        >
                          Refresh
                        </Button>
                      }
                    >
                      Employees
                    </Header>
                  }
              />
            </SpaceBetween>

            {/* Create Employee Modal */}
            <Modal
                onDismiss={handleCloseModal}
                visible={isModalVisible}
                header="Create Employee"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} loading={isLoading}>
                                Create
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <SpaceBetween direction="vertical" size="m">
                    {/* Error message in modal with dismiss button */}
                    {error && (
                      <Alert 
                        type="error"
                        dismissible={true}
                        onDismiss={handleDismissFormError}
                      >
                        {error}
                      </Alert>
                    )}
                    <FormField 
                        label="Employee Name" 
                        errorText={formSubmitted && !formData.employeeName ? "Required" : undefined}
                    >
                        <Input
                            value={formData.employeeName}
                            onChange={({ detail }) => handleInputChange('employeeName', detail.value)}
                        />
                    </FormField>
                    <FormField 
                        label="Team" 
                        errorText={formSubmitted && !formData.team ? "Required" : undefined}
                    >
                        <Select
                            selectedOption={formData.team ? { label: formData.team, value: formData.team } : null}
                            onChange={({ detail }) => handleInputChange('team', detail.selectedOption?.value || '')}
                            options={[
                                { label: 'Design', value: 'Design' },
                                { label: 'Developer', value: 'Developer' },
                                { label: 'Testing', value: 'Testing' },
                                { label: 'Editing', value: 'Editing' },
                            ]}
                        />
                    </FormField>
                    <FormField 
                        label="Role in Team" 
                        errorText={formSubmitted && !formData.role ? "Required" : undefined}
                    >
                        <Select
                            selectedOption={formData.role ? { label: formData.role, value: formData.role } : null}
                            onChange={({ detail }) => handleInputChange('role', detail.selectedOption?.value || '')}
                            options={[
                                { label: 'Manager', value: 'Manager' },
                                { label: 'Member', value: 'Member' },
                            ]}
                        />
                    </FormField>
                    <FormField 
                        label="Email ID"
                        errorText={formSubmitted && !formData.email ? "Required" : undefined}
                        description="Company email address"
                    >
                        <Input
                            value={formData.email}
                            onChange={({ detail }) => handleInputChange('email', detail.value)}
                            type="email"
                        />
                    </FormField>
                    <FormField 
                        label="Password"
                        errorText={formSubmitted && !formData.password ? "Required" : undefined}
                        description="Temporary password for first login"
                    >
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={({ detail }) => handleInputChange('password', detail.value)}
                        />
                    </FormField>
                    <FormField 
                        label="Date of Birth"
                        errorText={formSubmitted && !formData.dateOfBirth ? "Required" : undefined}
                    >
                        <DatePicker
                            value={formData.dateOfBirth}
                            onChange={({ detail }) => handleInputChange('dateOfBirth', detail.value)}
                            placeholder="YYYY/MM/DD"
                        />
                    </FormField>
                    <FormField 
                        label="Date of Joining"
                        errorText={formSubmitted && !formData.dateOfJoining ? "Required" : undefined}
                    >
                        <DatePicker
                            value={formData.dateOfJoining}
                            onChange={({ detail }) => handleInputChange('dateOfJoining', detail.value)}
                            placeholder="YYYY/MM/DD"
                        />
                    </FormField>
                    <FormField 
                        label="UPI ID" 
                        errorText={formSubmitted && !formData.upiId ? "Required" : undefined}
                        description="For payment processing"
                    >
                        <Input
                            value={formData.upiId}
                            onChange={({ detail }) => handleInputChange('upiId', detail.value)}
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </Box>
    );
};

export default Administration;
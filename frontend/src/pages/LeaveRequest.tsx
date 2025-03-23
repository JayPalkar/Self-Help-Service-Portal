import { Box, Header, Form, FormField, Input, Button, DatePicker, Select, Alert, SpaceBetween, Modal, Table, Icon } from '@cloudscape-design/components';
import React, { useState } from 'react';

interface LeaveRequest {
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    remark: string;
}

const LeaveRequest: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Add validation states for each field
    const [touchedFields, setTouchedFields] = useState({
        leaveType: false,
        startDate: false,
        endDate: false,
        reason: false
    });

    const leaveTypeOptions = [
        { label: 'Sick Leave', value: 'sick' },
        { label: 'Vacation', value: 'vacation' },
        { label: 'Personal Leave', value: 'personal' },
        { label: 'Other', value: 'other' },
    ];

    // Reset form function
    const resetForm = () => {
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        setTouchedFields({
            leaveType: false,
            startDate: false,
            endDate: false,
            reason: false
        });
    };

    // Close modal function
    const closeModal = () => {
        setIsModalVisible(false);
        resetForm();
        setError('');
        setSuccess('');
    };

    // Validation function
    const validateForm = () => {
        // Mark all fields as touched for validation
        setTouchedFields({
            leaveType: true,
            startDate: true,
            endDate: true,
            reason: true
        });

        // Validate form fields
        if (!leaveType || !startDate || !endDate || !reason) {
            setError('Please fill in all required fields.');
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError('End date must be after the start date.');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Static implementation - directly add to state without API
            const newRequest: LeaveRequest = {
                id: Date.now().toString(), // Generate a unique ID
                leaveType: leaveTypeOptions.find(option => option.value === leaveType)?.label || leaveType,
                startDate,
                endDate,
                reason,
                status: 'Pending', // Default status
                remark: '', // Default remark
            };
            
            setLeaveRequests([...leaveRequests, newRequest]);
            console.log('Leave request submitted:', newRequest);

            // Clear form and show success message
            resetForm();
            setSuccess('Leave request submitted successfully!');
            
            // Keep modal open to show success message
            // User can close it after seeing the success message
        } catch (err) {
            console.error('Error submitting leave request:', err);
            setError('Failed to submit leave request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to clear alerts
    const dismissAlert = () => {
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <Box padding="l">
                <Header><h1 style={{marginBottom: '40px'}}>Leave Requests</h1></Header>

                {/* My Requests Section */}
                <Box margin={{ bottom: 'xl' }}>
                    <SpaceBetween size="l" direction="horizontal">
                        <Header><h3 style={{marginBottom: '30px'}}>My Requests</h3></Header>
                        {/* Add Request Button */}
                        <Button variant="primary" onClick={() => setIsModalVisible(true)}>
                            <Icon name="add-plus" /> Make Leave Request
                        </Button>
                    </SpaceBetween>
                    <Table
                        columnDefinitions={[
                            { 
                                header: 'Leave Type', 
                                cell: (item) => item.leaveType,
                                minWidth: 150,
                                width: 150
                            },
                            { 
                                header: 'Start Date', 
                                cell: (item) => item.startDate,
                                minWidth: 100,
                                width: 100
                            },
                            { 
                                header: 'End Date', 
                                cell: (item) => item.endDate,
                                minWidth: 100,
                                width: 100
                            },
                            { 
                                header: 'Reason', 
                                cell: (item) => (
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
                                header: 'Status', 
                                cell: (item) => item.status,
                                minWidth: 150,
                                width: 150
                            },
                            { 
                                header: 'Remark', 
                                cell: (item) => (
                                    <div 
                                        style={{ 
                                            maxWidth: "200px", 
                                            whiteSpace: "nowrap", 
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis",
                                            cursor: "default" 
                                        }}
                                        title={item.remark}
                                        >
                                        {item.remark}
                                    </div>
                                ),
                                minWidth: 200,
                                width: 200
                            },
                        ]}
                        items={leaveRequests}
                        loading={loading}
                        empty="No leave requests found."
                    />
                </Box>

                {/* Add Request Modal */}
                <Modal
                    onDismiss={closeModal}
                    visible={isModalVisible}
                    header="Add Leave Request"
                    footer={
                        <Box float="right">
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button variant="link" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button variant="primary" loading={loading} onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                >
                    <Form>
                        <SpaceBetween size="l">
                            {error && (
                                <Alert 
                                    type="error" 
                                    dismissible
                                    onDismiss={dismissAlert}
                                >
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert 
                                    type="success" 
                                    dismissible
                                    onDismiss={dismissAlert}
                                >
                                    {success}
                                </Alert>
                            )}

                            <FormField 
                                label="Leave Type" 
                                description="Select the type of leave you are requesting."
                                errorText={touchedFields.leaveType && !leaveType ? "Leave type is required" : undefined}
                            >
                                <Select
                                    selectedOption={leaveTypeOptions.find((option) => option.value === leaveType) || null}
                                    onChange={({ detail }) => {
                                        setLeaveType(detail.selectedOption?.value || '');
                                        setTouchedFields({...touchedFields, leaveType: true});
                                    }}
                                    options={leaveTypeOptions}
                                    placeholder="Choose a leave type"
                                />
                            </FormField>

                            <FormField 
                                label="Start Date" 
                                description="Select the start date of your leave."
                                errorText={touchedFields.startDate && !startDate ? "Start date is required" : undefined}
                            >
                                <DatePicker
                                    onChange={({ detail }) => {
                                        setStartDate(detail.value);
                                        setTouchedFields({...touchedFields, startDate: true});
                                    }}
                                    value={startDate}
                                    placeholder="YYYY/MM/DD"
                                />
                            </FormField>

                            <FormField 
                                label="End Date" 
                                description="Select the end date of your leave."
                                errorText={touchedFields.endDate && !endDate ? "End date is required" : undefined}
                            >
                                <DatePicker
                                    onChange={({ detail }) => {
                                        setEndDate(detail.value);
                                        setTouchedFields({...touchedFields, endDate: true});
                                    }}
                                    value={endDate}
                                    placeholder="YYYY/MM/DD"
                                />
                            </FormField>

                            <FormField 
                                label="Reason for Leave" 
                                description="Provide a reason for your leave request."
                                errorText={touchedFields.reason && !reason ? "Reason is required" : undefined}
                            >
                                <Input
                                    value={reason}
                                    onChange={({ detail }) => {
                                        setReason(detail.value);
                                        setTouchedFields({...touchedFields, reason: true});
                                    }}
                                    placeholder="Enter reason"
                                />
                            </FormField>
                        </SpaceBetween>
                    </Form>
                </Modal>
            </Box>
        </div>
    );
};

export default LeaveRequest;
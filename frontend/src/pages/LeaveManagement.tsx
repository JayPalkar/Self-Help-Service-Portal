import { Box, Header, Table, Button, Textarea, SpaceBetween, Alert, Icon, Modal } from '@cloudscape-design/components';
import React, { useState } from 'react';

interface LeaveRequest {
    id: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    additionalNotes: string;
    status: string;
    remark: string;
}

const LeaveManagement: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
        {
            id: '1',
            employeeName: 'John Doe',
            leaveType: 'Sick Leave',
            startDate: '2023-10-01',
            endDate: '2023-10-03',
            reason: 'Feeling unwell',
            additionalNotes: 'Will visit the doctor.',
            status: 'Pending',
            remark: '',
        },
        {
            id: '2',
            employeeName: 'Jane Smith',
            leaveType: 'Vacation',
            startDate: '2023-10-10',
            endDate: '2023-10-15',
            reason: 'Family trip',
            additionalNotes: '',
            status: 'Pending',
            remark: '',
        },
        {
            id: '3',
            employeeName: 'Alice Johnson',
            leaveType: 'Personal Leave',
            startDate: '2023-09-20',
            endDate: '2023-09-21',
            reason: 'Family event',
            additionalNotes: '',
            status: 'Approved',
            remark: 'Approved by manager',
        },
        {
            id: '4',
            employeeName: 'Bob Brown',
            leaveType: 'Sick Leave',
            startDate: '2023-09-15',
            endDate: '2023-09-16',
            reason: 'Cold and fever',
            additionalNotes: '',
            status: 'Rejected',
            remark: 'Insufficient staff available on those days',
        },
    ]);

    const [activeView, setActiveView] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [remark, setRemark] = useState('');
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
    const [alerts, setAlerts] = useState<{ type: 'success' | 'error'; message: string }[]>([]);

    const filteredLeaveRequests = leaveRequests.filter(request => {
        if (activeView === 'pending') return request.status === 'Pending';
        if (activeView === 'approved') return request.status === 'Approved';
        if (activeView === 'rejected') return request.status === 'Rejected';
        return true;
    });

    const openApproveModal = (id: string) => {
        setSelectedRequestId(id);
        setPendingAction('approve');
        setRemark('');
        setIsActionModalVisible(true);
    };

    const openRejectModal = (id: string) => {
        setSelectedRequestId(id);
        setPendingAction('reject');
        setRemark('');
        setIsActionModalVisible(true);
    };

    const handleConfirmAction = () => {
        if (!selectedRequestId || !pendingAction) return;

        const updatedRequests = leaveRequests.map((request) =>
            request.id === selectedRequestId 
                ? { 
                    ...request, 
                    status: pendingAction === 'approve' ? 'Approved' : 'Rejected',
                    remark: remark.trim() === '' ? 'No remark provided' : remark
                } 
                : request
        );
        
        setLeaveRequests(updatedRequests);
        setAlerts([
            ...alerts, 
            { 
                type: 'success', 
                message: `Leave request ${selectedRequestId} ${pendingAction === 'approve' ? 'approved' : 'rejected'}.` 
            }
        ]);
        
        setIsActionModalVisible(false);
        setSelectedRequestId(null);
        setPendingAction(null);
        setRemark('');
        
        setActiveView(pendingAction === 'approve' ? 'approved' : 'rejected');
    };

    const renderRemarkCell = (item: LeaveRequest) => {
        return (
            <div
                style={{
                    maxWidth: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                title={item.remark}
            >
                {item.status === 'Pending' ? 
                    'Pending action' : 
                    (item.remark || 'No remarks')}
            </div>
        );
    };

    const getColumnDefinitions = () => {
        const baseColumns = [
            { 
                header: 'Employee Name', 
                cell: (item: LeaveRequest) => item.employeeName,
                minWidth: 150,
                width: 150
            },
            { 
                header: 'Leave Type', 
                cell: (item: LeaveRequest) => item.leaveType,
                minWidth: 150,
                width: 150
            },
            { 
                header: 'Start Date',
                cell: (item: LeaveRequest) => item.startDate,
                minWidth: 100,
                width: 100
            },
            { 
                header: 'End Date',
                cell: (item: LeaveRequest) => item.endDate,
                minWidth: 100,
                width: 100
            },
            { 
                header: 'Reason',
                cell: (item: LeaveRequest) => (
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
                minWidth: 150,
                width: 150
            },
            { 
                header: 'Status',
                cell: (item: LeaveRequest) => item.status,
                minWidth: 100,
                width: 100
            },
            {
                header: 'Remark',
                cell: renderRemarkCell,
            },
        ];

        if (activeView === 'pending') {
            baseColumns.push({
                header: 'Actions',
                cell: (item: LeaveRequest) => (
                    <SpaceBetween direction="horizontal" size="xxs">
                        <Button
                            variant="primary"
                            onClick={() => openApproveModal(item.id)}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => openRejectModal(item.id)}
                        >
                            Reject
                        </Button>
                    </SpaceBetween>
                ),
                minWidth: 240,
                width: 240
            });
        }

        return baseColumns;
    };

    return (
        <div>
            <Box padding="l">
                <Header><h1>Leave Management</h1></Header>
                
                <SpaceBetween size="m" direction="vertical">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button
                            variant={activeView === 'pending' ? 'primary' : 'normal'}
                            onClick={() => setActiveView('pending')}
                        >
                            <Icon name="file-open" /> Pending Requests
                        </Button>
                        <Button
                            variant={activeView === 'approved' ? 'primary' : 'normal'}
                            onClick={() => setActiveView('approved')}
                        >
                            <Icon name="check" /> Approved Requests
                        </Button>
                        <Button
                            variant={activeView === 'rejected' ? 'primary' : 'normal'}
                            onClick={() => setActiveView('rejected')}
                        >
                            <Icon name="close" /> Rejected Requests
                        </Button>
                    </SpaceBetween>

                    <SpaceBetween size="m" direction="vertical">
                        {alerts.map((alert, index) => (
                            <Alert
                                key={index}
                                type={alert.type}
                                dismissible
                                onDismiss={() => setAlerts(alerts.filter((_, i) => i !== index))}
                            >
                                {alert.message}
                            </Alert>
                        ))}
                    </SpaceBetween>

                    <h2 style={{ margin: '15px 2px' }}>
                        {activeView === 'pending' && 'Pending Leave Requests'}
                        {activeView === 'approved' && 'Approved Leave Requests'}
                        {activeView === 'rejected' && 'Rejected Leave Requests'}
                        <Icon name="file" />
                    </h2>

                    <Table
                        columnDefinitions={getColumnDefinitions()}
                        items={filteredLeaveRequests}
                        loading={false}
                        empty={`No ${activeView} leave requests found.`}
                    />
                </SpaceBetween>

                <Modal
                    onDismiss={() => setIsActionModalVisible(false)}
                    visible={isActionModalVisible}
                    header={pendingAction === 'approve' ? "Approve Leave Request" : "Reject Leave Request"}
                    footer={
                        <Box float="right">
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button variant="link" onClick={() => setIsActionModalVisible(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleConfirmAction}>
                                    {pendingAction === 'approve' ? "Approve" : "Reject"}
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                >
                    <SpaceBetween direction="vertical" size="m">
                        <div>
                            {pendingAction === 'approve' 
                                ? "Please provide a remark for approving this leave request." 
                                : "Please provide a reason for rejecting this leave request."}
                        </div>
                        <Textarea
                            value={remark}
                            onChange={({ detail }) => setRemark(detail.value)}
                            placeholder={pendingAction === 'approve' 
                                ? "Enter approval remark" 
                                : "Enter rejection reason"}
                        />
                    </SpaceBetween>
                </Modal>
            </Box>
        </div>
    );
};

export default LeaveManagement;
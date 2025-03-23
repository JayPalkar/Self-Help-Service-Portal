import { Box, Header, Table, Select, Button, SpaceBetween, Input } from '@cloudscape-design/components';
import React, { useState, useEffect } from 'react';

interface Payment {
  id: number;
  name: string;
  team: string;
  upiId: string;
  stipend: number;
  status: 'paid' | 'unpaid';
  transactionId: string;
}

interface Summary {
  totalEmployees: number;
  paidEmployees: number;
  unpaidEmployees: number;
  totalFundDisbursed: number;
}

const FinancePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [filterTeam, setFilterTeam] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'paid' | 'unpaid' | null>(null);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false); // Track changes

  // Simulated payment data for different months
  const mockPaymentData: Record<string, Payment[]> = {
    '2023-10': [
      { id: 1, name: 'John Doe', team: 'Engineering', upiId: 'john.doe@upi', stipend: 1000, status: 'unpaid', transactionId: '' },
      { id: 2, name: 'Jane Smith', team: 'Design', upiId: 'jane.smith@upi', stipend: 1200, status: 'paid', transactionId: 'txn12345' },
    ],
    '2023-09': [
      { id: 3, name: 'Alice Johnson', team: 'Marketing', upiId: 'alice.johnson@upi', stipend: 1100, status: 'unpaid', transactionId: '' },
    ],
  };

  useEffect(() => {
    // Simulate fetching payment data for the selected month
    setPaymentData(mockPaymentData[selectedMonth] || []);
    setIsDataChanged(false); // Reset changes when month changes
  }, [selectedMonth]);

  const handleStatusUpdate = (id: number, status: 'paid' | 'unpaid', transactionId: string) => {
    if (status === 'paid' && !transactionId) {
      alert('Please enter a Transaction ID.');
      return;
    }
    setPaymentData((prevData) =>
      prevData.map((payment) =>
        payment.id === id
          ? { ...payment, status, transactionId: status === 'paid' ? transactionId : '' }
          : payment
      )
    );
    setIsDataChanged(true); // Mark data as changed
  };

  const handleTransactionIdChange = (id: number, value: string) => {
    setPaymentData((prevData) =>
      prevData.map((payment) =>
        payment.id === id ? { ...payment, transactionId: value } : payment
      )
    );
    setIsDataChanged(true); // Mark data as changed
  };

  const handleSave = () => {
    // Simulate saving the updated payment data
    console.log('Updated Payment Data:', paymentData);
    alert('Changes saved successfully!');
    setIsDataChanged(false); // Reset changes after saving
  };

  // Filter payment data based on selected team and status
  const filteredPaymentData = paymentData.filter((payment) => {
    const matchesTeam = filterTeam ? payment.team === filterTeam : true;
    const matchesStatus = filterStatus ? payment.status === filterStatus : true;
    return matchesTeam && matchesStatus;
  });

  const summary: Summary = {
    totalEmployees: paymentData.length,
    paidEmployees: paymentData.filter((payment) => payment.status === 'paid').length,
    unpaidEmployees: paymentData.filter((payment) => payment.status === 'unpaid').length,
    totalFundDisbursed: paymentData.reduce((sum, payment) => sum + (payment.status === 'paid' ? payment.stipend : 0), 0),
  };

  // Get unique teams for the filter dropdown
  const uniqueTeams = Array.from(new Set(paymentData.map((payment) => payment.team)));

  return (
    <Box padding="l">
      <Header>
        <h1>Finance Management</h1>
      </Header>
      <Box margin={{ bottom: 'xl', top: 'l' }}>
        <h2 style={{ marginBottom: '10px' }}>Select Year</h2>
        <Select
          selectedOption={{ value: selectedMonth, label: selectedMonth }}
          onChange={({ detail }) => {
            const selectedValue = detail.selectedOption.value;
            if (selectedValue) {
              setSelectedMonth(selectedValue);
            }
          }}
          options={Object.keys(mockPaymentData).map((month) => ({ value: month, label: month }))}
          placeholder="Select month"
        />
      </Box>
      {/* Four Blue Cards */}
      <Box margin={{ bottom: 'xxl' }}>
        <SpaceBetween size="l" direction="horizontal">
          <div style={{ backgroundColor: '#d1e9ff', borderRadius: '8px', textAlign: 'center', padding: '16px', flex: 1 }}>
            <Box>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>No. of Employees</div>
              <div style={{ fontSize: '1.5em', marginTop: '20px', padding: '5px' }}>{summary.totalEmployees}</div>
            </Box>
          </div>
          <div style={{ backgroundColor: '#d1e9ff', borderRadius: '8px', textAlign: 'center', padding: '16px', flex: 1 }}>
            <Box>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Employees Paid</div>
              <div style={{ fontSize: '1.5em', marginTop: '20px', padding: '5px' }}>{summary.paidEmployees}</div>
            </Box>
          </div>
          <div style={{ backgroundColor: '#d1e9ff', borderRadius: '8px', textAlign: 'center', padding: '16px', flex: 1 }}>
            <Box>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Employees Unpaid</div>
              <div style={{ fontSize: '1.5em', marginTop: '20px', padding: '5px' }}>{summary.unpaidEmployees}</div>
            </Box>
          </div>
          <div style={{ backgroundColor: '#d1e9ff', borderRadius: '8px', textAlign: 'center', padding: '16px', flex: 1 }}>
            <Box>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Total Fund Disbursed</div>
              <div style={{ fontSize: '1.5em', marginTop: '20px', padding: '5px' }}>${summary.totalFundDisbursed}</div>
            </Box>
          </div>
        </SpaceBetween>
      </Box>
      {/* Filters and Save Button in the same row */}
      <Box margin={{ bottom: 'l' }}>
        <SpaceBetween size="m" direction="horizontal">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isDataChanged}
          >
            Save Changes
          </Button>
          <SpaceBetween size="m" direction="horizontal">
            <Select
              selectedOption={filterTeam ? { value: filterTeam, label: filterTeam } : null}
              onChange={({ detail }) => setFilterTeam(detail.selectedOption.value || null)}
              options={[
                { value: '', label: 'All Teams' },
                ...uniqueTeams.map((team) => ({ value: team, label: team })),
              ]}
              placeholder="Filter by Team"
            />
            <Select
              selectedOption={filterStatus ? { value: filterStatus, label: filterStatus } : null}
              onChange={({ detail }) => setFilterStatus(detail.selectedOption.value as 'paid' | 'unpaid' | null)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
              ]}
              placeholder="Filter by Status"
            />
          </SpaceBetween>
        </SpaceBetween>
      </Box>
      <Table
        columnDefinitions={[
          { id: 'name', header: 'Name', cell: (item) => item.name },
          { id: 'team', header: 'Team', cell: (item) => item.team },
          { id: 'upiId', header: 'UPI ID', cell: (item) => item.upiId },
          { id: 'stipend', header: 'Stipend', cell: (item) => `$${item.stipend}` },
          { id: 'status', header: 'Status', cell: (item) => item.status },
          { id: 'transactionId', header: 'Transaction ID', cell: (item) => item.transactionId },
          {
            id: 'actions',
            header: 'Actions',
            cell: (item) => (
              <SpaceBetween size="s" direction="horizontal">
                {item.status === 'unpaid' ? (
                  <>
                    <Input
                      value={item.transactionId}
                      onChange={({ detail }) => handleTransactionIdChange(item.id, detail.value)}
                      placeholder="Enter Transaction ID"
                    />
                    <Button
                      onClick={() => handleStatusUpdate(item.id, 'paid', item.transactionId)}
                    >
                      Mark as Paid
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleStatusUpdate(item.id, 'unpaid', '')}
                  >
                    Mark as Unpaid
                  </Button>
                )}
              </SpaceBetween>
            ),
          },
        ]}
        items={filteredPaymentData}
      />
    </Box>
  );
};

export default FinancePage;
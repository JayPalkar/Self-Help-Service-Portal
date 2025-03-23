import React, { useState, useEffect } from 'react';
import {
  Box, 
  Header,
  Container,
  Cards,
  SpaceBetween,
  Button,
  ColumnLayout,
  Badge,
  Modal,
  FormField,
  Input,
  Textarea,
  Select,
  Table,
  Multiselect,
  Alert,
  Icon
} from '@cloudscape-design/components';

// Types
interface Employee {
  id: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  employees: Employee[];
  manager: Employee | null;
  projects: Project[];
}

interface AlertState {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface FormErrorState {
  name: boolean;
  description: boolean;
  employees: boolean;
  manager: boolean;
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Frontend Team',
      description: 'Responsible for all UI/UX implementation',
      employees: [
        { id: '101', name: 'John Doe', role: 'Developer' },
        { id: '102', name: 'Jane Smith', role: 'Designer' }
      ],
      manager: { id: '103', name: 'Mike Johnson', role: 'Manager' },
      projects: [
        { id: 'p1', name: 'Website Redesign', status: 'In Progress' },
        { id: 'p2', name: 'Mobile App', status: 'Planning' }
      ]
    },
    {
      id: '2',
      name: 'Backend Team',
      description: 'API and database development',
      employees: [
        { id: '104', name: 'Alex Brown', role: 'Developer' },
        { id: '105', name: 'Sarah Wilson', role: 'Developer' }
      ],
      manager: { id: '106', name: 'David Miller', role: 'Manager' },
      projects: [
        { id: 'p3', name: 'API Gateway', status: 'In Progress' },
        { id: 'p4', name: 'Database Migration', status: 'Planning' }
      ]
    },
    {
      id: '3',
      name: 'Data Science',
      description: 'Analytics and machine learning',
      employees: [
        { id: '107', name: 'Emily Davis', role: 'Data Scientist' },
        { id: '108', name: 'Ryan Taylor', role: 'ML Engineer' }
      ],
      manager: { id: '109', name: 'Lisa Anderson', role: 'Manager' },
      projects: [
        { id: 'p5', name: 'Customer Segmentation', status: 'In Progress' },
        { id: 'p6', name: 'Predictive Analysis', status: 'Planning' }
      ]
    }
  ]);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(true); // In real app, would come from auth context
  
  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Form state
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    employees: [] as Employee[],
    manager: null as Employee | null
  });
  
  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    type: 'success',
    message: ''
  });
  
  // Form validation alert state (specifically for the modal)
  const [formAlert, setFormAlert] = useState<AlertState>({
    visible: false,
    type: 'error',
    message: ''
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<FormErrorState>({
    name: false,
    description: false,
    employees: false,
    manager: false
  });
  
  // Fetch employees from API
  useEffect(() => {
    // This will be replaced with actual API call
    // fetchEmployees().then(data => setEmployees(data));
    
    // Mock data for now
    setEmployees([
      { id: '101', name: 'John Doe', role: 'Developer' },
      { id: '102', name: 'Jane Smith', role: 'Designer' },
      { id: '103', name: 'Mike Johnson', role: 'Manager' },
      { id: '104', name: 'Alex Brown', role: 'Developer' },
      { id: '105', name: 'Sarah Wilson', role: 'Developer' },
      { id: '106', name: 'David Miller', role: 'Manager' },
      { id: '107', name: 'Emily Davis', role: 'Data Scientist' },
      { id: '108', name: 'Ryan Taylor', role: 'ML Engineer' },
      { id: '109', name: 'Lisa Anderson', role: 'Manager' }
    ]);
    
    // Mock projects data
    setProjects([
      { id: 'p1', name: 'Website Redesign', status: 'In Progress' },
      { id: 'p2', name: 'Mobile App', status: 'Planning' },
      { id: 'p3', name: 'API Gateway', status: 'In Progress' },
      { id: 'p4', name: 'Database Migration', status: 'Planning' },
      { id: 'p5', name: 'Customer Segmentation', status: 'In Progress' },
      { id: 'p6', name: 'Predictive Analysis', status: 'Planning' }
    ]);
  }, []);

  const validateForm = () => {
    const errors = {
      name: !newTeam.name.trim(),
      description: !newTeam.description.trim(),
      employees: newTeam.employees.length === 0,
      manager: newTeam.manager === null
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  const handleCreateTeam = () => {
    if (!validateForm()) {
      // Set form alert instead of the page alert
      setFormAlert({
        visible: true,
        type: 'error',
        message: 'All fields are mandatory. Please fill in all required fields.'
      });
      return;
    }
    
    const teamToAdd: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      employees: newTeam.employees,
      manager: newTeam.manager,
      projects: []
    };
    
    setTeams([...teams, teamToAdd]);
    setCreateModalVisible(false);
    setNewTeam({ name: '', description: '', employees: [], manager: null });
    
    // Reset form alert when closing the modal
    setFormAlert({
      visible: false,
      type: 'error',
      message: ''
    });
    
    // Set success alert for the page
    setAlert({
      visible: true,
      type: 'success',
      message: 'Team created successfully!'
    });
  };
  
  const viewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setViewModalVisible(true);
  };
  
  // Reset form alert when modal is dismissed
  const handleModalDismiss = () => {
    setCreateModalVisible(false);
    setFormAlert({
      visible: false,
      type: 'error',
      message: ''
    });
  };
  
  // Custom styles for the card header and projects section
  const cardHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 16px 0'
  };
  
  const projectsSectionStyle = {
    marginTop: '12px',
    marginBottom: '12px'
  };
  
  const projectsHeaderStyle = {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#0972d3'
  };
  
  const individualProjectStyle = {
    border: '2px solid #0972d3',
    borderRadius: '6px',
    padding: '8px 12px',
    margin: '6px 0',
    backgroundColor: 'rgba(9, 114, 211, 0.05)',
    display: 'inline-block',
    marginRight: '8px'
  };
  
  // Function to get border color based on project status
  const getProjectBorderColor = (status: string) => {
    switch(status) {
      case 'In Progress':
        return '#0972d3'; // Blue
      case 'Planning':
        return '#16a34a'; // Green
      case 'Completed':
        return '#7d69f0'; // Purple
      default:
        return '#f5a700'; // Orange/Amber
    }
  };
  
  return (
    <Container>
      <SpaceBetween size="l">
        {alert.visible && (
          <Alert
            type={alert.type}
            dismissible
            onDismiss={() => setAlert({ ...alert, visible: false })}
          >
            {alert.message}
          </Alert>
        )}
        
        <Header
          actions={
            isAdmin && 
            <Button variant="primary" onClick={() => setCreateModalVisible(true)}>
              <Icon name='add-plus'/>Create Team
            </Button>
          }
        >
          <h1>Teams</h1>
        </Header>
        
        <Cards
          cardDefinition={{
            header: item => (
              <h1>{item.name}</h1>
            ),
            sections: [
              {
                id: 'description',
                content: item => (
                  <p style={{marginBottom: '15px'}}>{item.description}</p>
                )
              },
              {
                id: 'projects',
                header: <h2 style={projectsHeaderStyle}>Projects</h2>,
                content: item => (
                  <div style={projectsSectionStyle}>
                    {item.projects.length > 0 
                      ? (
                        <div>
                          {item.projects.map(project => (
                            <div 
                              key={project.id} 
                              style={{
                                ...individualProjectStyle,
                                borderColor: getProjectBorderColor(project.status)
                              }}
                            >
                              {project.name}
                              <div style={{ fontSize: '0.85em', marginTop: '4px' }}>
                                <Badge color={project.status === 'In Progress' ? 'blue' : 'green'}>
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) 
                      : 'No projects assigned'}
                  </div>
                )
              },
              {
                id: 'actions',
                content: item => (
                  <Button onClick={() => viewTeamDetails(item)}>View details</Button>
                )
              }
            ]
          }}
          cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 2 },
            { minWidth: 992, cards: 3 }
          ]}
          items={teams}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No teams</b>
              <Box
                padding={{ bottom: "s" }}
                variant="p"
                color="inherit"
              >
                No teams to display.
              </Box>
              {isAdmin && (
                <Button
                  onClick={() => setCreateModalVisible(true)}
                >
                  Create team
                </Button>
              )}
            </Box>
          }
        />
      </SpaceBetween>
      
      {/* Create Team Modal */}
      {isAdmin && (
        <Modal
          visible={createModalVisible}
          header="Create new team"
          onDismiss={handleModalDismiss}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={handleModalDismiss}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateTeam}>
                  Create team
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          <SpaceBetween size="m">
            {/* Form validation alert inside the modal */}
            {formAlert.visible && (
              <Alert
                type={formAlert.type}
                dismissible
                onDismiss={() => setFormAlert({ ...formAlert, visible: false })}
              >
                {formAlert.message}
              </Alert>
            )}
            
            <FormField 
              label="Team name" 
              errorText={formErrors.name ? "Team name is required" : null}
            >
              <Input
                value={newTeam.name}
                onChange={({ detail }) => 
                  setNewTeam({...newTeam, name: detail.value})
                }
              />
            </FormField>
            
            <FormField 
              label="Description"
              errorText={formErrors.description ? "Description is required" : null}
            >
              <Textarea
                value={newTeam.description}
                onChange={({ detail }) => 
                  setNewTeam({...newTeam, description: detail.value})
                }
              />
            </FormField>
            
            <FormField 
              label="Team members"
              errorText={formErrors.employees ? "At least one employee is required" : null}
            >
              <Multiselect
                selectedOptions={newTeam.employees.map(emp => ({ 
                  label: `${emp.name} (${emp.role})`, 
                  value: emp.id 
                }))}
                options={employees.map(emp => ({ 
                  label: `${emp.name} (${emp.role})`, 
                  value: emp.id 
                }))}
                onChange={({ detail }) => {
                  const selectedEmployees = detail.selectedOptions.map(option => 
                    employees.find(emp => emp.id === option.value)
                  ).filter(Boolean) as Employee[];
                  
                  setNewTeam({
                    ...newTeam, 
                    employees: selectedEmployees
                  });
                }}
                placeholder="Select team members"
              />
            </FormField>
            
            <FormField 
              label="Team Manager (Head)"
              errorText={formErrors.manager ? "Manager is required" : null}
            >
              <Select
                selectedOption={newTeam.manager ? { 
                  label: `${newTeam.manager.name} (${newTeam.manager.role})`, 
                  value: newTeam.manager.id 
                } : null}
                options={employees
                  .filter(emp => emp.role === 'Manager')
                  .map(emp => ({ 
                    label: `${emp.name} (${emp.role})`, 
                    value: emp.id 
                  }))}
                onChange={({ detail }) => {
                  if (detail.selectedOption) {
                    const selectedManager = employees.find(
                      emp => emp.id === detail.selectedOption.value
                    ) || null;
                    
                    setNewTeam({
                      ...newTeam, 
                      manager: selectedManager
                    });
                  }
                }}
                placeholder="Select team manager"
              />
            </FormField>
          </SpaceBetween>
        </Modal>
      )}
      
      {/* View Team Details Modal */}
      <Modal
        visible={viewModalVisible}
        header="Team Details"
        onDismiss={() => setViewModalVisible(false)}
        footer={
          <Box float="right">
            <Button onClick={() => setViewModalVisible(false)}>Close</Button>
          </Box>
        }
        size="large"
      >
        {selectedTeam && (
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <SpaceBetween size="m">
                <div>
                  <Box variant="h3">Team Name</Box>
                  <p>{selectedTeam.name}</p>
                </div>
                
                <div>
                  <Box variant="h3">Description</Box>
                  <p>{selectedTeam.description}</p>
                </div>
                
                <div>
                  <Box variant="h3">Manager</Box>
                  <p>{selectedTeam.manager ? selectedTeam.manager.name : 'None assigned'}</p>
                </div>
              </SpaceBetween>
              
              <SpaceBetween size="m">
                <div>
                  <Box variant="h3">Team Size</Box>
                  <p>{selectedTeam.employees.length} employees</p>
                </div>
              </SpaceBetween>
            </ColumnLayout>
            
            <div>
              <Box variant="h3">Team Members</Box>
              <Table
                columnDefinitions={[
                  {
                    id: 'name',
                    header: 'Name',
                    cell: item => item.name,
                    sortingField: 'name'
                  },
                  {
                    id: 'role',
                    header: 'Role',
                    cell: item => item.role,
                    sortingField: 'role'
                  }
                ]}
                items={selectedTeam.employees}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No employees</b>
                    <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                      This team has no employees.
                    </Box>
                  </Box>
                }
              />
            </div>
            
            <div>
              <Box variant="h3">Active Projects</Box>
              <Table
                columnDefinitions={[
                  {
                    id: 'name',
                    header: 'Project Name',
                    cell: item => item.name,
                    sortingField: 'name'
                  },
                  {
                    id: 'status',
                    header: 'Status',
                    cell: item => item.status,
                    sortingField: 'status'
                  }
                ]}
                items={selectedTeam.projects}
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No projects</b>
                    <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                      No active projects for this team.
                    </Box>
                  </Box>
                }
              />
            </div>
          </SpaceBetween>
        )}
      </Modal>
    </Container>
  );
};

export default TeamsPage;
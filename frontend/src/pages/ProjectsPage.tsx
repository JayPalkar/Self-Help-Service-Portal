import React, { useState } from 'react';
import {
  Box,
  Header,
  Button,
  SpaceBetween,
  Cards,
  Modal,
  FormField,
  Input,
  Textarea,
  Multiselect,
  TextFilter,
  Alert,
  Container,
  Icon
} from '@cloudscape-design/components';

// Define types for our data structures
interface Project {
  id: number;
  name: string;
  description: string;
  teams: string[];
}

interface TeamOption {
  label: string;
  value: string;
}

// Type for our color mapping
interface ColorMapping {
  [key: string]: string;
}

// Type for form validation errors
interface FormErrors {
  name: boolean;
  description: boolean;
  teams: boolean;
}

// Type for alerts
interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  id: string;
  dismissible: boolean;
}

const ProjectsPage = () => {
  // State management with proper typing
  const [visible, setVisible] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedTeams, setSelectedTeams] = useState<TeamOption[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: false,
    description: false,
    teams: false
  });
  const [showValidationError, setShowValidationError] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  
  // Sample data for demonstration
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Cloud Migration', description: 'Migrate on-premises systems to AWS', teams: ['DevOps', 'Infrastructure'] },
    { id: 2, name: 'Mobile App', description: 'Develop cross-platform mobile application', teams: ['Mobile', 'UX Design'] },
    { id: 3, name: 'Data Pipeline', description: 'Build ETL processes for analytics', teams: ['Data Science', 'Backend'] }
  ]);
  
  // Sample teams
  const availableTeams: TeamOption[] = [
    { label: 'DevOps', value: 'DevOps' },
    { label: 'Infrastructure', value: 'Infrastructure' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'UX Design', value: 'UX Design' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Data Science', value: 'Data Science' }
  ];
  
  // Get team color based on team name with proper typing - RESTORED ORIGINAL COLORS
  const getTeamColor = (teamName: string): string => {
    const colors: ColorMapping = {
      'DevOps': '#0073BB',
      'Infrastructure': '#FF9900',
      'Mobile': '#D13212',
      'UX Design': '#8A2BE2',
      'Frontend': '#00A1C9',
      'Backend': '#1E8900',
      'Data Science': '#EC7211'
    };
    
    return colors[teamName] || '#888888';
  };
  
  // Validate form fields
  const validateForm = (): boolean => {
    const errors: FormErrors = {
      name: projectName.trim() === '',
      description: description.trim() === '',
      teams: selectedTeams.length === 0
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(value => value);
  };
  
  // Handle project creation
  const handleCreateProject = () => {
    if (validateForm()) {
      const newProject: Project = {
        id: projects.length + 1,
        name: projectName,
        description: description,
        teams: selectedTeams.map(team => team.value)
      };
      
      setProjects([...projects, newProject]);
      setVisible(false);
      resetForm();
      
      // Show success alert
      addAlert({
        type: 'success',
        message: `Project "${projectName}" was successfully created.`,
        id: `create-success-${Date.now()}`,
        dismissible: true
      });
    } else {
      setShowValidationError(true);
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setSelectedTeams([]);
    setFormErrors({
      name: false,
      description: false,
      teams: false
    });
    setShowValidationError(false);
  };
  
  // Add alert
  const addAlert = (alert: AlertMessage) => {
    setAlerts(prev => [...prev, alert]);
  };
  
  // Dismiss alert
  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Dismiss validation error
  const dismissValidationError = () => {
    setShowValidationError(false);
  };
  
  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    project.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
    project.teams.some(team => team.toLowerCase().includes(searchFilter.toLowerCase()))
  );
  
  // Custom styles matching TeamsPage styles
  const cardHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 16px 0'
  };
  
  const teamsSectionStyle = {
    marginTop: '12px',
    marginBottom: '12px'
  };
  
  const teamsHeaderStyle = {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#0972d3'
  };
  
  const individualTeamStyle = {
    border: '2px solid', // Border color will be set dynamically
    borderRadius: '6px',
    padding: '8px 12px',
    margin: '6px 0',
    backgroundColor: 'rgba(9, 114, 211, 0.05)',
    display: 'inline-block',
    marginRight: '8px'
  };
  
  return (
    <Container>
      <SpaceBetween size="l">
        {/* Alerts section */}
        {alerts.length > 0 && (
          <div>
            {alerts.map(alert => (
              <Alert
                key={alert.id}
                type={alert.type}
                dismissible={alert.dismissible}
                onDismiss={() => dismissAlert(alert.id)}
                dismissAriaLabel="Close alert"
              >
                {alert.message}
              </Alert>
            ))}
          </div>
        )}
        
        <Header
          actions={
            <Button variant="primary" onClick={() => setVisible(true)}>
              <Icon name='add-plus'/>Create New Project
            </Button>
          }
        >
          <h1>Projects</h1>
        </Header>
        
        {/* Search Filter */}
        <TextFilter
          filteringText={searchFilter}
          onChange={({ detail }) => setSearchFilter(detail.filteringText)}
          countText={`${filteredProjects.length} projects`}
          filteringPlaceholder="Search projects by name, description or team"
        />
        
        {/* Projects Grid */}
        <Cards
          cardDefinition={{
            header: item => (
              <h1>{item.name}</h1>
            ),
            sections: [
              {
                id: "description",
                content: item => (
                  <p style={{marginBottom: '15px'}}>{item.description}</p>
                )
              },
              {
                id: "teams",
                header: <h2 style={teamsHeaderStyle}>Teams</h2>,
                content: item => (
                  <div style={teamsSectionStyle}>
                    {item.teams.length > 0 
                      ? (
                        <div>
                          {item.teams.map(team => (
                            <div 
                              key={team} 
                              style={{
                                ...individualTeamStyle,
                                borderColor: getTeamColor(team),
                                backgroundColor: `${getTeamColor(team)}10` // Very light version of the team color
                              }}
                            >
                              {team}
                            </div>
                          ))}
                        </div>
                      ) 
                      : 'No teams assigned'}
                  </div>
                )
              }
            ]
          }}
          cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 2 },
            { minWidth: 992, cards: 3 }
          ]}
          items={filteredProjects}
          loadingText="Loading projects"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No projects</b>
              <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                No projects to display.
              </Box>
              <Button onClick={() => setVisible(true)}>Create New Project</Button>
            </Box>
          }
        />
      </SpaceBetween>
      
      {/* Create Project Modal */}
      <Modal
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          resetForm();
        }}
        header="Create New Project"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setVisible(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateProject}>
                Create Project
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          {/* Validation Error Alert - Now Dismissible */}
          {showValidationError && (
            <Alert
              type="error"
              header="Required information missing"
              dismissible={true}
              onDismiss={dismissValidationError}
              dismissAriaLabel="Close validation error"
            >
              All fields are required. Please fill in all the required information.
            </Alert>
          )}
          
          <FormField
            label="Project Name"
            description="Enter a descriptive name for your project"
            errorText={formErrors.name ? "Project name is required" : undefined}
          >
            <Input
              value={projectName}
              onChange={({ detail }) => {
                setProjectName(detail.value);
                if (detail.value.trim() !== '') {
                  setFormErrors(prev => ({ ...prev, name: false }));
                }
              }}
              invalid={formErrors.name}
            />
          </FormField>
          
          <FormField
            label="Description"
            description="Briefly describe the purpose of this project"
            errorText={formErrors.description ? "Description is required" : undefined}
          >
            <Textarea
              value={description}
              onChange={({ detail }) => {
                setDescription(detail.value);
                if (detail.value.trim() !== '') {
                  setFormErrors(prev => ({ ...prev, description: false }));
                }
              }}
              invalid={formErrors.description}
              rows={3}
            />
          </FormField>
          
          <FormField
            label="Add Teams"
            description="Select the teams that will work on this project"
            errorText={formErrors.teams ? "At least one team is required" : undefined}
          >
            <Multiselect
              selectedOptions={selectedTeams}
              onChange={({ detail }) => {
                setSelectedTeams([...detail.selectedOptions] as TeamOption[]);
                if (detail.selectedOptions.length > 0) {
                  setFormErrors(prev => ({ ...prev, teams: false }));
                }
              }}
              options={availableTeams}
              placeholder="Select teams"
              invalid={formErrors.teams}
            />
          </FormField>
        </SpaceBetween>
      </Modal>
    </Container>
  );
};

export default ProjectsPage;
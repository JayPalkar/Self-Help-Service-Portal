import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SpaceBetween,
  ColumnLayout,
  Table,
  Header,
  Badge
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

const MyTeam = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to fetch the current employee's team
    // For demonstration purposes, we're using mock data
    
    // Simulating API call delay
    setTimeout(() => {
      // Mock data based on the format from the original code
      const mockTeam: Team = {
        id: '1',
        name: 'Frontend Team',
        description: 'Responsible for all UI/UX implementation',
        employees: [
          { id: '101', name: 'John Doe', role: 'Developer' },
          { id: '102', name: 'Jane Smith', role: 'Designer' },
          { id: '110', name: 'Current User', role: 'Developer' } // This would be the current user
        ],
        manager: { id: '103', name: 'Mike Johnson', role: 'Manager' },
        projects: [
          { id: 'p1', name: 'Website Redesign', status: 'In Progress' },
          { id: 'p2', name: 'Mobile App', status: 'Planning' }
        ]
      };
      
      setTeam(mockTeam);
      setLoading(false);
    }, 1000);
  }, []);

  // Custom styles for projects
  const projectItemStyle = (status: string) => {
    const getBorderColor = () => {
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

    return {
      border: `2px solid ${getBorderColor()}`,
      borderRadius: '6px',
      padding: '8px 12px',
      margin: '6px 0',
      backgroundColor: 'rgba(9, 114, 211, 0.05)',
      display: 'inline-block',
      marginRight: '8px'
    };
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xl">
          Loading team details...
        </Box>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container>
        <Box textAlign="center" padding="xl">
          You are not currently assigned to a team.
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <SpaceBetween size="l">
        <Header>
          <h1>My Team: {team.name}</h1>
        </Header>

        <SpaceBetween size="l">
          <ColumnLayout columns={2}>
            <SpaceBetween size="m">
              <div>
                <Box variant="h3">Team Name</Box>
                <p>{team.name}</p>
              </div>
              
              <div>
                <Box variant="h3">Description</Box>
                <p>{team.description}</p>
              </div>
            </SpaceBetween>
            
            <SpaceBetween size="m">
              <div>
                <Box variant="h3">Team Size</Box>
                <p>{team.employees.length} employees</p>
              </div>

              <div>
                <Box variant="h3">Manager</Box>
                <p>{team.manager ? team.manager.name : 'None assigned'}</p>
              </div>
            </SpaceBetween>
          </ColumnLayout>
            <div>
                <Box variant="h3">Active Projects</Box>
                <div style={{ marginTop: '8px' }}>
                  {team.projects.map(project => (
                    <div 
                      key={project.id} 
                      style={projectItemStyle(project.status)}
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
            </div>
          
          <div>
            <Box variant="h3">Team Members</Box>
            <Table
              columnDefinitions={[
                {
                  id: 'name',
                  header: 'Name',
                  cell: item => item.name === 'Current User' ? 
                    <span style={{ fontWeight: 'bold' }}>{item.name} (You)</span> : 
                    item.name,
                  sortingField: 'name'
                },
                {
                  id: 'role',
                  header: 'Role',
                  cell: item => item.role,
                  sortingField: 'role'
                }
              ]}
              items={team.employees}
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No team members</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    This team has no members.
                  </Box>
                </Box>
              }
            />
          </div>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
};

export default MyTeam;
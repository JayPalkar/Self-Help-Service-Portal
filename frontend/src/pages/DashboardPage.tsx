import React, { useEffect, useState } from 'react';
import { SpaceBetween, Header, Cards, Box } from '@cloudscape-design/components';

interface User {
  role: string;
  // Add other user properties as needed
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual authentication logic
    const fetchUserData = async () => {
      try {
        // Example: const userData = await Auth.currentAuthenticatedUser();
        // This is a placeholder - implement your actual auth check
        const userData = { role: localStorage.getItem('userRole') || 'employee' };
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const AdminDashboard = () => (
    <SpaceBetween size="l">
      <Header variant="h1">Admin Dashboard</Header>
      <Cards
        cardDefinition={{
          header: item => (
            <Header variant="h2">{item.title}</Header>
          ),
          sections: [
            {
              id: "description",
              content: item => item.description
            }
          ]
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 }
        ]}
        items={[
          {
            title: "Projects Overview",
            description: "View and manage all company projects"
          },
          {
            title: "Team Management",
            description: "Manage teams, roles, and permissions"
          },
          {
            title: "Attendance Reports",
            description: "View attendance and standup reports"
          },
          {
            title: "Finance Department",
            description: "Manage stipends and payments"
          }
        ]}
      />
      
      <Box>
        <Header variant="h2">Recent Activity</Header>
        <p>No recent activities to display.</p>
      </Box>
    </SpaceBetween>
  );

  const EmployeeDashboard = () => (
    <SpaceBetween size="l">
      <Header variant="h1">Employee Dashboard</Header>
      <Cards
        cardDefinition={{
          header: item => (
            <Header variant="h2">{item.title}</Header>
          ),
          sections: [
            {
              id: "description",
              content: item => item.description
            }
          ]
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 }
        ]}
        items={[
          {
            title: "My Tasks",
            description: "View and manage your assigned tasks"
          },
          {
            title: "My Teams",
            description: "View your team information and members"
          },
          {
            title: "Attendance",
            description: "Mark your daily attendance and standup"
          },
          {
            title: "Leave Requests",
            description: "Apply for leave and check status"
          }
        ]}
      />
      
      <Box>
        <Header variant="h2">Upcoming Tasks</Header>
        <p>No upcoming tasks to display.</p>
      </Box>
    </SpaceBetween>
  );

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
};

export default DashboardPage;
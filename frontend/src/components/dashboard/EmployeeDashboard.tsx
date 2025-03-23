import React, { useState, useEffect } from 'react';
import { AppLayout, Icon } from '@cloudscape-design/components';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';
import ProjectsPage from '../../pages/ProjectsPage';
import TasksPage from '../../pages/TasksPage';
import AttendancePage from '../../pages/AttendancePage';
import SettingsPage from '../../pages/SettingsPage';
import LeaveRequest from '../../pages/LeaveRequest';
import DocumentRequest from '../../pages/DocumentRequest';
import MyTeam from '../../pages/MyTeam';

// Custom Sidebar Component
const CustomSidebar: React.FC<{ 
  activeHref: string, 
  onNavigate: (href: string) => void, 
  onLogout: () => void 
}> = ({ activeHref, onNavigate, onLogout }) => {
  const navItems = [
    { icon: 'multiscreen', text: 'Dashboard', href: 'dashboard' },
    { icon: 'folder', text: 'Projects', href: 'projects' },
    { icon: 'status-pending', text: 'My Tasks', href: 'tasks' },
    { icon: 'group', text: 'My Teams', href: 'teams' },
    { icon: 'calendar', text: 'Attendance', href: 'attendance' },
    { icon: 'ticket', text: 'Leave Requests', href: 'leave' },
    { icon: 'file', text: 'Documents & Certificates', href: 'documents' },
  ];

  return (
    <div className="custom-sidebar" style={{ padding: '20px', height: '100%', backgroundColor: '#f2f3f3' }}>
      <h2 style={{ marginBottom: '20px' }}>Employee Panel</h2>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {navItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '12px' }}>
            <a 
              href={`#${item.href}`} 
              onClick={(e) => { 
                e.preventDefault(); 
                onNavigate(item.href); 
              }} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: activeHref === item.href ? '#0972d3' : '#16191f',
                fontWeight: activeHref === item.href ? 'bold' : 'normal'
              }}
            >
              <Icon name={item.icon}/>
              <span style={{ marginLeft: '10px' }}>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
      
      <div style={{ borderTop: '1px solid #d1d5db', marginTop: '20px', paddingTop: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <a 
              href="#settings" 
              onClick={(e) => { 
                e.preventDefault(); 
                onNavigate('settings'); 
              }} 
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: activeHref === 'settings' ? '#0972d3' : '#16191f',fontWeight: activeHref === 'settings' ? 'bold' : 'normal' }}
            >
              <Icon name="settings" />
              <span style={{ marginLeft: '10px' }}>Settings</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                onLogout(); 
              }} 
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#16191f' }}
            >
              <Icon name="status-negative" />
              <span style={{ marginLeft: '10px' }}>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeContent, setActiveContent] = useState('dashboard');

  // Extract content type from the URL path
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    setActiveContent(path);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Handle navigation item selection
  const handleNavigation = (href: string) => {
    setActiveContent(href);
    navigate(`/employee/${href}`);
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeContent) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'teams':
        return <MyTeam />;
      case 'attendance':
        return <AttendancePage />;
      case 'leave':
        return <LeaveRequest />;
      case 'documents':
        return <DocumentRequest/>;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppLayout
      navigation={
        <CustomSidebar 
          activeHref={activeContent} 
          onNavigate={handleNavigation} 
          onLogout={handleLogout} 
        />
      }
      content=
          {renderContent()
      }
    />
  );
};

export default EmployeeDashboard;
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CommonSidebar from '../common/Sidebar';

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
        { id: 'colleges', label: 'Colleges List', icon: <SchoolIcon /> },
        { id: 'create-college', label: 'Create College', icon: <SchoolIcon /> },
        { id: 'companies', label: 'Companies', icon: <BusinessIcon /> },
        { id: 'skills', label: 'Skills', icon: <CodeIcon /> },
        { id: 'support', label: 'Support Tickets', icon: <SupportAgentIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <CommonSidebar
            title="Super Admin"
            logoLetter="S"
            menuItems={menuItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleLogout={handleLogout}
        />
    );
};

export default Sidebar;

import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CommonSidebar from '../common/Sidebar';

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
    const menuItems = [
        { id: 'users', label: 'Manage Users', icon: <PeopleIcon /> },
        { id: 'import', label: 'Import Users', icon: <UploadFileIcon /> },
        { id: 'support', label: 'Support Tickets', icon: <SupportAgentIcon /> },
    ];

    return (
        <CommonSidebar
            title="College Admin"
            logoLetter="A"
            menuItems={menuItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleLogout={handleLogout}
        />
    );
};

export default Sidebar;

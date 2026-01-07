import React from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({
    title,
    logoLetter,
    menuItems,
    activeSection,
    setActiveSection,
    handleLogout
}) => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 3, px: 2 }}>
            {/* Brand / Logo Area */}
            <Box sx={{ px: 2, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {logoLetter}
                </Box>
                <Typography variant="h6" fontWeight="800" color="text.primary">
                    {title}
                </Typography>
            </Box>

            <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            selected={activeSection === item.id}
                            onClick={() => setActiveSection(item.id)}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                                bgcolor: activeSection === item.id ? 'rgba(255, 87, 34, 0.08) !important' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                    color: 'text.primary'
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: activeSection === item.id ? 'primary.main' : 'inherit'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: activeSection === item.id ? 700 : 500,
                                    fontSize: '0.95rem'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ mb: 2 }} />
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.04)',
                            color: 'error.main'
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );
};

export default Sidebar;

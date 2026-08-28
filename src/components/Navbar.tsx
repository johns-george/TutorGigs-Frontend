import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Chat,
  FavoriteBorder,
  Person,
  Menu as MenuIcon,
  Login,
  PersonAdd,
  Logout,
  Dashboard,
  Explore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { Gavel } from '@mui/icons-material'; 
import ChatList from './ChatList';
import { API_URL } from '../api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const MyBidPath = user?.role === 'STUDENT' ? '/bid-list' : '/requests';
  const MyHomePath = user?.role === 'STUDENT' ? '/explorer' : '/my-gigs';


  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavButton: React.FC<{ path: string; label: string; icon?: React.ReactNode }> = ({ path, label, icon }) => (
    <Button
      color="inherit"
      onClick={() => handleNavigation(path)}
      startIcon={icon}
      sx={{
        mx: 1,
        fontWeight: isActive(path) ? 600 : 400,
        bgcolor: isActive(path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {label}
    </Button>
  );

  const mobileMenuItems = [
    ...(isAuthenticated ? [
      { 
        path: MyHomePath, 
        label: user.role == 'STUDENT' ? "Home" : "Home", 
        icon: <Dashboard /> 
      },
       { 
        path: MyBidPath, 
        label: user.role == 'STUDENT' ? "My_Bids" : "Dashboard", 
        icon: <Dashboard /> 
      },
       ...(user?.role === 'STUDENT' ? [
        { path: '/wishlist', label: 'Wishlist', icon: <FavoriteBorder /> },
      ] : []),
      ...(user?.role === 'STUDENT' ? [
        { path: '/student-dashboard', label: 'Dashboard', icon: <FavoriteBorder /> },
      ] : []),
       ...(user?.role === 'TUTOR' ? [
        { path: '/requests', label: 'Requests', icon: <FavoriteBorder /> },
      ] : []),
      { path: '/chat', label: 'Chat', icon: <Chat /> },
    ] : [
      { path: '/login', label: 'Sign In', icon: <Login /> },
      { path: '/signup', label: 'Sign Up', icon: <PersonAdd /> },
    ])
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" onClick={() => {
                if (!user) {
                  navigate('/');
                } else if (user.role === 'STUDENT') {
                  navigate('/explorer');
                } else if (user.role === 'TUTOR') {
                  navigate('/my-gigs');
                } else {
                  navigate('/');
                }
              }}
            sx={{ cursor: 'pointer' }}>
            <Typography variant="h5" component="div" fontWeight="bold" color="inherit">
              TutorGigs
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display="flex" alignItems="center">
              {isAuthenticated ? (
                <>
                <NavButton 
                    path= {MyHomePath}
                    label={user.role=='STUDENT'?"Home":"Home"} 
                    icon={<Gavel />}
                  />
                  <NavButton 
                    path= {MyBidPath}
                    label={user.role=='STUDENT'?"My_Bids":"Requests"} 
                    icon={<Gavel />}
                  />
                  {user?.role === 'STUDENT' && (
                    <NavButton path="/wishlist" label="Wishlist" icon={<FavoriteBorder />} />
                  )}
                  
                  <IconButton
                    color="inherit"
                    onClick={() => setChatListOpen(true)}
                    sx={{ mx: 1 }}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <Chat />
                    </Badge>
                  </IconButton>
                </>
              ) : (
                <>
                  <NavButton path="/login" label="Sign In" icon={<Login />} />
                  <NavButton path="/signup" label="Sign Up" icon={<PersonAdd />} />
                </>
              )}
              
              {/* Theme Toggle */}
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton color="inherit" onClick={toggleTheme} sx={{ mx: 1 }}>
                  {mode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
              </Tooltip>

              {/* Profile Menu */}
              {isAuthenticated && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem'
                      }}
                    >
                       <Avatar
                   src={`${API_URL}${user.profileImageUrl}`}
                    sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                     {user?.fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => { 
                      navigate(user?.role === 'STUDENT' ? '/student-dashboard' : '/teacher-dashboard');
                      handleProfileMenuClose();
                    }}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box display="flex" alignItems="center">
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton color="inherit" onClick={toggleTheme}>
                  {mode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          {isAuthenticated && (
            <>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48
                    }}
                  >
                   <Avatar
                   src={`${API_URL}${user.profileImageUrl}`}
                    sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                     {user?.fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user?.username}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </>
          )}
          
          <List>
            {mobileMenuItems.map((item) => (
              <ListItem 
                key={item.path}
                onClick={() => {
                   if (item.path === '/chat') {
                  setChatListOpen(true);   // open chat drawer
                  setMobileMenuOpen(false); // close mobile menu
                } else {
                  handleNavigation(item.path);
                }
                   }}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            
            {isAuthenticated && (
              <>
                <Divider />
                <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Chat List Drawer */}
      <ChatList open={chatListOpen} onClose={() => setChatListOpen(false)} />
    </>
  );
};

export default Navbar;
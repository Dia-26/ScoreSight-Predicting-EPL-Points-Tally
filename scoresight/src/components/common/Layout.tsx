import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container,
  Box,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Predict', path: '/predictions/pre-match' },
    { label: 'Teams', path: '/team-analysis' },
    { label: 'News', path: '/news' },
    { label: 'Analyst', path: '/chat' },
    { label: 'Half-Time', path: '/predictions/half-time' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      minHeight: '100vh'
    }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 4,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <SportsSoccerIcon sx={{ 
              mr: 2, 
              color: '#00d4ff',
              fontSize: 32
            }} />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                letterSpacing: 1
              }}
            >
              SCORESIGHT
            </Typography>
          </Box>
          
          {/* Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            flexGrow: 1
          }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  background: isActivePath(item.path) 
                    ? 'rgba(0, 212, 255, 0.2)' 
                    : 'transparent',
                  border: isActivePath(item.path) 
                    ? '1px solid rgba(0, 212, 255, 0.3)' 
                    : '1px solid transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3
          }}>
            {/* User Profile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)'
                }
              }}
              onClick={() => navigate('/profile')}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#00d4ff',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  {user?.firstName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  View Profile
                </Typography>
              </Box>
            </Box>


            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                color: '#ff6b6b',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                '&:hover': {
                  background: 'rgba(255, 107, 107, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Message */}
        {user && (
          <Box
            sx={{
              mb: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              px: 3,
              py: 2,
              borderRadius: 2,
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.2)'
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: '#00d4ff',
                fontWeight: 700
              }}
            >
              {user.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                Welcome back, {user.firstName}!
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                Ready for today's predictions?
              </Typography>
            </Box>
          </Box>
        )}

        {/* Page Content */}
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
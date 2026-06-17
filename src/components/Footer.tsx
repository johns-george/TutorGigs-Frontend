import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import ChatList from './ChatList'; 

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [chatListOpen, setChatListOpen] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }} 
          gap={4}
          justifyContent="space-between"
        >
          {/* Company Info */}
          <Box flex={1} maxWidth={{ xs: '100%', md: '33%' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
              TutorGigs
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting passionate learners with expert educators. Find the perfect tutor 
              for your learning journey or share your knowledge as a teacher.
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <IconButton size="small" color="primary">
                <Facebook />
              </IconButton>
              <IconButton size="small" color="primary">
                <Twitter />
              </IconButton>
              <IconButton size="small" color="primary">
                <Instagram />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={4}
            flex={1}
            justifyContent="center"
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                For Students
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="/bid-list" color="text.secondary" underline="hover">
                  Bid Lists
                </Link>
                <Link href="/wishlist" color="text.secondary" underline="hover">
                  My Wishlist
                </Link>
                <Link href="/student-dashboard" color="text.secondary" underline="hover">
                  Dashboard
                </Link>
               <Link
                component="button"
                onClick={() => setChatListOpen(true)}
                color="text.secondary"
                underline="hover"
                sx={{ textAlign: 'left' }}
              >
                  Messages
                </Link>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                For Teachers
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="/teacher-dashboard" color="text.secondary" underline="hover">
                  Dashboard
                </Link>
                <Link href="/my-gigs" color="text.secondary" underline="hover">
                  My Gigs
                </Link>
                <Link href="/create-gig" color="text.secondary" underline="hover">
                  Create Gig
                </Link>
                <Link href="/requests" color="text.secondary" underline="hover">
                  Requests
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box flex={1} maxWidth={{ xs: '100%', md: '33%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  support@tutorgigs.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  San Francisco, CA
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} TutorGigs. All rights reserved.
          </Typography>
          <Box display="flex" gap={3} flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
            <Link href="/privacy" color="text.secondary" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="/terms" color="text.secondary" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="/help" color="text.secondary" underline="hover" variant="body2">
              Help Center
            </Link>
          </Box>
        </Box>
      </Container>
       <ChatList open={chatListOpen} onClose={() => setChatListOpen(false)} />
    </Box>
  );
};

export default Footer;
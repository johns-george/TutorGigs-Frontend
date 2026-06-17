import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  School, 
  Person, 
  Star, 
  TrendingUp,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'STUDENT' ? '/explorer' : '/teacher-dashboard');
    } else {
      navigate('/signup');
    }
  };

  const stats = [
    { icon: <School />, number: '1000+', label: 'Expert Tutors' },
    { icon: <Person />, number: '5000+', label: 'Students' },
    { icon: <Star />, number: '4.9', label: 'Average Rating' },
    { icon: <TrendingUp />, number: '98%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Grade 11 Student',
      rating: 5,
      text: 'Found an amazing physics tutor who helped me improve my grades significantly!',
    },
    {
      name: 'Mike Johnson',
      role: 'Mathematics Teacher',
      text: 'Great platform to connect with students and share my passion for teaching.',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Grade 12 Student',
      text: 'The tutors here are incredibly knowledgeable and patient. Highly recommend!',
      rating: 5,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
              background: 'linear-gradient(45deg, #FFFFFF 30%, #E3F2FD 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Connect, Learn, Excel
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            The premier platform connecting passionate learners with expert educators. 
            Find your perfect tutor or share your knowledge as a teacher.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-around"
          alignItems="center"
          gap={4}
        >
          {stats.map((stat, index) => (
            <Box key={index} textAlign="center">
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {stat.icon}
              </Avatar>
              <Typography variant="h3" component="div" fontWeight="bold" color="primary">
                {stat.number}
              </Typography>
              <Typography variant="body1" color={theme.palette.mode==='light'?"seccondary.main":"warning.main"}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
            Why Choose TutorGigs?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            We make learning accessible, effective, and enjoyable for everyone
          </Typography>
          
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={4}
            justifyContent="center"
          >
            <Card sx={{ flex: 1, textAlign: 'center', p: 3 }}>
              <CardContent>
                <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Expert Tutors
                </Typography>
                <Typography variant="body1" color={theme.palette.mode==='light'?"seccondary.main":"warning.main"}>
                  Learn from qualified educators with proven track records and passion for teaching.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'center', p: 3 }}>
              <CardContent>
                <Person sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Personalized Learning
                </Typography>
                <Typography variant="body1" color={theme.palette.mode==='light'?"seccondary.main":"warning.main"}>
                  Get one-on-one attention tailored to your learning style and academic goals.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'center', p: 3 }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Proven Results
                </Typography>
                <Typography variant="body1" color={theme.palette.mode==='light'?"seccondary.main":"warning.main"}>
                  Join thousands of students who have achieved their academic goals with our platform.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          What Our Users Say
        </Typography>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={4}
          mt={4}
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index} sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  "{testimonial.text}"
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Start Your Learning Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students and teachers already using TutorGigs
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Sign Up as Student
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Become a Tutor
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
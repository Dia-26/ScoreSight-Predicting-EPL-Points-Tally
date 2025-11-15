import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Rating,
  Alert,
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  SportsSoccer, 
  CheckCircle,
  Star,
  Send,
  Person,
  Favorite,
  Info,
  RateReview
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { FootballTeam } from '../types/profile';

const UserProfile: React.FC = () => {
  const { user, updateProfile, submitTestimonial } = useAuth();
  
  // User Info State
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || '',
  });

  // Favorite Team State
  const [selectedTeam, setSelectedTeam] = useState<FootballTeam | null>(user?.favoriteTeam || null);
  const [teams] = useState<FootballTeam[]>([
    {
      id: 57,
      name: 'Arsenal FC',
      shortName: 'Arsenal',
      crest: 'https://crests.football-data.org/57.svg',
      league: 'Premier League'
    },
    {
      id: 61,
      name: 'Chelsea FC',
      shortName: 'Chelsea',
      crest: 'https://crests.football-data.org/61.svg',
      league: 'Premier League'
    },
    {
      id: 64,
      name: 'Liverpool FC',
      shortName: 'Liverpool',
      crest: 'https://crests.football-data.org/64.svg',
      league: 'Premier League'
    },
    {
      id: 65,
      name: 'Manchester City',
      shortName: 'Man City',
      crest: 'https://crests.football-data.org/65.svg',
      league: 'Premier League'
    },
    {
      id: 66,
      name: 'Manchester United',
      shortName: 'Man United',
      crest: 'https://crests.football-data.org/66.svg',
      league: 'Premier League'
    },
    {
      id: 73,
      name: 'Tottenham Hotspur',
      shortName: 'Tottenham',
      crest: 'https://crests.football-data.org/73.svg',
      league: 'Premier League'
    }
  ]);

  // Testimonials State
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // User Info Handlers
  const handleUserInfoSave = async () => {
    await updateProfile(userInfo);
    setIsEditing(false);
  };

  const handleUserInfoCancel = () => {
    setUserInfo({
      displayName: user?.displayName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  // Personal Details Handler
  const handlePersonalDetailsSave = async () => {
    await updateProfile(personalDetails);
  };

  // Favorite Team Handler
  const handleTeamSelect = (team: FootballTeam) => {
    setSelectedTeam(team);
  };

  const saveFavoriteTeam = async () => {
    if (selectedTeam) {
      await updateProfile({ favoriteTeam: selectedTeam });
    }
  };

  // Testimonials Handler
  const handleTestimonialSubmit = async () => {
    if (rating && comment.trim()) {
      const success = await submitTestimonial(rating, comment.trim());
      if (success) {
        const newTestimonial = {
          id: Date.now().toString(),
          userId: user?.id || '',
          userName: user?.displayName || user?.firstName || 'Anonymous',
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
          approved: false,
        };
        
        setTestimonials([newTestimonial, ...testimonials]);
        setComment('');
        setRating(5);
        setSubmitted(true);
        
        setTimeout(() => setSubmitted(false), 3000);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Avatar
          sx={{ 
            width: 120, 
            height: 120, 
            mx: 'auto', 
            mb: 3,
            border: '4px solid',
            borderColor: 'primary.main'
          }}
          src={user?.avatarUrl}
          alt={user?.displayName || user?.firstName}
        />
        <Typography variant="h3" gutterBottom fontWeight="800">
          {user?.displayName || `${user?.firstName} ${user?.lastName}`}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {user?.email}
        </Typography>
      </Box>

      {/* Personal Information Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4">Personal Information</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="textSecondary">
            Basic Account Details
          </Typography>
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleUserInfoSave} color="primary">
                <Save />
              </IconButton>
              <IconButton onClick={handleUserInfoCancel} color="error">
                <Cancel />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 3,
          mb: 3 
        }}>
          <TextField
            label="Display Name"
            value={userInfo.displayName}
            onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
            disabled={!isEditing}
            fullWidth
          />
          
          <TextField
            label="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            disabled={!isEditing}
            fullWidth
            type="email"
          />
        </Box>

        {isEditing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              src={user?.avatarUrl}
              alt={user?.displayName || user?.firstName}
            />
            <Button variant="outlined" component="label">
              Upload New Photo
              <input type="file" hidden accept="image/*" />
            </Button>
          </Box>
        )}
      </Paper>

      {/* Favorite Team Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Favorite sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
          <Typography variant="h4">Favorite Team</Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Select your favorite Premier League team to personalize your experience
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
          gap: 3, 
          mb: 4 
        }}>
          {teams.map((team) => (
            <Card
              key={team.id}
              sx={{
                cursor: 'pointer',
                border: selectedTeam?.id === team.id ? 3 : 1,
                borderColor: selectedTeam?.id === team.id ? 'primary.main' : 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleTeamSelect(team)}
            >
              <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                {selectedTeam?.id === team.id && (
                  <CheckCircle 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: 'primary.main',
                      fontSize: 32
                    }} 
                  />
                )}
                <Avatar
                  src={team.crest}
                  alt={team.name}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {team.shortName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {team.league}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {selectedTeam && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={saveFavoriteTeam}
              disabled={user?.favoriteTeam?.id === selectedTeam.id}
              sx={{ px: 4 }}
            >
              {user?.favoriteTeam?.id === selectedTeam.id ? 'Team Saved!' : 'Save Favorite Team'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Additional Details Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Info sx={{ mr: 2, color: 'info.main', fontSize: 32 }} />
          <Typography variant="h4">Additional Details</Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Add more information to complete your profile
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 3, 
          mb: 4 
        }}>
          <TextField
            label="First Name"
            value={personalDetails.firstName}
            onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
            fullWidth
          />
          
          <TextField
            label="Last Name"
            value={personalDetails.lastName}
            onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
            fullWidth
          />
          
          <TextField
            label="Phone Number"
            value={personalDetails.phoneNumber}
            onChange={(e) => setPersonalDetails({ ...personalDetails, phoneNumber: e.target.value })}
            fullWidth
          />
          
          <TextField
            label="Date of Birth"
            type="date"
            value={personalDetails.dateOfBirth}
            onChange={(e) => setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
            <TextField
              label="Location"
              value={personalDetails.location}
              onChange={(e) => setPersonalDetails({ ...personalDetails, location: e.target.value })}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handlePersonalDetailsSave}
            startIcon={<Save />}
            sx={{ px: 4 }}
          >
            Save Personal Details
          </Button>
        </Box>
      </Paper>

      {/* Feedback & Testimonials Section */}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RateReview sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
          <Typography variant="h4">Feedback & Testimonials</Typography>
        </Box>

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your feedback! Your testimonial has been submitted for review. 🌟
          </Alert>
        )}

        {/* Feedback Form */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0.1) 100%)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ mr: 1, color: 'warning.main' }} />
              Share Your Experience
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" gutterBottom>Your Rating</Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              label="Your feedback"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 3 }}
              placeholder="Tell us about your experience with ScoreSight..."
            />
            <Button
              variant="contained"
              onClick={handleTestimonialSubmit}
              disabled={!rating || !comment.trim()}
              startIcon={<Send />}
              sx={{ 
                background: 'linear-gradient(45deg, #FF9800, #FF5722)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #F57C00, #E64A19)',
                }
              }}
            >
              Submit Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Existing Testimonials */}
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <RateReview sx={{ mr: 1 }} />
          Community Testimonials
        </Typography>
        
        {testimonials.length === 0 ? (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            No testimonials yet. Be the first to share your experience!
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {testimonial.userName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {testimonial.userName}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
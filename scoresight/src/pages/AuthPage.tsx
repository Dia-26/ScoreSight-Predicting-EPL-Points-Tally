import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Rotating football-themed background images (static list - no API)
  const footballBackgrounds = useMemo(
    () => [
      // Pexels free football images
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
      'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg',
      'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
      'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg'
    ],
    []
  );

  const [bgIndex, setBgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Prefetch next image for smoother transition
    const preloadNext = new Image();
    preloadNext.src = footballBackgrounds[(bgIndex + 1) % footballBackgrounds.length];
  }, [bgIndex, footballBackgrounds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % footballBackgrounds.length);
      setLoaded(false);
    }, 5000); // rotate every 5s
    return () => clearInterval(interval);
  }, [footballBackgrounds.length]);

  // Mark current image as loaded when it fires onLoad
  useEffect(() => {
    const img = new Image();
    img.src = footballBackgrounds[bgIndex];
    img.onload = () => setLoaded(true);
  }, [bgIndex, footballBackgrounds]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background layers with crossfade */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
        {footballBackgrounds.map((src, idx) => (
          <Box
            key={src}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: bgIndex === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              willChange: 'opacity'
            }}
          />
        ))}
        {/* Dim gradient overlay for readability */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(10,25,41,0.80), rgba(10,25,41,0.85))'
          }}
        />
      </Box>
      {/* Animated subtle overlay accents */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 20% 30%, rgba(0,212,255,0.25) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,107,255,0.25) 0%, transparent 55%)',
          mixBlendMode: 'screen',
          opacity: 0.35,
          animation: 'pulseGlow 10s ease-in-out infinite'
        }}
      />
      {/* Foreground content container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Header Section */}
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="800" 
              sx={{
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                letterSpacing: 1.5
              }}
            >
              SCORESIGHT
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#b0bec5',
                maxWidth: 400,
                mx: 'auto'
              }}
            >
              Advanced Premier League Predictions Powered by AI
            </Typography>
          </Box>

          {/* Auth Form */}
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignupForm onToggleMode={toggleMode} />
          )}

          {/* Features Section */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#78909c', mb: 1 }}>
              • 75.7% Prediction Accuracy • Live Match Updates • AI Insights •
            </Typography>
            <Typography variant="body2" sx={{ color: '#78909c' }}>
              • Premier League Focus • Real-time Analytics • Expert Betting Recommendations •
            </Typography>
          </Box>
        </Box>
      </Container>
      </Box>
      {/* Keyframe styles */}
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.25; }
          50% { opacity: 0.4; }
          100% { opacity: 0.25; }
        }
      `}</style>
    </Box>
  );
};

export default AuthPage;
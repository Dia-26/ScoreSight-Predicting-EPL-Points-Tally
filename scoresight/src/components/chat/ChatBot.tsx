import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import './ChatBot.css';
import { Send, SmartToy, Person, Psychology, AutoAwesome } from '@mui/icons-material';
import { chatService, ChatMessage } from '../../services/chatService';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm Scoresight AI. I can explain predictions, analyze teams using my ML models, and provide general football insights.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSuggestions();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSuggestions = async () => {
    const sugg = await chatService.getSuggestions();
    setSuggestions(sugg);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await chatService.sendMessage(input);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        timestamp: response.timestamp,
        source: response.source,
        confidence: response.confidence
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Auto-send after a short delay
    setTimeout(() => handleSend(), 100);
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'ml_model':
        return <AutoAwesome sx={{ fontSize: 16 }} />;
      case 'team_analyzer':
        return <Psychology sx={{ fontSize: 16 }} />;
      default:
        return <SmartToy sx={{ fontSize: 16 }} />;
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'ml_model':
        return '#00ff88';
      case 'team_analyzer':
        return '#ffaa00';
      default:
        return '#ff6bff';
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Hello! I'm Scoresight AI. I can explain predictions, analyze teams using my ML models, and provide general football insights.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <Card className="chat-card" sx={{ 
      height: '600px', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      overflow: 'hidden',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      borderRadius: '10px',
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 0,
        height: '100%'
      }}>
        
        {/* Header with Clear Button */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(to right, #00d4ff, transparent)',
          }
        }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{
              background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.5px'
            }}>
              🎯 Scoresight AI Analyst
            </Typography>
            <Typography variant="caption" sx={{
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box component="span" sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(0,212,255,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(0,212,255,0.2)'
              }}>
                🤖 ML Models & AI
              </Box>
              <Box component="span" sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(0,255,136,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(0,255,136,0.2)'
              }}>
                75% Prediction Accuracy
              </Box>
            </Typography>
          </Box>
          <Chip
            className="clear-button"
            label="Clear Chat"
            size="small"
            onClick={clearChat}
            sx={{ 
              borderColor: '#ff6b6b', 
              color: '#ff6b6b',
              background: 'rgba(255,107,107,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: 'rgba(255,107,107,0.2)', 
                color: '#ff6b6b',
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>

        {/* Messages Container with FIXED Scrollbar */}
        <Box 
          ref={messagesContainerRef}
          sx={{ 
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            minHeight: 0, // This is crucial for scrolling to work
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              margin: '4px 0',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, #00d4ff 0%, #0099cc 100%)',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                background: 'linear-gradient(180deg, #00b8e6 0%, #0088aa 100%)',
              },
            },
            // Firefox
            scrollbarWidth: 'thin',
            scrollbarColor: '#00d4ff rgba(255,255,255,0.05)',
          }}
        >
          {/* Messages */}
          <Box sx={{ flex: 1 }}>
            {messages.map((message) => (
              <Fade in timeout={400} key={message.id}>
                <Box
                  className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                    animation: message.role === 'user' ? 'slideInRight 0.3s ease-out' : 'slideIn 0.3s ease-out'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 1, 
                    maxWidth: '90%',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                  }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: message.role === 'user' ? '#00d4ff' : getSourceColor(message.source),
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      border: '2px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}>
                      {message.role === 'user' ? <Person /> : getSourceIcon(message.source)}
                    </Avatar>
                  
                  <Paper className="message-bubble" sx={{ 
                    p: 1.5, 
                    bgcolor: message.role === 'user' ? 'rgba(0,212,255,0.15)' : 'rgba(41, 40, 40, 0.8)',
                    border: message.role === 'assistant' ? `1px solid ${getSourceColor(message.source)}` : '1px solid rgba(0,212,255,0.3)',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: 'white', 
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.4
                    }}>
                      {message.content}
                    </Typography>                    {message.role === 'assistant' && message.source && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: getSourceColor(message.source),
                          fontWeight: 'bold'
                        }}>
                          {message.source === 'ml_model' && '🤖 ML Prediction Model'}
                          {message.source === 'team_analyzer' && '📊 Historical Data Analysis'}
                          {message.source === 'chatgpt' && '🌐 General Knowledge'}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
              </Fade>
            ))}
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff6bff' }}>
                    <SmartToy />
                  </Avatar>
                  <Paper sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: '#00d4ff' }} />
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        Analyzing with AI...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
          <div ref={messagesEndRef} />
        </Box>

        {/* Quick Questions & Input - Fixed at bottom */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.3)'
        }}>
          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ mb: 1, display: 'block' }}>
            Try asking about:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                onClick={() => handleQuickQuestion(suggestion)}
                sx={{ 
                  borderColor: '#00d4ff', 
                  color: '#00d4ff',
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: '#00d4ff', color: 'black' }
                }}
              />
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about predictions, teams, rules, or general football..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00d4ff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4ff',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{ 
                bgcolor: '#00d4ff', 
                color: 'black',
                '&:hover': {
                  bgcolor: '#00b8e6',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
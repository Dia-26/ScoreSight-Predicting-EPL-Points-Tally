# chatbot_service.py
import os
import requests
import json
import asyncio
from typing import Dict, List, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MultiAIProvider:
    """Handles multiple AI providers with proper API configurations"""
    
    def __init__(self):
        self.providers = [
            self._try_groq,    # First try Groq (free & fast)
            self._try_gemini,  # Then try Gemini
        ]
        self.setup_providers()
    
    def setup_providers(self):
        """Check which providers are available"""
        self.available_providers = []
        
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key and groq_key.startswith('gsk_'):
            self.available_providers.append('Groq')
            print("✅ Groq API configured")
        
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key and gemini_key.startswith('AIza'):
            self.available_providers.append('Gemini')
            print("✅ Gemini API configured")
        
        print(f"🎯 Available AI providers: {self.available_providers}")
    
    async def ask_question(self, question: str) -> str:
        """Try all available AI providers until one works"""
        # First try using ML models for football-specific questions
        from main import predict_match_internal, team_analyzer
        
        if any(term.lower() in question.lower() for term in ['epl', 'premier league', 'football', 'soccer', 'match', 'team', 'player']):
            # Check for team names in the question
            all_teams = [
                'Arsenal', 'Aston Villa', 'Birmingham', 'Blackburn', 'Blackpool',
                'Bolton', 'Bournemouth', 'Bradford', 'Brentford', 'Brighton',
                'Burnley', 'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 
                'Crystal Palace', 'Derby', 'Everton', 'Fulham', 'Huddersfield',
                'Hull', 'Ipswich', 'Leeds', 'Leicester', 'Liverpool',
                'Man City', 'Man United', 'Middlesbrough', 'Newcastle', 'Norwich',
                'Portsmouth', 'QPR', 'Reading', 'Sheffield United', 'Southampton',
                'Stoke', 'Sunderland', 'Swansea', 'Tottenham', 'Watford',
                'West Brom', 'West Ham', 'Wigan', 'Wolves', "Nott'm Forest"
            ]
            mentioned_teams = [team for team in all_teams if team.lower() in question.lower()]

            if len(mentioned_teams) >= 2:
                # Try prediction
                try:
                    prediction = await predict_match_internal(mentioned_teams[0], mentioned_teams[1])
                    if 'error' not in prediction:
                        return f"""Based on our ML model analysis for {mentioned_teams[0]} vs {mentioned_teams[1]}:

🏆 **Match Probabilities:**
• Home Win: {prediction['home_win_prob']:.1%}
• Draw: {prediction['draw_prob']:.1%}
• Away Win: {prediction['away_win_prob']:.1%}

📊 **Predicted Outcome:** {prediction['predicted_outcome']}
🎯 **Predicted Score:** {prediction['predicted_score']}

💡 **Key Factors:**
{chr(10).join(['• ' + factor for factor in prediction['keyFactors']])}

🤖 *Powered by Scoresight ML Model*"""
                except Exception as e:
                    print(f"ML prediction failed: {e}")

            elif len(mentioned_teams) == 1:
                # Try team analysis
                try:
                    team_stats = team_analyzer.get_team_analysis(mentioned_teams[0])
                    if 'error' not in team_stats:
                        return f"""📊 **Team Analysis: {mentioned_teams[0]}**

🏆 **Overall Strength:** {team_stats.get('overall_strength', 'N/A')}/100
⚽ **Attack Rating:** {team_stats.get('attack_strength', 'N/A')}/100
🛡️ **Defense Rating:** {team_stats.get('defense_strength', 'N/A')}/100

📈 **Recent Form:** {' '.join(team_stats.get('recent_form', []))}
🎯 **Win Rate:** {team_stats.get('win_percentage', 'N/A')}%

📋 **Performance Analysis:**
{team_stats.get('analysis', 'No analysis available.')}"""
                except Exception as e:
                    print(f"Team analysis failed: {e}")

        # If ML models don't have an answer, try AI providers
        if not self.available_providers:
            return self._get_football_fallback(question)
        
        for provider in self.providers:
            try:
                response = await provider(question)
                if response and response != "SERVICE_UNAVAILABLE":
                    return response
            except Exception as e:
                print(f"❌ Provider failed: {e}")
                continue
        
        # Final fallback
        return self._get_football_fallback(question)
    
    def _get_football_fallback(self, question: str) -> str:
        """Provide intelligent fallback responses"""
        question_lower = question.lower()
        
        if 'offside' in question_lower:
            return """⚽ **The Offside Rule Explained:**

A player is in an offside position if:
• They are in the opponent's half
• They are nearer to the opponent's goal line than both the ball and the second-last opponent

**Key exceptions:** 
- Not offside if level with the second-last opponent
- Not offside from goal kicks, throw-ins, or corners
- Not offside if in own half

**When offside is penalized:**
Only when the player becomes actively involved in play by:
• Interfering with play
• Interfering with an opponent
• Gaining an advantage

This encourages fair play and prevents 'goal hanging'!"""

        elif 'premier league' in question_lower or 'epl' in question_lower:
            return """🏴󠁧󠁢󠁥󠁮󠁧󠁿 **English Premier League (EPL)**

The Premier League is England's top professional football division:
• **Founded:** 1992
• **Teams:** 20
• **Season:** August to May
• **Matches:** 38 per team (380 total)
• **Points:** 3 for win, 1 for draw

**Current Top Clubs:** Manchester City, Liverpool, Arsenal, Chelsea, Manchester United

**Notable Features:**
- Most watched sports league globally
- Known for fast-paced, physical football
- Huge international following
- Significant TV revenue distribution"""

        elif any(term in question_lower for term in ['rule', 'rules', 'law', 'laws']):
            return "I'd be happy to explain football rules! Could you specify which rule you're interested in? For example: offside, penalty kicks, VAR, handball, or fouls?"

        else:
            return """I specialize in Premier League football analysis! Here's what I can help you with:

🔮 **Match Predictions**: "Predict Arsenal vs Chelsea", "Who will win between Liverpool and Man City"
📊 **Team Analysis**: "Show me Manchester United's form", "How is Arsenal performing?"
🤝 **Head-to-Head**: "Chelsea vs Tottenham history", "Man City vs Liverpool head to head"
📜 **Football Rules**: "Explain the offside rule", "What is VAR?"

Try asking about specific teams, matches, or football rules!"""
    
    async def _try_groq(self, question: str) -> str:
        """Try Groq API - Fixed with your API key"""
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not api_key.startswith('gsk_'):
            return "SERVICE_UNAVAILABLE"
        
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Football expert prompt
            prompt = f"""You are Scoresight, a football expert assistant specializing in Premier League analysis. 
Provide accurate, detailed information about football rules, history, teams, players, and statistics.

User Question: {question}

Please provide a comprehensive but concise answer focused on football knowledge.
If the question is not about football, politely explain you specialize in football topics.

Answer in a helpful, engaging tone with relevant emojis:"""

            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are a football expert assistant for Scoresight. Provide accurate information about Premier League, football rules, history, teams, players, and statistics. Use engaging, conversational tone with relevant emojis."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "model": "llama-3.1-8b-instant",
                "temperature": 0.3,
                "max_tokens": 1000,
                "stream": False
            }
            
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers, 
                    json=payload, 
                    timeout=30
                )
            )
            
            print(f"🔧 Groq API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                return data['choices'][0]['message']['content']
            else:
                print(f"❌ Groq API error {response.status_code}: {response.text}")
                return "SERVICE_UNAVAILABLE"
                
        except Exception as e:
            print(f"❌ Groq API failed: {e}")
            return "SERVICE_UNAVAILABLE"
    
    async def _try_gemini(self, question: str) -> str:
        """Try Gemini API - Fixed with your API key"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or not api_key.startswith('AIza'):
            return "SERVICE_UNAVAILABLE"
        
        try:
            # Correct Gemini API endpoint
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
            
            prompt = f"""You are Scoresight, a football expert assistant specializing in Premier League analysis. 

Question: {question}

Provide accurate, detailed information about football rules, history, teams, players, and statistics. If the question is not football-related, politely explain you specialize in football topics.

Answer in a helpful, engaging tone with relevant emojis:"""
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1000,
                    "topP": 0.8,
                    "topK": 40
                }
            }
            
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: requests.post(url, json=payload, timeout=30)
            )
            
            print(f"🔧 Gemini API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    return data['candidates'][0]['content']['parts'][0]['text']
                else:
                    return "SERVICE_UNAVAILABLE"
            else:
                print(f"❌ Gemini API error {response.status_code}: {response.text}")
                return "SERVICE_UNAVAILABLE"
                
        except Exception as e:
            print(f"❌ Gemini API failed: {e}")
            return "SERVICE_UNAVAILABLE"

class ChatbotService:
    """Main chatbot service with ML-first approach"""
    
    def __init__(self):
        self.ai_provider = MultiAIProvider()
        self.epl_teams = self.get_all_trained_teams()
        
        # Keywords for routing
        self.prediction_keywords = ['predict', 'forecast', 'who will win', 'outcome', 'probability', 'chances']
        self.team_keywords = ['stats', 'form', 'performance', 'record', 'analysis', 'strength', 'how is', 'how are']
        self.h2h_keywords = ['head to head', 'h2h', 'history', 'against', 'vs', 'versus', 'rivalry']
        self.general_keywords = ['what is', 'how does', 'explain', 'rule', 'rules', 'mean', 'definition']
        
        print("✅ Chatbot Service initialized with API support!")
    
    def get_all_trained_teams(self):
        """Get all unique teams from training data"""
        return [
            'Arsenal', 'Aston Villa', 'Birmingham', 'Blackburn', 'Blackpool',
            'Bolton', 'Bournemouth', 'Bradford', 'Brentford', 'Brighton',
            'Burnley', 'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 
            'Crystal Palace', 'Derby', 'Everton', 'Fulham', 'Huddersfield',
            'Hull', 'Ipswich', 'Leeds', 'Leicester', 'Liverpool',
            'Man City', 'Man United', 'Middlesbrough', 'Newcastle', 'Norwich',
            'Portsmouth', 'QPR', 'Reading', 'Sheffield United', 'Southampton',
            'Stoke', 'Sunderland', 'Swansea', 'Tottenham', 'Watford',
            'West Brom', 'West Ham', 'Wigan', 'Wolves', "Nott'm Forest"
        ]
    
    def classify_question(self, question: str) -> str:
        """Classify the type of question"""
        question_lower = question.lower()
        
        if any(keyword in question_lower for keyword in self.prediction_keywords):
            return 'prediction'
        if any(keyword in question_lower for keyword in self.team_keywords):
            return 'team_analysis'
        if any(keyword in question_lower for keyword in self.h2h_keywords):
            return 'head_to_head'
        if any(keyword in question_lower for keyword in self.general_keywords):
            return 'general'
        if any(team.lower() in question_lower for team in self.epl_teams):
            return 'epl_specific'
        
        return 'general'
    
    def extract_teams(self, question: str) -> List[str]:
        """Extract team names from question"""
        question_lower = question.lower()
        found_teams = []
        
        for team in self.epl_teams:
            # Handle Manchester teams specifically
            if team == 'Man United' and ('man united' in question_lower or 'manchester united' in question_lower):
                found_teams.append(team)
            elif team == 'Man City' and ('man city' in question_lower or 'manchester city' in question_lower):
                found_teams.append(team)
            elif team.lower() in question_lower:
                found_teams.append(team)
        
        return found_teams
    
    async def process_question(self, question: str) -> Dict[str, Any]:
        """Process question: Try ML models first, then AI as fallback"""
        try:
            print(f"🤖 Processing: '{question}'")
            
            # Classify question
            question_type = self.classify_question(question)
            teams = self.extract_teams(question)
            
            print(f"📊 Type: {question_type}, Teams: {teams}")
            
            # STEP 1: Try ML Models and Team Analyzer FIRST
            ml_response = await self._try_ml_models(question, question_type, teams)
            if ml_response:
                print("✅ Using ML model response")
                return ml_response
            
            # STEP 2: If ML models can't handle it, use AI as FALLBACK
            print("🔄 Falling back to AI provider")
            ai_response = await self.ai_provider.ask_question(question)
            
            return {
                "source": "ai_fallback",
                "response": ai_response,
                "confidence": "medium",
                "data": {"question_type": question_type, "teams": teams}
            }
                
        except Exception as e:
            print(f"🔴 Error processing question: {e}")
            return {
                "source": "error",
                "response": "I apologize, but I encountered an error processing your question. Please try again with a different query.",
                "confidence": "low",
                "data": None
            }
    
    async def _try_ml_models(self, question: str, question_type: str, teams: List[str]) -> Dict[str, Any]:
        """Try to get response from ML models and team analyzer first"""
        try:
            from main import predict_match_internal, team_analyzer
            
            # 1. PREDICTION QUESTIONS
            if question_type == 'prediction' and len(teams) >= 2:
                prediction_result = await predict_match_internal(teams[0], teams[1])
                if 'error' not in prediction_result:
                    response_text = f"""
🔮 **Match Prediction: {teams[0]} vs {teams[1]}**

🏆 **Probabilities:**
• Home Win: {prediction_result['home_win_prob']:.1%}
• Draw: {prediction_result['draw_prob']:.1%}  
• Away Win: {prediction_result['away_win_prob']:.1%}

📊 **Predicted Outcome:** {prediction_result['predicted_outcome']}
🎯 **Confidence:** {prediction_result['confidence'].upper()}
📈 **Predicted Score:** {prediction_result['predicted_score']}

💡 **Key Factors:**
{chr(10).join(['• ' + factor for factor in prediction_result['keyFactors']])}

🤖 *Using Scoresight ML Model (75% accuracy)*
"""
                    return {
                        "source": "ml_model",
                        "response": response_text,
                        "confidence": "high",
                        "data": prediction_result
                    }
            
            # 2. TEAM ANALYSIS QUESTIONS
            elif (question_type == 'team_analysis' or question_type == 'epl_specific') and len(teams) >= 1:
                team_stats = team_analyzer.get_team_analysis(teams[0])
                if 'error' not in team_stats:
                    response_text = f"""
📊 **Team Analysis: {teams[0]}**

🏆 **Overall Strength:** {team_stats.get('overall_strength', 'N/A')}/100
⚽ **Attack Rating:** {team_stats.get('attack_strength', 'N/A')}/100
🛡️ **Defense Rating:** {team_stats.get('defense_strength', 'N/A')}/100

📈 **Recent Form:** {' '.join(team_stats.get('recent_form', []))}
🎯 **Win Percentage:** {team_stats.get('win_percentage', 'N/A')}%

📋 **Performance Analysis:**
{team_stats.get('analysis', 'No analysis available.')}
"""
                    return {
                        "source": "team_analyzer", 
                        "response": response_text,
                        "confidence": "high",
                        "data": team_stats
                    }
            
            # 3. HEAD-TO-HEAD QUESTIONS
            elif question_type == 'head_to_head' and len(teams) >= 2:
                h2h = team_analyzer.get_head_to_head(teams[0], teams[1])
                if h2h.get('total_matches', 0) > 0:
                    response_text = f"""
🤝 **Head-to-Head: {teams[0]} vs {teams[1]}**

📊 **Total Matches:** {h2h['total_matches']}
🏆 **{teams[0]} Wins:** {h2h['team1_wins']} ({h2h['team1_win_percentage']}%)
🏆 **{teams[1]} Wins:** {h2h['team2_wins']} ({h2h['team2_win_percentage']}%)
⚖️ **Draws:** {h2h['draws']} ({h2h['draw_percentage']}%)

📈 **Recent Trend:** {h2h.get('recent_trend', 'Balanced')}
"""
                    return {
                        "source": "team_analyzer",
                        "response": response_text,
                        "confidence": "high",
                        "data": h2h
                    }
            
            return None  # ML models can't handle this question
                
        except Exception as e:
            print(f"🔴 ML models error: {e}")
            return None

# Global instance
chatbot_service = ChatbotService()
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
        self.providers = [self._try_groq, self._try_gemini]
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
        if not self.available_providers:
            return self._get_football_fallback(question)
        
        for provider in self.providers:
            try:
                print(f"🔄 Trying {provider.__name__}...")
                response = await provider(question)
                if response and response != "SERVICE_UNAVAILABLE":
                    print(f"✅ {provider.__name__} succeeded")
                    return response
            except Exception as e:
                print(f"❌ {provider.__name__} failed: {e}")
                continue
        
        return self._get_football_fallback(question)
    
    def _get_football_fallback(self, question: str) -> str:
        """Provide intelligent fallback responses for football questions"""
        question_lower = question.lower()
        
        if any(term in question_lower for term in ['what is epl', 'premier league']):
            return """🏴󠁧󠁢󠁥󠁮󠁧󠁿 **English Premier League (EPL)**

The English Premier League is the top level of English football:
• **Founded:** 1992
• **Teams:** 20 clubs  
• **Season:** August to May
• **Matches:** 38 per team (380 total)
• **Points:** 3 for win, 1 for draw

**Current Top Clubs:** Manchester City, Liverpool, Arsenal, Chelsea, Manchester United

**Features:**
- Most watched sports league globally
- Known for fast-paced, physical football
- Huge international following"""

        elif 'away team' in question_lower or 'home team' in question_lower:
            return """🏟️ **Home vs Away Teams:**

• **Home Team:** Plays at their own stadium
  - Advantages: Familiar pitch, home crowd support
  - Traditionally higher win probability

• **Away Team:** Travels to opponent's stadium
  - Challenges: Travel fatigue, hostile crowd
  - Wears away kit

Home advantage is a well-documented phenomenon in football!"""

        elif 'offside' in question_lower:
            return """⚽ **Offside Rule:**

A player is offside if:
• In opponent's half
• Closer to goal than ball and second-last defender
• Involved in active play

**Exceptions:** Goal kicks, throw-ins, corners"""

        else:
            return """I specialize in Premier League football analysis! Here's what I can help with:

🔮 **Predictions**: "Predict Arsenal vs Chelsea", "Who will win Liverpool vs Man City"
📊 **Team Analysis**: "Show me Manchester United's form"
🤝 **Head-to-Head**: "Chelsea vs Tottenham history"
📜 **Rules**: "Explain offside rule", "What is VAR?"

Try asking about specific teams, matches, or football concepts!"""

    async def _try_groq(self, question: str) -> str:
        """Try Groq API with enhanced error handling"""
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not api_key.startswith('gsk_'):
            print("❌ Groq API key missing or invalid")
            return "SERVICE_UNAVAILABLE"
        
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Simple, clean prompt
            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are a helpful football expert assistant for Scoresight. Provide accurate, engaging information about Premier League, football rules, teams, players, and matches. Use clear language with relevant emojis."
                    },
                    {
                        "role": "user", 
                        "content": f"Answer this football question: {question}"
                    }
                ],
                "model": "llama-3.1-8b-instant",
                "temperature": 0.7,
                "max_tokens": 1000,
                "top_p": 0.9
            }
            
            print("🔧 Sending request to Groq API...")
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers, 
                json=payload, 
                timeout=30
            )
            
            print(f"🔧 Groq Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    answer = data['choices'][0]['message']['content']
                    print("✅ Groq API success!")
                    return answer
                else:
                    print("❌ Groq API returned no choices")
                    return "SERVICE_UNAVAILABLE"
            else:
                print(f"❌ Groq API error {response.status_code}: {response.text[:200]}")
                return "SERVICE_UNAVAILABLE"
                
        except requests.exceptions.Timeout:
            print("❌ Groq API timeout")
            return "SERVICE_UNAVAILABLE"
        except Exception as e:
            print(f"❌ Groq API failed: {str(e)}")
            return "SERVICE_UNAVAILABLE"
    
    async def _try_gemini(self, question: str) -> str:
        """Try Gemini API"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or not api_key.startswith('AIza'):
            return "SERVICE_UNAVAILABLE"
        
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{"text": f"Answer this football question: {question}"}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1000,
                }
            }
            
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    return data['candidates'][0]['content']['parts'][0]['text']
                else:
                    return "SERVICE_UNAVAILABLE"
            else:
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
        self.prediction_keywords = ['predict', 'forecast', 'who will win', 'outcome', 'probability']
        self.team_keywords = ['stats', 'form', 'performance', 'analysis', 'how is']
        self.h2h_keywords = ['head to head', 'h2h', 'history', 'vs', 'versus']
        self.general_keywords = ['what is', 'how does', 'explain', 'rule']
        
        print("✅ Chatbot Service initialized!")
    
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
                "response": "I apologize, but I encountered an error. Please try again with a different football question.",
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
🎯 **Predicted Score:** {prediction_result['predicted_score']}

💡 **Key Factors:**
{chr(10).join(['• ' + factor for factor in prediction_result['keyFactors']])}

🤖 *Powered by Scoresight ML Model*"""
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
🎯 **Win Rate:** {team_stats.get('win_percentage', 'N/A')}%

📋 **Performance Analysis:**
{team_stats.get('analysis', 'No analysis available.')}"""
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

📈 **Recent Trend:** {h2h.get('recent_trend', 'Balanced')}"""
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
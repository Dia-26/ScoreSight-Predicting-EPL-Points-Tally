# ⚽ ScoreSight — EPL Match Prediction System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/scoresight/actions)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Model Accuracy](https://img.shields.io/badge/pre-match%20accuracy-75.7%25-orange)](#model-performance)
[![Half-time Accuracy](https://img.shields.io/badge/half-time%20accuracy-68.1%25-yellow)](#model-performance)

---

## 🎯 Tagline
Machine learning meets matchday. ScoreSight predicts EPL outcomes, analyzes team performance, and chats like a coach.

---

## Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Quick Demo](#-quick-demo)
- [Installation & Setup](#-installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Docker (optional)](#docker-optional)
- [Environment Variables (.env example)](#environment-variables-env-example)
- [Project Structure](#-project-structure)
- [API Reference (Examples)](#-api-reference-examples)
- [Data Pipeline & Model Training](#-data-pipeline--model-training)
- [Model Performance](#-model-performance)
- [Security & Testing](#-security--testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License & Credits](#-license--credits)
- [Contact / Support](#-contact--support)

---

## 📋 Overview
**ScoreSight** is a full-stack system for predicting English Premier League match outcomes and delivering team analytics. It uses historical season data (2010–2020), live match stats from Football-Data.org, and ensemble ML models (Random Forest, XGBoost, Logistic Regression) to produce pre-match and half-time predictions with confidence scores. A football-aware chatbot exposes predictions and insights via natural language.

---

## 🚀 Features
- **Pre-match predictions** (ensemble) — 75.7% test accuracy  
- **Half-time live predictions** — 68.1% accuracy using real-time match features  
- Confidence scores + top contributing features per prediction  
- Team pages: history, head-to-head, form, strength ratings (0–100)  
- AI chatbot: ask predictions, stats, and explanations (Groq/Gemini/DeepSeek fallback)  
- Secure JWT authentication & session refresh  
- Production-ready REST API + React + TypeScript frontend

---

## 🏗️ Architecture & Tech Stack
- **Backend**: FastAPI, Python, Uvicorn  
- **ML**: Scikit-learn, XGBoost, joblib/pickle for model artifacts  
- **Data**: pandas, numpy  
- **Frontend**: React + TypeScript, charting (Recharts / D3 / Chart.js)  
- **Auth**: JWT, secure password hashing (salt + SHA-256 or bcrypt recommended)  
- **Data source**: football-data.org (live), curated historical CSVs (2010–2020)

---

## 🎬 Quick Demo
> Replace `localhost:8000` if running elsewhere.

Pre-match:
```bash
curl "http://localhost:8000/api/predict?home_team=Man%20City&away_team=Liverpool"

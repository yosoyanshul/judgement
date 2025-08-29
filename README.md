# 🎮 Judgement Card Game Score Tracker

A beautiful, responsive web app for tracking scores in the Judgement (Kachufool) card game. Perfect for playing with real cards at home!

## 🎯 What This App Does

This is a **score-keeping companion** for the popular Judgement card game. You play with real cards, and use this app to:

- Track bids for each round
- Record who wins each trick
- Calculate scores automatically
- Keep running totals throughout the game
- Support 2-10 players

## 🎲 How to Use

### 1. **Game Setup**
- Choose number of players (2-10 supported)
- Enter player names
- Select scoring system (Traditional or Progressive)

### 2. **Each Round**
- **Bidding Phase**: Each player enters their bid using the beautiful modal interface
- **Playing Phase**: Play tricks with real cards, then click the winner's name for each trick
- **Automatic Scoring**: App calculates and updates scores automatically

### 3. **Game Flow**
- Dealer rotates each round
- Trump suit cycles through the four suits
- Game automatically progresses through all rounds
- Final scores and winner displayed at the end

## ✨ Features

### 🌙 **Dark/Light Mode**
- Toggle between light and dark themes
- All text clearly visible in both modes
- Preference saved automatically

### 📱 **Responsive Design**
- Works perfectly on mobile, tablet, and desktop
- Touch-friendly interface for all devices

### 💾 **Auto-Save**
- Game state automatically saved to browser
- Resume games after closing/refreshing
- No data loss between sessions

### 🎨 **Beautiful Interface**
- Gradient backgrounds and smooth animations
- Visual progress indicators
- Clear status for each player (bid vs. actual tricks)

## 🎮 Game Rules Supported

### **Bidding**
- Sequential bidding (starting after dealer)
- Dealer restriction: total bids cannot equal total tricks
- Visual validation of valid/invalid bids

### **Scoring Systems**
- **Traditional**: 10 + tricks made (if bid met), 0 otherwise
- **Progressive**: 10 + bid + 5 bonus (if bid met), 0 otherwise

### **Round Structure**
- Start with maximum cards per player
- Decrease to 1 card per player
- Increase back to maximum cards
- Total rounds = (2 × max cards) - 1

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:3000

## 🛠️ Tech Stack

- **Framework**: Nuxt.js 3 with Vue 3
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: Browser localStorage
- **Deployment**: Static site generation

## 📱 Perfect for Game Nights

This app transforms your Judgement card game experience by:
- Eliminating manual score calculation
- Preventing scoring errors
- Keeping players focused on the game
- Providing beautiful, easy-to-read displays
- Supporting any number of players

Enjoy your game nights! 🎉

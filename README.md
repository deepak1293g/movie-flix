# D-Flix Setup Guide

## Prerequisites
- **Node.js**: Installed.
- **MongoDB**: Required for the database.

## 1. Install & Start MongoDB (If not installed)
If you don't have MongoDB installed, you can install it via Homebrew on Mac:

```bash
# 1. Tap the MongoDB Homebrew Tap
brew tap mongodb/brew

# 2. Install MongoDB
brew install mongodb-community@7.0

# 3. Start MongoDB Service
brew services start mongodb-community@7.0
```

## 2. Start the Backend API
In a terminal window:
```bash
cd /Users/macbookpro/Desktop/Projects/D-Flix
# Set JWT Secret (Optional, defaults to 'secret')
export JWT_SECRET=mysecretkey123 
# Run Server
node backend/server.js
```
*Server runs on port 5000.*

## 3. Seed Database (Create Admin)
*Only needs to be done once.*
```bash
node backend/seeder.js
```

## 4. Start the Frontend App
In a **new** terminal window:
```bash
cd /Users/macbookpro/Desktop/Projects/D-Flix
npm run dev
```
*Frontend runs on http://localhost:5173*

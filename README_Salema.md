# SalemaDigitalNotebook

A personal web application built to score and track a card game played with a group of friends. What started as a simple notebook replacement turned into a full-stack project with real-time features and cloud infrastructure.

## Features
- Create and manage games with multiple players
- Live game view with real-time score updates
- Full game history and player ranking
- Live spectator mode to watch ongoing games
- Feedback system

## Tech Stack

**Frontend** — Vue 3, Vite, Pinia, Vue Router

**Cloud** — AWS DynamoDB, AWS Lambda, AWS Amplify

## How to Run
```bash
npm install
npm run dev
```

> Note: AWS credentials are required for DynamoDB access. The app will not connect to the database without proper configuration.

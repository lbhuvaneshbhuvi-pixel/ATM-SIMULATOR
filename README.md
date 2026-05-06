# ATM Simulator - Smart Banking Prototype

A high-fidelity ATM web application simulation built with Next.js 15, Tailwind CSS, and Genkit AI. This project demonstrates modern fintech features including biometric login simulation, QR-based cardless withdrawals, and AI-driven financial advice.

## Features

- **Secure PIN Authentication**: 4-digit PIN access with a 3-attempt lockout policy.
- **Biometric Access**: Simulated fingerprint verification for high-speed login.
- **QR Cardless Cash**: Generate one-time QR codes for card-free withdrawals.
- **Strict Denomination Validation**: Support for ₹100, ₹200, and ₹500 notes.
- **OTP Verification**: Multi-factor authentication for transactions exceeding ₹5,000.
- **AI Financial Advisor**: Personalized saving tips powered by Google Genkit.
- **Real-time Analytics**: Visual spending trends and balance history using Recharts.

## Local Setup Instructions

Follow these steps to run the ATM Simulator on your own machine:

### 1. Prerequisites
- **Node.js**: Version 18.x or higher.
- **NPM**: or Yarn/PNPM.

### 2. Installation
Extract the downloaded ZIP file, open your terminal in the project directory, and run:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Gemini API Key if you wish to use the AI Advisor features:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) in your browser.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **State**: Custom React Hooks + LocalStorage Persistence

## Credentials (Demo)
- **Default PIN**: `1234`
- **Demo OTP**: `123456`

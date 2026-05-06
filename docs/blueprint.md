# **App Name**: RupeeATM Simulator

## Core Features:

- Secure Account Login: Users authenticate with a fixed PIN for session access, with a limited number of attempts before lockout.
- Interactive Dashboard: Displays the current account balance prominently, using the Indian Rupee symbol (₹).
- Deposit Funds: Allows users to input an amount to deposit, with validation for positive numeric inputs. Transaction confirmed with updated balance.
- Withdraw Funds: Enables users to withdraw money, including checks for sufficient balance and valid positive numeric inputs.
- Session Transaction Log: Provides a simple log of transactions made during the current user session for quick review.
- Client-Side Balance Persistence: Stores the simulated account balance using local storage, allowing it to persist between browser sessions without a full backend.
- Smart Financial Advice Tool: Generates a personalized or general financial tip after certain transactions (e.g., after deposit/withdrawal or checking balance), leveraging generative AI to offer relevant insights.

## Style Guidelines:

- Primary color: A confident, deep blue (#1466CC), evoking trust and stability in a banking context. (HSL: 210, 80%, 40%)
- Background color: A very light, subtle blue-grey (#F0F5FA) for a clean and professional aesthetic. (HSL: 210, 15%, 95%)
- Accent color: A vibrant aqua-cyan (#44D1DE) used for highlighting interactive elements and notifications, creating contrast and dynamism. (HSL: 180, 70%, 55%)
- Body and headline font: 'Inter', a modern grotesque sans-serif for clear, objective display of all numerical data and instructional text, ensuring high readability.
- Use crisp, minimalist icons for ATM operations (deposit, withdraw, balance) to enhance visual clarity and intuitiveness. Focus on solid-fill or outlined styles for a modern feel.
- Implement a clean, card-based layout for primary ATM operations, ensuring large, legible input fields and prominent display of balances and messages. Designed to be responsive across devices.
- Incorporate subtle micro-interactions, such as smooth fades for content changes or a slight scale-up effect on button hovers, to provide delightful visual feedback for user actions.
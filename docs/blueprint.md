# **App Name**: Ìṣúná

## Core Features:

- Transaction Management: Create, edit, and delete transactions with details like date, type (sale/expense), amount, payment method, and description.
- Daily Logging: Start and close daily sessions, recording opening cash, calculating total sales, expenses, and profit for each day, and saving daily summaries.
- Debt Tracking: Maintain a debt book to track amounts owed to or by others, including contact names and last updated dates.
- Data Persistence: Save application data, including transactions, daily logs, debts, and profile information, to the browser's localStorage for offline access.
- Reporting and Analytics: Generate reports summarizing financial data, including daily logs with sales, expenses, and profit, and offer options to download reports as PDF files using jspdf.
- Settings Management: Allow users to manage their profile, switch themes (light/dark/system) using next-themes, and change the currency with automatic data conversion based on exchange rates. Provide a 'Danger Zone' with a button to reset the app and clear all data.
- Transaction Description Suggestions: When entering a new transaction description, get suggestions from an LLM of similar phrases used in the past, powered by generative AI. The LLM will use a tool to analyze past transactions and present the suggestions.

## Style Guidelines:

- Primary color: Strong blue (#2e5984), suggesting stability, trust, and clarity, aligning with the app's financial focus.
- Background color: Very light blue (#f0f3f5), nearly white, to ensure content legibility and create a clean, professional feel in line with the application's purpose.
- Accent color: Yellow-orange (#e48228) to highlight key actions and important data points, like calls to action or totals. This offers a vibrant contrast, catching the user's attention strategically.
- Body and headline font: 'Inter', sans-serif, with a modern, machined, objective, neutral look; suitable for both headlines and body text.
- Use consistent and clear icons from `lucide-react` to represent transaction types, categories, and actions. Icons should be minimalistic and easily recognizable.
- Implement a clean and intuitive layout with a bottom navigation bar for easy access to main views. Utilize cards and lists for displaying data in a structured manner.
- Incorporate subtle animations for transitions and interactions to enhance user experience, such as sliding modals or fading effects when loading data.
- Tailwind CSS configuration should include a `fade-in` animation for smooth component loading.
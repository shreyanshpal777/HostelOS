# Hostel Group Management AI

MERN + AI platform for centralized hostel user management, WhatsApp communication, role-based leadership, education resources, task workflows, complaints, and AI automation.

## Structure

- `client`: React + Vite frontend
- `server`: Express + MongoDB API

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the server environment file:

   ```bash
   cp server/.env.example server/.env
   ```

3. Fill MongoDB, Gemini, JWT, and WhatsApp values in `server/.env`.

4. Run both apps:

   ```bash
   npm run dev
   ```

## WhatsApp Options

For production, use the official WhatsApp Business Cloud API through Meta. You will need:

- A Meta developer app
- A WhatsApp Business Account
- A phone number ID
- A permanent or system-user access token
- Approved message templates for proactive messages such as birthdays, deadlines, and reminders

The server is prepared with environment variables and a service wrapper so another provider such as Twilio can be added later if needed.

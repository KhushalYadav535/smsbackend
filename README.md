# Society Management System Backend

## Setup

1. Install dependencies:
   ```
npm install
   ```
2. Configure your `.env` file (see `.env` for example).
3. Create the MySQL database and tables:
   - Create a database named `sms_db` (or as per your `.env`)
   - Run the SQL in `models/init.sql` to create tables.
4. Start the server:
   ```
npm start
   ```

## API Endpoints
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register

Add more endpoints for members, accounting, reports, notices, complaints, and settings as needed.

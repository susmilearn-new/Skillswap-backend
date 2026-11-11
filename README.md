# SkillSwap Backend

Backend API for **SkillSwap – Community Learning Exchange**.  
The backend provides authentication, user profiles, skill matching, saved users, swap requests, community data, and AI-powered features.

## Live Backend

**API Base URL:**  
https://skillswap-backend-ofwf.onrender.com/api

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Groq API
- CORS

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Password hashing using bcryptjs

### User Management
- Get user profiles
- Update user profile
- Manage skills to teach
- Manage skills to learn
- Public community user listing
- Saved users

### Skill Matching
- Match users based on compatible skills
- Calculate match percentage
- Identify skills users can teach and learn
- Send skill exchange requests

### AI Features
- AI-powered skill matching
- AI-generated personalized learning paths
- Skill and learning recommendations

### Swap Requests
- Send swap requests
- View received and sent requests
- Accept or reject requests
- Track request status

## API Routes

Main API route groups include:

```text
/api/users
/api/users/profile
/api/users/community
/api/users/saved
/api/matches
/api/swap-requests
```

Some routes require JWT authentication.

## Database

The backend uses **MongoDB Atlas** for storing:

- User accounts
- User profiles
- Skills
- Saved users
- Swap requests

## Environment Variables

Create a `.env` file in the backend root:

```env
PORT=3001
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=your_frontend_url
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Do not commit the `.env` file or API keys to GitHub.

## Local Setup

Clone the repository and install dependencies:

```bash
npm install
```

Create your `.env` file and add the required environment variables.

Start the development server:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:3001
```

## Deployment

The backend is deployed using **Render**.

- **Backend:** Render
- **Database:** MongoDB Atlas
- **Frontend:** Vercel
- **AI:** Groq API

## Frontend

The SkillSwap frontend is deployed at:

https://skillswap-three-coral.vercel.app/

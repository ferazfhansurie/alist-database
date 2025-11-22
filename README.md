# KOL Database Application

A Key Opinion Leader (KOL) management system built with React and Neon PostgreSQL.

## Features

- **Dashboard**: Overview of KOL statistics and recent activity
- **Social Media KOLs**: Manage Instagram, TikTok, Facebook influencers
- **Twitter/Thread KOLs**: Manage Twitter and Thread influencers
- **Bloggers**: Manage blog-based influencers
- **Production Talent**: Manage models, actors, voice talents
- **Real-time Database**: PostgreSQL database with Neon cloud hosting

## Tech Stack

- **Frontend**: React 18, Vite, Chakra UI, Framer Motion
- **Backend**: Node.js, Express
- **Database**: Neon PostgreSQL (cloud-hosted)
- **Styling**: CSS-in-JS with Chakra UI

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database account

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd KOL
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Configuration

The application is already configured to use your Neon PostgreSQL database. The connection string is hardcoded in the server configuration.

### 4. Start the application

#### Option 1: Run both server and frontend (recommended)
```bash
npm run dev:full
```

#### Option 2: Run server and frontend separately
```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## Database Schema

The application automatically creates the following database structure:

### Tables
- **kols**: Main KOL information
- **niches**: KOL niches/categories
- **kol_niches**: Junction table for KOL-niche relationships

### Enums
- **kol_type**: social-media, twitter-thread, blogger, production-talent
- **tier**: Tier 1 (Premium), Tier 2 (Mid-tier), Tier 3 (Emerging), Tier 4 (Micro)
- **gender**: Male, Female, Other
- **hair_style**: Hijab, Free Hair
- **race**: Malay, Chinese, Indian, Other Asian, Caucasian, African, Mixed Race, Other
- **state**: Malaysian states
- **pic**: Amir, Tika, Aina

## API Endpoints

- `GET /api/kols` - Get all KOLs
- `GET /api/kols/type/:type` - Get KOLs by type
- `GET /api/kols/:id` - Get KOL by ID
- `POST /api/kols` - Create new KOL
- `PUT /api/kols/:id` - Update KOL
- `DELETE /api/kols/:id` - Delete KOL (soft delete)
- `GET /api/kols/stats` - Get KOL statistics
- `GET /api/niches` - Get all niches
- `GET /api/health` - Health check

## Data Migration

The application automatically migrates sample data on first run. This includes:
- Default niches (Fashion & Beauty, Lifestyle, Technology, etc.)
- Sample KOL records for testing

## Project Structure

```
KOL/
├── src/
│   ├── components/          # React components
│   ├── contexts/            # React contexts (DatabaseContext)
│   ├── data/                # Data models and sample data
│   └── App.jsx              # Main application component
├── server.js                # Express backend server
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Development

### Adding New KOL Types

1. Update the `KOL_TYPES` enum in `src/data/models.js`
2. Add corresponding database enum in `server.js`
3. Create new component in `src/components/`
4. Add route in `src/App.jsx`

### Database Changes

1. Modify the schema in `server.js` initialization
2. Update the frontend models accordingly
3. Test the migration process

## Troubleshooting

### Database Connection Issues
- Verify your Neon database is running
- Check the connection string in `server.js`
- Ensure SSL is properly configured

### Frontend Not Loading Data
- Check if the backend server is running on port 3001
- Verify CORS is enabled
- Check browser console for API errors

### Port Conflicts
- Change the server port in `server.js` if 3001 is occupied
- Update the frontend API calls accordingly

## Production Deployment

For production deployment:

1. Set environment variables for database connection
2. Configure proper CORS settings
3. Set up reverse proxy (nginx)
4. Use PM2 or similar for process management
5. Configure SSL certificates

## License

This project is proprietary software.

## Support

For issues and questions, please contact the development team.

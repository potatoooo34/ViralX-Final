# Disease Management System - React Frontend

A modern, responsive React frontend for the Disease Management System built with TypeScript, Material-UI, and Recharts.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Patients.tsx
│   │   ├── Hospitals.tsx
│   │   ├── Statistics.tsx
│   │   └── ContactTracing.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Features

### Dashboard
- Real-time statistics overview
- Key performance indicators
- System summary

### Patient Management
- View all patients
- Patient status tracking
- Symptom and contact information
- Add new patients (coming soon)

### Hospital Management
- Hospital capacity monitoring
- Occupancy rate visualization
- Patient distribution
- Add new hospitals (coming soon)

### Statistics & Analytics
- Interactive charts and graphs
- Patient status distribution
- System overview metrics
- Key performance indicators

### Contact Tracing
- High-risk contact identification
- Infected patient tracking
- Contact network visualization
- Risk assessment

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Material-UI (MUI)** - Modern, accessible UI components
- **React Router** - Client-side routing
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client for API calls

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

### API Integration
The frontend automatically connects to the FastAPI backend running on port 8000. Make sure the backend is running before starting the frontend.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Key Components

### Layout
- Responsive sidebar navigation
- Mobile-friendly drawer
- Consistent header and navigation

### Dashboard Cards
- Real-time statistics
- Color-coded status indicators
- Interactive hover effects

### Data Visualization
- Pie charts for patient status distribution
- Bar charts for system overview
- Progress bars for hospital occupancy

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔄 Development Workflow

1. **Start the backend** (FastAPI server on port 8000)
2. **Start the frontend** (React dev server on port 3000)
3. **Make changes** to components or pages
4. **Hot reload** automatically updates the browser

## 🎨 Customization

### Theme
The application uses Material-UI's theming system. You can customize colors, typography, and spacing in `src/index.tsx`.

### Components
All components are modular and can be easily customized or extended.

## 📊 Data Flow

1. **API Service** (`services/api.ts`) handles all backend communication
2. **TypeScript types** ensure type safety across the application
3. **React hooks** manage component state and side effects
4. **Material-UI** provides consistent, accessible UI components

## 🔒 Security Features

- CORS enabled for backend communication
- Input validation on forms
- Error handling and user feedback
- Responsive design for all devices

## 🚀 Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🔄 Next Steps

1. Add patient creation forms
2. Implement hospital management forms
3. Add real-time updates with WebSockets
4. Implement user authentication
5. Add data export functionality
6. Add advanced filtering and search
7. Implement push notifications

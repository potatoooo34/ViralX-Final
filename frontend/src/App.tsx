import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Hospitals from './pages/Hospitals';
import Statistics from './pages/Statistics';
import ContactTracing from './pages/ContactTracing';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/contact-tracing" element={<ContactTracing />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;

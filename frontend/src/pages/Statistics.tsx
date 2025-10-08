import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { StatisticsOverview } from '../types';
import { statisticsApi } from '../services/api';

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await statisticsApi.getOverview();
        setStatistics(data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!statistics) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No statistics available
      </Alert>
    );
  }

  // Prepare data for charts
  const patientStatusData = [
    { name: 'Infected', value: statistics.total_infected, color: '#f44336' },
    { name: 'Recovered', value: statistics.total_recovered, color: '#4caf50' },
    { name: 'Deceased', value: statistics.total_deceased, color: '#9e9e9e' },
    { name: 'Under Observation', value: statistics.total_patients - statistics.total_infected - statistics.total_recovered - statistics.total_deceased, color: '#ff9800' },
  ];

  const systemData = [
    { name: 'Patients', value: statistics.total_patients },
    { name: 'Hospitals', value: statistics.total_hospitals },
    { name: 'States', value: statistics.total_states },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistics & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Patient Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patientStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Performance Indicators
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {(statistics.fatality_rate * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fatality Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {(statistics.average_hospital_occupancy * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Hospital Occupancy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {statistics.total_patients > 0 ? (statistics.total_recovered / statistics.total_patients * 100).toFixed(1) : 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Recovery Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {statistics.total_hospitals > 0 ? (statistics.total_patients / statistics.total_hospitals).toFixed(1) : 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patients per Hospital
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Healing as HealingIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { StatisticsOverview } from '../types';
import { statisticsApi } from '../services/api';

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box color={color}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={statistics.total_patients}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>

        {/* Infected Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Infected Patients"
            value={statistics.total_infected}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="error.main"
            subtitle={`${((statistics.total_infected / statistics.total_patients) * 100).toFixed(1)}% of total`}
          />
        </Grid>

        {/* Recovered Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recovered Patients"
            value={statistics.total_recovered}
            icon={<HealingIcon sx={{ fontSize: 40 }} />}
            color="success.main"
            subtitle={`${((statistics.total_recovered / statistics.total_patients) * 100).toFixed(1)}% of total`}
          />
        </Grid>

        {/* Deceased Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Deceased Patients"
            value={statistics.total_deceased}
            icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
            color="grey.600"
            subtitle={`${(statistics.fatality_rate * 100).toFixed(1)}% fatality rate`}
          />
        </Grid>

        {/* Hospitals */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Hospitals"
            value={statistics.total_hospitals}
            icon={<HospitalIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>

        {/* States */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total States"
            value={statistics.total_states}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="secondary.main"
          />
        </Grid>

        {/* Hospital Occupancy */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Hospital Occupancy"
            value={`${(statistics.average_hospital_occupancy * 100).toFixed(1)}%`}
            icon={<HospitalIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>

        {/* Fatality Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overall Fatality Rate"
            value={`${(statistics.fatality_rate * 100).toFixed(1)}%`}
            icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Quick Stats Summary */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Summary
            </Typography>
            <Typography variant="body1" color="textSecondary">
              The disease management system is currently tracking {statistics.total_patients} patients 
              across {statistics.total_states} states and {statistics.total_hospitals} hospitals. 
              The current fatality rate is {(statistics.fatality_rate * 100).toFixed(1)}%, 
              with an average hospital occupancy of {(statistics.average_hospital_occupancy * 100).toFixed(1)}%.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;

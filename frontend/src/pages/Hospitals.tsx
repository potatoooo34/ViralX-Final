import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Hospital } from '../types';
import { hospitalsApi } from '../services/api';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const data = await hospitalsApi.getAll();
        setHospitals(data);
      } catch (err) {
        setError('Failed to load hospitals');
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const getOccupancyColor = (occupancyRate: number) => {
    if (occupancyRate >= 0.9) return 'error';
    if (occupancyRate >= 0.7) return 'warning';
    return 'success';
  };

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Hospitals Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Open add hospital dialog
            console.log('Add hospital clicked');
          }}
        >
          Add Hospital
        </Button>
      </Box>

      <Grid container spacing={3}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={4} key={hospital.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hospital.name}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Capacity: {hospital.current_patients} / {hospital.max_capacity}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={hospital.occupancy_rate * 100}
                    color={getOccupancyColor(hospital.occupancy_rate) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {Math.round(hospital.occupancy_rate * 100)}% occupied
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Available: {hospital.available_capacity} beds
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Infected: {hospital.total_infected}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Recovered: {hospital.total_recovered}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Deceased: {hospital.total_deceased}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Fatality Rate: {(hospital.fatality_rate * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {hospitals.length === 0 && (
        <Alert severity="info">
          No hospitals found. Add your first hospital to get started.
        </Alert>
      )}
    </Box>
  );
};

export default Hospitals;

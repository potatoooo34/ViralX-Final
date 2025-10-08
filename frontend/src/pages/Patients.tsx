import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Patient } from '../types';
import { patientsApi } from '../services/api';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientsApi.getAll();
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Infected':
        return 'error';
      case 'Recovered':
        return 'success';
      case 'Deceased':
        return 'default';
      case 'Under Observation':
        return 'warning';
      case 'Free':
        return 'info';
      default:
        return 'default';
    }
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
          Patients Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Open add patient dialog
            console.log('Add patient clicked');
          }}
        >
          Add Patient
        </Button>
      </Box>

      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {patient.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Age: {patient.age}
                </Typography>
                <Box mb={2}>
                  <Chip
                    label={patient.status}
                    color={getStatusColor(patient.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Symptoms: {patient.symptoms.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contacts: {patient.contacts.length}
                </Typography>
                {patient.hospital_id && (
                  <Typography variant="body2" color="textSecondary">
                    Hospital ID: {patient.hospital_id}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {patients.length === 0 && (
        <Alert severity="info">
          No patients found. Add your first patient to get started.
        </Alert>
      )}
    </Box>
  );
};

export default Patients;

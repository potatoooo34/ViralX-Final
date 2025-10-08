import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { Patient } from '../types';
import { patientsApi } from '../services/api';

const ContactTracing: React.FC = () => {
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

  const getHighRiskContacts = () => {
    return patients.filter(patient => 
      patient.contacts.some(contact => contact.high_risk)
    );
  };

  const getInfectedPatients = () => {
    return patients.filter(patient => patient.status === 'Infected');
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

  const highRiskPatients = getHighRiskContacts();
  const infectedPatients = getInfectedPatients();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Tracing
      </Typography>

      <Grid container spacing={3}>
        {/* High Risk Contacts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                High Risk Contacts ({highRiskPatients.length})
              </Typography>
              {highRiskPatients.length > 0 ? (
                <Box>
                  {highRiskPatients.map((patient) => (
                    <Box key={patient.id} mb={2} p={2} border="1px solid #f44336" borderRadius={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        {patient.name} (Age: {patient.age})
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Status: {patient.status}
                      </Typography>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          High Risk Contacts: {patient.contacts.filter(c => c.high_risk).length}
                        </Typography>
                        {patient.contacts.filter(c => c.high_risk).map((contact) => (
                          <Chip
                            key={contact.id}
                            label={`Contact ID: ${contact.contact_patient_id}`}
                            color="error"
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="success">
                  No high risk contacts found
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Infected Patients */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Infected Patients ({infectedPatients.length})
              </Typography>
              {infectedPatients.length > 0 ? (
                <Box>
                  {infectedPatients.map((patient) => (
                    <Box key={patient.id} mb={2} p={2} border="1px solid #f44336" borderRadius={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        {patient.name} (Age: {patient.age})
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Hospital ID: {patient.hospital_id || 'Not admitted'}
                      </Typography>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Total Contacts: {patient.contacts.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Symptoms: {patient.symptoms.length}
                        </Typography>
                        {patient.symptoms.map((symptom) => (
                          <Chip
                            key={symptom.id}
                            label={`${symptom.name} (${symptom.severity})`}
                            color="warning"
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  No infected patients found
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Network Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Network Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {patients.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Patients
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error">
                      {infectedPatients.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Infected Patients
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning">
                      {highRiskPatients.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      High Risk Contacts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info">
                      {patients.reduce((total, patient) => total + patient.contacts.length, 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Contacts
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

export default ContactTracing;

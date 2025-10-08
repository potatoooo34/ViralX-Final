import axios from 'axios';
import {
  Country,
  State,
  Hospital,
  Patient,
  StatisticsOverview,
  PatientCreate,
  HospitalCreate,
  StateCreate,
  CountryCreate,
  PatientUpdate
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Countries API
export const countriesApi = {
  getAll: (): Promise<Country[]> =>
    api.get('/countries').then(res => res.data),
  
  create: (data: CountryCreate): Promise<Country> =>
    api.post('/countries', data).then(res => res.data),
};

// States API
export const statesApi = {
  getAll: (): Promise<State[]> =>
    api.get('/states').then(res => res.data),
  
  create: (data: StateCreate): Promise<State> =>
    api.post('/states', data).then(res => res.data),
  
  getHospitals: (stateId: number): Promise<Hospital[]> =>
    api.get(`/states/${stateId}/hospitals`).then(res => res.data),
};

// Hospitals API
export const hospitalsApi = {
  getAll: (): Promise<Hospital[]> =>
    api.get('/hospitals').then(res => res.data),
  
  getById: (id: number): Promise<Hospital> =>
    api.get(`/hospitals/${id}`).then(res => res.data),
  
  create: (data: HospitalCreate): Promise<Hospital> =>
    api.post('/hospitals', data).then(res => res.data),
  
  getPatients: (hospitalId: number): Promise<Patient[]> =>
    api.get(`/hospitals/${hospitalId}/patients`).then(res => res.data),
};

// Patients API
export const patientsApi = {
  getAll: (): Promise<Patient[]> =>
    api.get('/patients').then(res => res.data),
  
  getById: (id: number): Promise<Patient> =>
    api.get(`/patients/${id}`).then(res => res.data),
  
  create: (data: PatientCreate): Promise<Patient> =>
    api.post('/patients', data).then(res => res.data),
  
  update: (id: number, data: PatientUpdate): Promise<Patient> =>
    api.put(`/patients/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/patients/${id}`).then(res => res.data),
};

// Statistics API
export const statisticsApi = {
  getOverview: (): Promise<StatisticsOverview> =>
    api.get('/statistics/overview').then(res => res.data),
};

export default api;

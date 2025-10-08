// API Response Types
export interface Country {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
  total_patients: number;
  total_infected: number;
  total_recovered: number;
  total_deceased: number;
  fatality_rate: number;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  created_at: string;
  updated_at?: string;
  total_patients: number;
  total_infected: number;
  total_recovered: number;
  total_deceased: number;
  fatality_rate: number;
}

export interface Hospital {
  id: number;
  name: string;
  state_id: number;
  max_capacity: number;
  created_at: string;
  updated_at?: string;
  current_patients: number;
  available_capacity: number;
  occupancy_rate: number;
  total_patients: number;
  total_infected: number;
  total_recovered: number;
  total_deceased: number;
  fatality_rate: number;
}

export interface Symptom {
  id: number;
  name: string;
  severity: number;
  patient_id: number;
  created_at: string;
}

export interface TestResult {
  id: number;
  patient_id: number;
  test_type: 'ViralX' | 'Genomic';
  result: 'Positive' | 'Negative';
  conducted_at: string;
}

export interface Contact {
  id: number;
  patient_id: number;
  contact_patient_id: number;
  high_risk: boolean;
  created_at: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  status: 'Under Observation' | 'Infected' | 'Recovered' | 'Deceased' | 'Free';
  admit_status: boolean;
  deceased: boolean;
  hospital_id?: number;
  created_at: string;
  updated_at?: string;
  symptoms: Symptom[];
  test_results: TestResult[];
  contacts: Contact[];
}

export interface StatisticsOverview {
  total_patients: number;
  total_infected: number;
  total_recovered: number;
  total_deceased: number;
  fatality_rate: number;
  total_hospitals: number;
  total_states: number;
  average_hospital_occupancy: number;
}

// Form Types
export interface PatientCreate {
  name: string;
  age: number;
  symptoms: SymptomCreate[];
  contacts: ContactCreate[];
}

export interface PatientUpdate {
  name?: string;
  age?: number;
  status?: 'Under Observation' | 'Infected' | 'Recovered' | 'Deceased' | 'Free';
  hospital_id?: number;
}

export interface SymptomCreate {
  name: string;
  severity: number;
}

export interface ContactCreate {
  contact_patient_id: number;
  high_risk: boolean;
}

export interface HospitalCreate {
  name: string;
  state_id: number;
  max_capacity: number;
}

export interface StateCreate {
  name: string;
  country_id: number;
}

export interface CountryCreate {
  name: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  success: false;
  error_code?: string;
}

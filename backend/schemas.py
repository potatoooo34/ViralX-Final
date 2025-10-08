from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

# Enums
class PatientStatus(str, Enum):
    UNDER_OBSERVATION = "Under Observation"
    INFECTED = "Infected"
    RECOVERED = "Recovered"
    DECEASED = "Deceased"
    FREE = "Free"

class TestType(str, Enum):
    VIRAL_X = "ViralX"
    GENOMIC = "Genomic"

class TestResult(str, Enum):
    POSITIVE = "Positive"
    NEGATIVE = "Negative"

# Base schemas
class CountryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class CountryCreate(CountryBase):
    pass

class Country(CountryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Computed fields
    total_patients: int = 0
    total_infected: int = 0
    total_recovered: int = 0
    total_deceased: int = 0
    fatality_rate: float = 0.0
    
    class Config:
        from_attributes = True

class StateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class StateCreate(StateBase):
    country_id: int

class State(StateBase):
    id: int
    country_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Computed fields
    total_patients: int = 0
    total_infected: int = 0
    total_recovered: int = 0
    total_deceased: int = 0
    fatality_rate: float = 0.0
    
    class Config:
        from_attributes = True

class HospitalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    max_capacity: int = Field(default=5, ge=1, le=1000)

class HospitalCreate(HospitalBase):
    state_id: int

class Hospital(HospitalBase):
    id: int
    state_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Computed fields
    current_patients: int = 0
    available_capacity: int = 0
    occupancy_rate: float = 0.0
    total_patients: int = 0
    total_infected: int = 0
    total_recovered: int = 0
    total_deceased: int = 0
    fatality_rate: float = 0.0
    
    class Config:
        from_attributes = True

class SymptomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    severity: int = Field(..., ge=1, le=100)

class SymptomCreate(SymptomBase):
    pass

class Symptom(SymptomBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestResultBase(BaseModel):
    test_type: TestType
    result: TestResult

class TestResultCreate(TestResultBase):
    pass

class TestResult(TestResultBase):
    id: int
    patient_id: int
    conducted_at: datetime
    
    class Config:
        from_attributes = True

class ContactBase(BaseModel):
    contact_patient_id: int
    high_risk: bool = False

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    age: int = Field(..., ge=0, le=150)

class PatientCreate(PatientBase):
    symptoms: List[SymptomCreate] = []
    contacts: List[ContactCreate] = []

class PatientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=150)
    status: Optional[PatientStatus] = None
    hospital_id: Optional[int] = None

class Patient(PatientBase):
    id: int
    status: PatientStatus
    admit_status: bool
    deceased: bool
    hospital_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relationships
    symptoms: List[Symptom] = []
    test_results: List[TestResult] = []
    contacts: List[Contact] = []
    
    class Config:
        from_attributes = True

# Statistics schemas
class StatisticsOverview(BaseModel):
    total_patients: int
    total_infected: int
    total_recovered: int
    total_deceased: int
    fatality_rate: float
    total_hospitals: int
    total_states: int
    average_hospital_occupancy: float

class HospitalStatistics(BaseModel):
    hospital: Hospital
    statistics: StatisticsOverview

class StateStatistics(BaseModel):
    state: State
    hospitals: List[Hospital]
    statistics: StatisticsOverview

# Test request schemas
class ConductTestRequest(BaseModel):
    test_type: TestType
    symptoms: List[SymptomCreate]

class UpdatePatientStatusRequest(BaseModel):
    status: PatientStatus

# Response schemas
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class ErrorResponse(BaseModel):
    message: str
    success: bool = False
    error_code: Optional[str] = None

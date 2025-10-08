from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from config import settings
from database import get_db, engine, Base
from models import Country, State, Hospital, Patient, Symptom, TestResult, Contact
from schemas import (
    Country as CountrySchema, CountryCreate,
    State as StateSchema, StateCreate,
    Hospital as HospitalSchema, HospitalCreate,
    Patient as PatientSchema, PatientCreate, PatientUpdate,
    StatisticsOverview, MessageResponse
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A modern disease management system for tracking patients, hospitals, and disease spread",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", response_model=MessageResponse)
async def root():
    return MessageResponse(message="Disease Management System API is running!")

# Health check endpoint
@app.get("/health", response_model=MessageResponse)
async def health_check():
    return MessageResponse(message="System is healthy")

# Country endpoints
@app.get("/countries", response_model=List[CountrySchema])
async def get_countries(db: Session = Depends(get_db)):
    countries = db.query(Country).all()
    return countries

@app.post("/countries", response_model=CountrySchema)
async def create_country(country: CountryCreate, db: Session = Depends(get_db)):
    db_country = Country(name=country.name)
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    return db_country

# State endpoints
@app.get("/states", response_model=List[StateSchema])
async def get_states(db: Session = Depends(get_db)):
    states = db.query(State).all()
    return states

@app.post("/states", response_model=StateSchema)
async def create_state(state: StateCreate, db: Session = Depends(get_db)):
    db_state = State(name=state.name, country_id=state.country_id)
    db.add(db_state)
    db.commit()
    db.refresh(db_state)
    return db_state

@app.get("/states/{state_id}/hospitals", response_model=List[HospitalSchema])
async def get_state_hospitals(state_id: int, db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).filter(Hospital.state_id == state_id).all()
    return hospitals

# Hospital endpoints
@app.get("/hospitals", response_model=List[HospitalSchema])
async def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    return hospitals

@app.post("/hospitals", response_model=HospitalSchema)
async def create_hospital(hospital: HospitalCreate, db: Session = Depends(get_db)):
    db_hospital = Hospital(
        name=hospital.name,
        state_id=hospital.state_id,
        max_capacity=hospital.max_capacity
    )
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

@app.get("/hospitals/{hospital_id}", response_model=HospitalSchema)
async def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital

@app.get("/hospitals/{hospital_id}/patients", response_model=List[PatientSchema])
async def get_hospital_patients(hospital_id: int, db: Session = Depends(get_db)):
    patients = db.query(Patient).filter(Patient.hospital_id == hospital_id).all()
    return patients

# Patient endpoints
@app.get("/patients", response_model=List[PatientSchema])
async def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    return patients

@app.post("/patients", response_model=PatientSchema)
async def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    # Create patient
    db_patient = Patient(name=patient.name, age=patient.age)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    # Add symptoms
    for symptom_data in patient.symptoms:
        symptom = Symptom(
            name=symptom_data.name,
            severity=symptom_data.severity,
            patient_id=db_patient.id
        )
        db.add(symptom)
    
    # Add contacts
    for contact_data in patient.contacts:
        contact = Contact(
            patient_id=db_patient.id,
            contact_patient_id=contact_data.contact_patient_id,
            high_risk=contact_data.high_risk
        )
        db.add(contact)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/patients/{patient_id}", response_model=PatientSchema)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.put("/patients/{patient_id}", response_model=PatientSchema)
async def update_patient(patient_id: int, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields
    if patient_update.name is not None:
        patient.name = patient_update.name
    if patient_update.age is not None:
        patient.age = patient_update.age
    if patient_update.status is not None:
        patient.status = patient_update.status
    if patient_update.hospital_id is not None:
        patient.hospital_id = patient_update.hospital_id
    
    db.commit()
    db.refresh(patient)
    return patient

# Statistics endpoints
@app.get("/statistics/overview", response_model=StatisticsOverview)
async def get_statistics_overview(db: Session = Depends(get_db)):
    total_patients = db.query(Patient).count()
    total_infected = db.query(Patient).filter(Patient.status == "Infected").count()
    total_recovered = db.query(Patient).filter(Patient.status == "Recovered").count()
    total_deceased = db.query(Patient).filter(Patient.status == "Deceased").count()
    total_hospitals = db.query(Hospital).count()
    total_states = db.query(State).count()
    
    fatality_rate = total_deceased / total_infected if total_infected > 0 else 0.0
    
    # Calculate average hospital occupancy
    hospitals = db.query(Hospital).all()
    if hospitals:
        total_occupancy = sum(h.get_occupancy_rate() for h in hospitals)
        average_occupancy = total_occupancy / len(hospitals)
    else:
        average_occupancy = 0.0
    
    return StatisticsOverview(
        total_patients=total_patients,
        total_infected=total_infected,
        total_recovered=total_recovered,
        total_deceased=total_deceased,
        fatality_rate=fatality_rate,
        total_hospitals=total_hospitals,
        total_states=total_states,
        average_hospital_occupancy=average_occupancy
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

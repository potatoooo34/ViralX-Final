"""
Data migration script to import existing data from the Java system
"""
import csv
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Country, State, Hospital, Patient, Symptom, Contact, TestResult
from schemas import TestType

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def migrate_hospitals_and_states():
    """Migrate hospital and state data from hospital.txt"""
    db = SessionLocal()
    try:
        # Create India country
        india = Country(name="INDIA")
        db.add(india)
        db.commit()
        db.refresh(india)
        
        # Read hospital.txt
        hospital_file = "../src/inputFiles/hospital.txt"
        if os.path.exists(hospital_file):
            with open(hospital_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if ';' in line:
                        state_name, hospitals_str = line.split(';')
                        
                        # Create state
                        state = State(name=state_name, country_id=india.id)
                        db.add(state)
                        db.commit()
                        db.refresh(state)
                        
                        # Create hospitals
                        hospital_names = [h.strip() for h in hospitals_str.split(',')]
                        for hospital_name in hospital_names:
                            hospital = Hospital(name=hospital_name, state_id=state.id)
                            db.add(hospital)
                        
                        db.commit()
                        print(f"Created state: {state_name} with {len(hospital_names)} hospitals")
        
    except Exception as e:
        print(f"Error migrating hospitals and states: {e}")
        db.rollback()
    finally:
        db.close()

def migrate_patients():
    """Migrate patient data from input.txt"""
    db = SessionLocal()
    try:
        # Get all hospitals for patient assignment
        hospitals = db.query(Hospital).all()
        hospital_index = 0
        
        # Read input.txt
        input_file = "../src/inputFiles/input .txt"
        if os.path.exists(input_file):
            with open(input_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if ';' in line:
                        patient_data, contacts_data = line.split(';')
                        
                        # Parse patient data
                        patient_parts = patient_data.split(',')
                        if len(patient_parts) >= 3:
                            patient_id = int(patient_parts[0])
                            patient_name = patient_parts[1]
                            patient_age = int(patient_parts[2])
                            
                            # Create patient
                            patient = Patient(
                                name=patient_name,
                                age=patient_age,
                                status="Under Observation"
                            )
                            db.add(patient)
                            db.commit()
                            db.refresh(patient)
                            
                            # Parse symptoms (pairs of name, severity)
                            symptoms = []
                            for i in range(3, len(patient_parts) - 1, 2):
                                if i + 1 < len(patient_parts):
                                    symptom_name = patient_parts[i]
                                    symptom_severity = int(patient_parts[i + 1])
                                    symptoms.append(Symptom(
                                        name=symptom_name,
                                        severity=symptom_severity,
                                        patient_id=patient.id
                                    ))
                            
                            # Add symptoms to database
                            for symptom in symptoms:
                                db.add(symptom)
                            
                            # Parse contacts (triplets of id, name, age)
                            contacts = []
                            if contacts_data:
                                contact_parts = contacts_data.split(',')
                                for i in range(0, len(contact_parts) - 2, 3):
                                    if i + 2 < len(contact_parts):
                                        contact_id = int(contact_parts[i])
                                        contact_name = contact_parts[i + 1]
                                        contact_age = int(contact_parts[i + 2])
                                        
                                        # Create contact patient
                                        contact_patient = Patient(
                                            name=contact_name,
                                            age=contact_age,
                                            status="Under Observation"
                                        )
                                        db.add(contact_patient)
                                        db.commit()
                                        db.refresh(contact_patient)
                                        
                                        # Create contact relationship
                                        contact = Contact(
                                            patient_id=patient.id,
                                            contact_patient_id=contact_patient.id,
                                            high_risk=False
                                        )
                                        db.add(contact)
                            
                            # Conduct tests and update status
                            patient.conduct_test("Genomic", symptoms)
                            patient.conduct_test("ViralX", symptoms)
                            
                            # Update patient status based on test results
                            if patient.status == "Under Observation":
                                # Simulate test results based on symptoms
                                total_severity = sum(s.severity for s in symptoms)
                                if total_severity >= 10:
                                    patient.status = "Infected"
                                elif total_severity >= 5:
                                    patient.status = "Infected"
                                else:
                                    patient.status = "Free"
                            
                            # Assign to hospital if infected
                            if patient.status == "Infected" and hospitals:
                                if hospital_index < len(hospitals):
                                    hospital = hospitals[hospital_index]
                                    if hospital.admit_patient(patient):
                                        hospital_index = (hospital_index + 1) % len(hospitals)
                            
                            db.commit()
                            print(f"Created patient: {patient_name} with {len(symptoms)} symptoms and {len(contacts)} contacts")
        
    except Exception as e:
        print(f"Error migrating patients: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main migration function"""
    print("Starting data migration...")
    
    # Create tables
    print("Creating database tables...")
    create_tables()
    
    # Migrate hospitals and states
    print("Migrating hospitals and states...")
    migrate_hospitals_and_states()
    
    # Migrate patients
    print("Migrating patients...")
    migrate_patients()
    
    print("Migration completed successfully!")

if __name__ == "__main__":
    main()

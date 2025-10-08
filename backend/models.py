from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Country(Base):
    __tablename__ = "countries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    states = relationship("State", back_populates="country", cascade="all, delete-orphan")
    
    def get_total_patients(self):
        return sum(state.get_total_patients() for state in self.states)
    
    def get_total_infected(self):
        return sum(state.get_total_infected() for state in self.states)
    
    def get_total_recovered(self):
        return sum(state.get_total_recovered() for state in self.states)
    
    def get_total_deceased(self):
        return sum(state.get_total_deceased() for state in self.states)
    
    def calculate_fatality_rate(self):
        total_infected = self.get_total_infected()
        if total_infected == 0:
            return 0.0
        return self.get_total_deceased() / total_infected

class State(Base):
    __tablename__ = "states"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    country_id = Column(Integer, ForeignKey("countries.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    country = relationship("Country", back_populates="states")
    hospitals = relationship("Hospital", back_populates="state", cascade="all, delete-orphan")
    
    def get_total_patients(self):
        return sum(hospital.get_total_patients() for hospital in self.hospitals)
    
    def get_total_infected(self):
        return sum(hospital.get_total_infected() for hospital in self.hospitals)
    
    def get_total_recovered(self):
        return sum(hospital.get_total_recovered() for hospital in self.hospitals)
    
    def get_total_deceased(self):
        return sum(hospital.get_total_deceased() for hospital in self.hospitals)
    
    def calculate_fatality_rate(self):
        total_infected = self.get_total_infected()
        if total_infected == 0:
            return 0.0
        return self.get_total_deceased() / total_infected

class Hospital(Base):
    __tablename__ = "hospitals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"))
    max_capacity = Column(Integer, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    state = relationship("State", back_populates="hospitals")
    patients = relationship("Patient", back_populates="hospital", cascade="all, delete-orphan")
    
    def admit_patient(self, patient):
        if len(self.patients) < self.max_capacity:
            patient.hospital_id = self.id
            patient.admit_status = True
            return True
        return False
    
    def get_current_patients(self):
        return len(self.patients)
    
    def get_available_capacity(self):
        return self.max_capacity - self.get_current_patients()
    
    def get_occupancy_rate(self):
        if self.max_capacity == 0:
            return 0.0
        return self.get_current_patients() / self.max_capacity
    
    def get_total_patients(self):
        return len(self.patients)
    
    def get_total_infected(self):
        return len([p for p in self.patients if p.status == "Infected"])
    
    def get_total_recovered(self):
        return len([p for p in self.patients if p.status == "Recovered"])
    
    def get_total_deceased(self):
        return len([p for p in self.patients if p.status == "Deceased"])
    
    def calculate_fatality_rate(self):
        total_infected = self.get_total_infected()
        if total_infected == 0:
            return 0.0
        return self.get_total_deceased() / total_infected

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    age = Column(Integer, nullable=False)
    status = Column(String(50), default="Under Observation")
    admit_status = Column(Boolean, default=False)
    deceased = Column(Boolean, default=False)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hospital = relationship("Hospital", back_populates="patients")
    symptoms = relationship("Symptom", back_populates="patient", cascade="all, delete-orphan")
    test_results = relationship("TestResult", back_populates="patient", cascade="all, delete-orphan")
    contacts = relationship("Contact", back_populates="patient", cascade="all, delete-orphan", foreign_keys="Contact.patient_id")
    
    def conduct_test(self, test_type: str, symptoms_data: list):
        """Conduct test based on symptoms"""
        total_severity = sum(symptom.severity for symptom in symptoms_data)
        
        if test_type == "Genomic":
            result = "Positive" if total_severity >= 5 else "Negative"
        else:  # ViralX
            result = "Positive" if total_severity >= 10 else "Negative"
        
        # Create test result
        test_result = TestResult(
            patient_id=self.id,
            test_type=test_type,
            result=result
        )
        return test_result
    
    def update_status(self, new_status: str):
        """Update patient status and handle related logic"""
        self.status = new_status
        
        if new_status == "Infected":
            # Mark all contacts as high risk
            for contact in self.contacts:
                contact.high_risk = True

class Symptom(Base):
    __tablename__ = "symptoms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    severity = Column(Integer, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="symptoms")

class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    test_type = Column(String(20), nullable=False)  # 'ViralX' or 'Genomic'
    result = Column(String(20), nullable=False)     # 'Positive' or 'Negative'
    conducted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="test_results")

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    contact_patient_id = Column(Integer, ForeignKey("patients.id"))
    high_risk = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="contacts", foreign_keys=[patient_id])
    contact_patient = relationship("Patient", foreign_keys=[contact_patient_id], overlaps="contacts")

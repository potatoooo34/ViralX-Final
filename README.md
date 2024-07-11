# Disease Management System

## Overview

The Disease Management System is a comprehensive hospital management system designed to track patients, hospitals, and states. It simulates the healthcare system's response to a disease outbreak by managing patients' data, hospital admissions, and regional statistics. This project is divided into several packages, each responsible for different aspects of the system.

## Packages

### Location Package

#### Classes:
1. **Country**
2. **State**
3. **Hospital**
4. **Region** (abstract)
5. **Display** (interface)

### Subject Package

#### Classes:
1. **Contact**
2. **Patient**
   - **TestResult** (nested class)
3. **Person** (abstract)

### Utility Package

#### Classes:
1. **all_data**
2. **Symptom**

## Detailed Class Descriptions

### Location Package

#### Interface `Display`
Defines a method to display data about a location.

#### Class `Country`
- **displayData()**: Displays data of the country and its sub-regions (states).
- **calculateFatalityRate()**: Calculates the fatality rate of the country.
- **addSubRegion(Region subRegion)**: Adds a sub-region (state) to the country.
- **getSubRegions()**: Returns an array of sub-regions (states).
- **getTotalPatients()**, **getTotalInfected()**, **getTotalRecovered()**, **getTotalDeceased()**: Calculate respective statistics.

#### Class `Region`
- **addSubObj(Region subRegion)**: Adds a sub-region.
- **addSubObj(Patient patient)**: Adds a patient.
- **admitToHospital(Patient patient)**: Abstract method for admitting patients to a hospital.
- **getName()**, **getSubRegions()**, **getPatients()**, **getTotalPatients()**, **getTotalInfected()**, **getTotalRecovered()**, **getTotalDeceased()**, **calculateFatalityRate()**, **displayData()**: Various getters and methods to calculate statistics and display data.

#### Class `State`
- **State(String name)**: Constructor.
- **displayData()**: Overridden method to display state data.

#### Class `Hospital`
- **Hospital(String name)**: Constructor.
- **admitToHospital(Patient patient)**: Admits a patient to the hospital.
- **getHospitalPatients()**: Returns the list of patients in the hospital.

### Subject Package

#### Class `Contact`
- **getPatient()**, **setPatient(Patient patient)**, **isHighRisk()**, **setHighRisk(boolean highRisk)**: Methods to manage contacts and their risk status.

#### Class `Patient`
- **setHighRiskContacts()**, **addContact(Contact contact)**, **addContact(Contact[] contacts)**, **getContacts()**, **addSymptom(Symptom symptom)**, **getAdmitStatus()**, **setAdmitStatus(boolean val)**, **isConfirmedCase()**, **getStatus()**, **conductTest(char testType, Symptom... symptoms)**, **getResult()**, **updateStatus(String status)**, **updateDeceased(boolean deceased)**, **getDeceased()**: Methods to manage patient details, symptoms, and status.

#### Abstract Class `Person`
- **getId()**, **getName()**, **getAge()**: Getters for person details.

### Utility Package

#### Class `all_data`
- **all_data()**: Constructor.
- **getPatients()**, **getStates()**, **getHospitals()**, **getCountry()**: Getters for various data.
- **readInputFromFile(String fileName)**: Reads patient data from file.
- **readInputFromFile(String fileName, Country country)**: Reads hospital and state data from file.

#### Class `Symptom`
- **Symptom(String name, int severity)**: Constructor.

### Main.java
The entry point for the program. It reads data from "input.txt" and "hospital.txt", creates patient and hospital objects, and manages the overall workflow of the system.

## Features
- Read data from input files.
- Manage patients, hospitals, and states.
- Assign infected patients to hospitals.
- Display comprehensive data about the healthcare system.
- Export data to CSV and text files.

## License
This project is licensed under the MIT License.


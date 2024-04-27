package utility;
import java.io.BufferedReader;
import java.io.FileReader;

import Location.Country;
import Location.Hospital;
import Location.State;
import Subject.Contact;
import Subject.Patient;

public class all_data {
    private Patient[] patients;
    private State[] states;
    private Hospital[] hospitals;
    private Country country;
    private static final int MAXI = 40;
    private int patientCount, stateCount, hospitalCount;
    public all_data()
    {
        this.patients = new Patient[MAXI];
        this.states = new State[MAXI];
        this.hospitals = new Hospital[MAXI];
        this.country = new Country("INDIA");
        this.patientCount = 0;
        this.stateCount = 0;
        this.hospitalCount = 0;
    }

    public Patient[] getPatients() {
        return patients;
    }

    // Getter method for states array
    public State[] getStates() {
        return states;
    }

    // Getter method for hospitals array
    public Hospital[] getHospitals() {
        return hospitals;
    }

    // Getter method for country
    public Country getCountry() {
        return country;
    }

    public void readInputFromFile(String fileName) {
        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            String line;
            int index = 0;
            while ((line = br.readLine()) != null) {
                String[] p1 = line.split(";");
                
                String[] parts1 = p1[0].split(",");
                String[] parts2 = p1[1].split(",");
                // for(int i = 0; i < parts.length; i ++)
                // {
                // System.out.println(i + ": " + parts[i]);
                // }
                if (parts1.length >= 3) {
                    int id = Integer.parseInt(parts1[0]);
                    String name = parts1[1];
                    int age = Integer.parseInt(parts1[2]);
                    Patient patient = new Patient(id, name, age);

                    // Add symptoms
                    // int contactStartIndex = 3 + (parts.length - 3) / 2;
                    for (int i = 3; i < parts1.length - 1; i += 2) {
                        // System.out.println(parts[i]);
                        String symptomName = parts1[i];
                        // System.out.println(symptomName);
                        int severity = Integer.parseInt(parts1[i + 1]);
                        patient.addSymptom(new Symptom(symptomName, severity));
                    }

                    
                    for (int i = 0; i < parts2.length - 2; i += 3) {
                        int contactId = Integer.parseInt(parts2[i]);
                        String contactName = parts2[i + 1];
                        // System.out.println(contactName);
                        int contactAge = Integer.parseInt(parts2[i + 2]);
                        patient.addContact(new Contact(contactId, contactName, contactAge, patient));
                    }

                    this.patients[patientCount++] = patient;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println("EXCEPTION HOGYA");
            e.printStackTrace();
        }
    }

    public void readInputFromFile(String fileName, Country country) {
        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(";");
                if (parts.length == 2) {
                    String stateName = parts[0];
                    String[] hospitalNames = parts[1].split(",");
                    State state = new State(stateName);

                    for(String hospitalName : hospitalNames)
                    {
                        Hospital hospital = new Hospital(hospitalName);
                        this.hospitals[hospitalCount++] = hospital;
                        state.addSubObj(hospital);
                    }
                    this.states[stateCount++] = state;
                    country.addSubObj(state);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
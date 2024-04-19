package Location;
import Subject.Patient;

public class Hospital extends Region {
    private Patient[] hospitalPatients;
    private int numHospitalPatients;
    static final int MAX_PATIENTS = 5;

    public Hospital(String name) {
        super(name);
        this.hospitalPatients = new Patient[Hospital.MAX_PATIENTS];
        this.numHospitalPatients = 0;
    }

    @Override
    protected void admitToHospital(Patient patient) {
        if (this.numHospitalPatients < Hospital.MAX_PATIENTS) {
            this.hospitalPatients[this.numHospitalPatients] = patient;
            this.numHospitalPatients++;
        }
    }

    public Patient[] getHospitalPatients() {
        // Patient[] hospitalPatientsCopy = new Patient[this.numHospitalPatients];
        // System.arraycopy(this.hospitalPatients, 0, hospitalPatientsCopy, 0, this.numHospitalPatients);
        // return hospitalPatientsCopy;
        return this.hospitalPatients;
    }
}
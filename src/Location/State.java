package Location;
import java.io.FileWriter;

public class State extends Region {
    public State(String name) {
        super(name);
    }

    @Override
    public void displayData() {
        System.out.println("State: " + getName());
        System.out.println("Total patients: " + getTotalPatients());
        System.out.println("Total infected: " + getTotalInfected());
        System.out.println("Total recovered: " + getTotalRecovered());
        System.out.println("Total deceased: " + getTotalDeceased());
        System.out.println("Fatality rate: " + calculateFatalityRate());


        // extract to csv
        try {
            FileWriter csvWriter = new FileWriter("data.csv", true);
            csvWriter.append("Name,Total Patients,Total Infected,Total Recovered,Total Deceased,Fatality Rate\n");
            csvWriter.append(getName() + "," + getTotalPatients() + "," + getTotalInfected() + "," + getTotalRecovered() + "," + getTotalDeceased() + "," + calculateFatalityRate() + "\n");
            csvWriter.flush();
            csvWriter.close();
        } catch (Exception e) {}

        // extract to txt
        try {
            FileWriter txtWriter = new FileWriter("data.txt", true);
            txtWriter.append("State: " + getName() + "\n");
            txtWriter.append("Total patients: " + getTotalPatients() + "\n");
            txtWriter.append("Total infected: " + getTotalInfected() + "\n");
            txtWriter.append("Total recovered: " + getTotalRecovered() + "\n");
            txtWriter.append("Total deceased: " + getTotalDeceased() + "\n");
            txtWriter.append("Fatality rate: " + calculateFatalityRate() + "\n");
            txtWriter.append("\n");
            txtWriter.flush();
            txtWriter.close();
        } catch (Exception e) {}

        // Display data for each hospital in the state
        System.out.println("Hospitals:");
        for (Region region : getSubRegions()) {
            region.displayData();
        }
    }

    
}
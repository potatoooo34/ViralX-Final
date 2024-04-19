package Location;
import java.io.FileWriter;
import java.io.IOException;

public class Country extends Region {
    public Country(String name) {
        super(name);
    }

    public void displayData() {
        System.out.println("Country: " + getName());
        System.out.println("Total patients: " + getTotalPatients());
        System.out.println("Total infected: " + getTotalInfected());
        //System.out.println("Total recovered: " + getTotalRecovered());
        System.out.println("Total deceased: " + getTotalDeceased());
        System.out.println("Fatality rate: " + calculateFatalityRate());

        // export to txt
        try {
            FileWriter txtWriter = new FileWriter("data.txt", true);
            txtWriter.append("Name: " + this.name + "\n");
            txtWriter.append("Total patients: " + this.getTotalPatients() + "\n");
            txtWriter.append("Total infected: " + this.getTotalInfected() + "\n");
            txtWriter.append("Total recovered: " + this.getTotalRecovered() + "\n");
            txtWriter.append("Total deceased: " + this.getTotalDeceased() + "\n");
            txtWriter.append("Fatality rate: " + this.calculateFatalityRate() + "\n");
            txtWriter.append("\n");
            txtWriter.flush();
            txtWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

       //disaplay for each state
        System.out.println("States:");
        for (Region region : getSubRegions()) {
            region.displayData();
        }
    }


}
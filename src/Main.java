import java.io.FileWriter;
import java.util.Scanner;

import Location.Country;
import Location.Hospital;
import Location.State;
import Subject.Patient;
import utility.all_data;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Do you want to add a patient? (Y/N)");
        String choice = sc.next();

         if (choice.equals("Y")) {
            int id;
            String name;
            int age;
            int n = 10;
            String[] symptom = new String[n];
            int[] severity = new int[n];
            int nc = 10;
            int[] c_id = new int[nc];
            String[] c_name = new String[nc];
            int[] c_age = new int[nc];
            System.out.println("Enter the id of the patient: ");
            id = sc.nextInt();
            System.out.println("Enter the name of the patient: ");
            name = sc.next();
            System.out.println("Enter the age of the patient: ");
            age = sc.nextInt();
            System.out.println("Enter number of symptoms of the patient: ");
            n = sc.nextInt();
            for (int i = 0; i < n; i++) {
                System.out.println("Enter the symptom " + (i + 1) + " of the patient: ");
                symptom[i] = sc.next();
                System.out.println("Enter the severity of the symptom: ");
                severity[i] = sc.nextInt();
            }
            nc = 0;
            System.out.println("Enter number of contacts of the patient: ");
            nc = sc.nextInt();

            for (int i = 0; i < nc; i++) {
                System.out.println("Enter the id of the contact " + (i + 1)+ " of the patient: ");
                c_id[i] = sc.nextInt();
                System.out.println("Enter the name of the contact " + (i + 1) + " of the patient: ");
                c_name[i] = sc.next();
                System.out.println("Enter the age of the contact " + (i + 1)+ " of the patient: ");
                c_age[i] = sc.nextInt();
            }
            

            // append to input.txt file
            try {
                FileWriter fw = new FileWriter("inputFiles/input.txt", true);
                fw.append("\n");
                fw.append(Integer.toString(id));
                fw.append(",");
                fw.append(name);
                fw.append(",");
                fw.append(Integer.toString(age));
                fw.append(",");
                for (int i = 0; i < n; i++) {
                    fw.append(symptom[i]);
                    fw.append(",");
                    fw.append(Integer.toString(severity[i]));
                    if (i != n - 1)
                        fw.append(",");
                }
                fw.append(";");
                for (int i = 0; i < nc; i++) {
                    fw.append(Integer.toString(c_id[i]));
                    fw.append(",");
                    fw.append(c_name[i]);
                    fw.append(",");
                    fw.append(Integer.toString(c_age[i]));
                    if (i != nc - 1)
                        fw.append(",");
                }
                fw.flush();
                fw.close();
            } catch (Exception e) {
                // TODO: handle exception
            }

        }
        sc.close();

        //getting data from all the 
        
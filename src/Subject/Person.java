package Subject;

abstract class Person {
    private int id;
    private String name;
    private int age;

    Person(int id,String name, int age ){
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public int getId(){
        return this.id;
    }
    public String getName(){
        return this.name;
    }

    public int getAge(){
        return this.age;
        
    }
}
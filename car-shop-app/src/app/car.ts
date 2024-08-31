export class Car {
    
    id!: number;
    make!: string; 
    model!: string; 
    color!: string;
    volume!: number;
    mileage!: number;
    year!: number;

    static labels: { [id: string] : string; } = {
        make: "Марка", 
        model: "Модель", 
        color: "Цвет", 
        volume: "Объем, см3", 
        mileage: "Пробег, км", 
        year: "Год выпуска", 
    }

    static createFromValues(obj: any){
        var car = new Car();

        try {
            car.id = obj.id;
            car.make = obj.make;
            car.model = obj.model; 
            car.color = obj.color;
            car.volume = obj.volume;
            car.mileage = obj.mileage;
            car.year = obj.year;
            
            return car;
        }
        catch {
            return undefined;
        }
    }
}


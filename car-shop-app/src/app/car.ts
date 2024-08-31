export class Car {
    
    Id!: number;
    Make!: string; 
    Model!: string; 
    Color!: string;
    Volume!: number;
    Mileage!: number;
    Year!: number;

    static labels: { [id: string] : string; } = {
        Make: "Марка", 
        Model: "Модель", 
        Color: "Цвет", 
        Volume: "Объем, см3", 
        Mileage: "Пробег, км", 
        Year: "Год выпуска", 
    }

    static createFromValues(obj: any){
        var car = new Car();

        try {
            car.Id = obj.Id;
            car.Make = obj.Make;
            car.Model = obj.Model; 
            car.Color = obj.Color;
            car.Volume = obj.Volume;
            car.Mileage = obj.Mileage;
            car.Year = obj.Year;
            
            return car;
        }
        catch {
            return undefined;
        }
    }
}


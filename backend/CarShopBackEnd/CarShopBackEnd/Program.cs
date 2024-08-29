

var builder = WebApplication.CreateBuilder(args);

var corsAllowAnyOriginPolicy = "Cors-Policy";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsAllowAnyOriginPolicy,
                           policy =>
                           {
                               //policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
                               policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                           });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

List<Car> cars = new List<Car>() {
    new Car("BMW", "3er", "White", "2998", "5000", "2023"),
    new Car("Mercedes", "GLE", "Silver", "3500", "60000", "2019"),
    new Car("Porsche", "Cayenne", "Blue", "4500", "600000", "2009")
    };

app.MapGet("/cars", () => {         
    return cars.ToArray();
});

app.MapGet("/car/{id}", (string id) => {
    foreach (var car in cars)
        if (car.Id.ToString() == id)
            return car;
    
    return null;
});

app.MapPost("/car", (Car car) => {
    cars.Add(car);
    Console.WriteLine("added");
});


app.MapPut("/car/{id}", (string id, Car car) => {
    
    for (int i = cars.Count - 1; i >= 0; i--)
        if (cars[i].Id.ToString() == id)
        {
            cars[i] = car;
            Console.WriteLine("changed");
        }    
});


app.MapDelete("/car/{id}", (string id) => {
    for(int i=cars.Count-1; i>=0; i--)
        if (cars[i].Id.ToString() == id)
            cars.Remove(cars[i]);
});


app.UseCors(corsAllowAnyOriginPolicy);

app.Run();

public class Car
{
    public Guid Id { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public string Color { get; set; }
    public string Volume { get; set; }
    public string Mileage { get; set; }
    public string Year { get; set; }

    public Car(string make, string model, string color, string volume, string mileage, string year)
    {
        Id = Guid.NewGuid();
        Make = make;
        Model = model;
        Color = color;
        Volume = volume;
        Mileage = mileage;
        Year = year;
    }
}

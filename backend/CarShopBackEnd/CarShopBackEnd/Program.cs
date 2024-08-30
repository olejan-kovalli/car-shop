
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.Drawing;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

//app.UseHttpsRedirection();

var connString = "Host=localhost;Port=5433;Username=postgres;Password=pass123;Database=car_shop;";

await using var conn = new Npgsql.NpgsqlConnection(connString);
await conn.OpenAsync();

List<Car> cars = new List<Car>() {
    new Car("1", "BMW", "3er", "White", "2998", "5000", "2023"),
    new Car("2", "Mercedes", "GLE", "Silver", "3500", "60000", "2019"),
    new Car("3", "Porsche", "Cayenne", "Blue", "4500", "600000", "2009")
    };

app.MapGet("/cars", async () => {
    
    cars = new List<Car>();
    
    await using (var cmd = new Npgsql.NpgsqlCommand("SELECT * FROM cars", conn))
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            var id = reader.GetInt32(0);
            var make = reader.GetString(1);
            var model = reader.GetString(2);
            var color = reader.GetString(3);
            var volume = reader.GetInt32(4);
            var mileage = reader.GetInt32(5);
            var year = reader.GetInt32(6);

            cars.Add(new Car(id.ToString(), make, model, color, volume.ToString(), mileage.ToString(), year.ToString()));
        }
    }

    return JsonSerializer.Serialize(cars);//.ToArray();
});

app.MapGet("/car/{id}", async (string id) => {

/*
foreach (var car in cars)
    if (car.Id.ToString() == id)
        return car;
*/

    await using (var cmd = new Npgsql.NpgsqlCommand("SELECT * FROM cars where ID=" + id, conn))
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            var _id = reader.GetInt32(0);
            var make = reader.GetString(1);
            var model = reader.GetString(2);
            var color = reader.GetString(3);
            var volume = reader.GetInt32(4);
            var mileage = reader.GetInt32(5);
            var year = reader.GetInt32(6);

            return JsonSerializer.Serialize(new Car(id.ToString(), make, model, color, volume.ToString(), mileage.ToString(), year.ToString()));
        }
    }
    //return null;

    return "";
});

string Quote(string s)
{
    return "'" + s + "'";
}

app.MapPost("/car", async(Car car) => {

    var values = "DEFAULT";
    values += "," + Quote(car.Make);
    values += "," + Quote(car.Model);
    values += "," + Quote(car.Color);
    values += "," + car.Volume;
    values += "," + car.Mileage;
    values += "," + car.Year;

    await using (var cmd = new Npgsql.NpgsqlCommand("INSERT INTO cars VALUES(" + values + ")", conn))
        await cmd.ExecuteNonQueryAsync();

    //cars.Add(car);
});


app.MapPut("/car/{id}", async (string id, Car car) => {

    string set = "make=" + Quote(car.Make);
    set += ", model=" + Quote(car.Model);
    set += ", color=" + Quote(car.Color);
    set += ", volume=" + car.Volume;
    set += ", mileage=" + car.Mileage;
    set += ", year=" + car.Year;

    await using (var cmd = new Npgsql.NpgsqlCommand("UPDATE cars SET " + set + " WHERE id=" + id, conn))
        await cmd.ExecuteNonQueryAsync();

    /*
    for (int i = cars.Count - 1; i >= 0; i--)
        if (cars[i].Id.ToString() == id)
        {
            cars[i] = car;
        }    
    */
});


app.MapDelete("/car/{id}", async(string id) => {
    await using (var cmd = new Npgsql.NpgsqlCommand("DELETE FROM cars WHERE id=" + id, conn))
        await cmd.ExecuteNonQueryAsync();
    /*
    for(int i=cars.Count-1; i>=0; i--)
        if (cars[i].Id.ToString() == id)
            cars.Remove(cars[i]);
    */
});


app.UseCors(corsAllowAnyOriginPolicy);

/*
await using (var cmd = new Npgsql.NpgsqlCommand("SELECT * FROM cars", conn))
await using (var reader = await cmd.ExecuteReaderAsync())
{
    while (await reader.ReadAsync())
    {
        Console.WriteLine(reader.GetInt32(0));
        Console.WriteLine(reader.GetString(1));
        Console.WriteLine(reader.GetString(2));
        Console.WriteLine(reader.GetString(3));
        Console.WriteLine(reader.GetInt32(4));
        Console.WriteLine(reader.GetInt32(5));
        Console.WriteLine(reader.GetInt32(6));
       
    }
}
*/
app.Run();

public class Car
{
    //TODO: change types
    public string Id { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public string Color { get; set; }
    public string Volume { get; set; }
    public string Mileage { get; set; }
    public string Year { get; set; }

    public Car(string id, string make, string model, string color, string volume, string mileage, string year)
    {
        Id = id;
        Make = make;
        Model = model;
        Color = color;
        Volume = volume;
        Mileage = mileage;
        Year = year;
    }
}

using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.Drawing;
using System.Net.Sockets;
using System.Net;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Npgsql.Replication.PgOutput.Messages.RelationMessage;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.Security.AccessControl;
using System.Linq.Expressions;

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
                               policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
                               //policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
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

string Quote(string s) 
{ 
    return "'" + s + "'"; 
}

var dbIp = Environment.GetEnvironmentVariable("DB_IP");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
var dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

var connString = 
    "Host=" + dbIp + ";" + 
    "Port=" + dbPort + ";" + 
    "Username=" + dbUser + ";" +
    "Password=" + dbPassword + ";" +
    "Database=" + dbName + ";";

await using var conn = new Npgsql.NpgsqlConnection(connString);

for (int i=1; i<=10; i++)
{
    try
    {
        Console.WriteLine("Trying to connect to database" + dbName + " at " + dbIp + ":" + dbPort + " " + dbUser);
        await conn.OpenAsync();
        break;
    }
    catch(Exception e)
    {
        Console.WriteLine("Error" + e.Message);
        Thread.Sleep(3000);
    }
}

app.MapGet("/cars", async () => {

    List<Car> cars = new List<Car>();
    
    await using (var cmd = new Npgsql.NpgsqlCommand("SELECT * FROM cars", conn))
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            object[] values = new object[reader.FieldCount];
            reader.GetValues(values);

            Car car = Car.CreateFromValues(values);
            if (car != null)
            {
                cars.Add(car);
            }
        }
    }

    return JsonSerializer.Serialize(cars);
});

app.MapGet("/car/{id}", async (string id) => {

    if (!Int32.TryParse(id, out int _))
        return string.Empty;

    await using (var cmd = new Npgsql.NpgsqlCommand("SELECT * FROM cars WHERE ID=" + id.Trim(), conn))
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            object[] values = new object[reader.FieldCount];
            reader.GetValues(values);

            Car car = Car.CreateFromValues(values);
            if (car != null)
            {
                return JsonSerializer.Serialize(car);
            }
        }
    }

    return string.Empty;
});

app.MapPost("/car", async(Car car) => {

    var values = "DEFAULT";
    values += "," + Quote(car.Make);
    values += "," + Quote(car.Model);
    values += "," + Quote(car.Color);
    values += "," + car.Volume;
    values += "," + car.Mileage;
    values += "," + car.Year;

    await using (var cmd = new Npgsql.NpgsqlCommand("INSERT INTO cars VALUES(" + values + ")", conn))
    {
        await cmd.ExecuteNonQueryAsync();
    }
});

app.MapPut("/car/{id}", async (string id, Car car) =>
{
    string set = "make=" + Quote(car.Make);
    set += ", model=" + Quote(car.Model);
    set += ", color=" + Quote(car.Color);
    set += ", volume=" + car.Volume;
    set += ", mileage=" + car.Mileage;
    set += ", year=" + car.Year;

    await using (var cmd = new Npgsql.NpgsqlCommand("UPDATE cars SET " + set + " WHERE id=" + id, conn))
    { 
        await cmd.ExecuteNonQueryAsync();
    }
});

app.MapDelete("/car/{id}", async(string id) => {
    await using (var cmd = new Npgsql.NpgsqlCommand("DELETE FROM cars WHERE id=" + id, conn))
    {
        await cmd.ExecuteNonQueryAsync();
    }
});


app.UseCors(corsAllowAnyOriginPolicy);

app.Run();

public class Car
{
    public int Id { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public string Color { get; set; }
    public int Volume { get; set; }
    public int Mileage { get; set; }
    public int Year { get; set; }

    public Car(int id, string make, string model, string color, int volume, int mileage, int year)
    {
        Id = id;
        Make = make;
        Model = model;
        Color = color;
        Volume = volume;
        Mileage = mileage;
        Year = year;
    }

    public static Car CreateFromValues(object[] values)
    {
        try
        {
            int id = (int)values[0];
            string make = (string)values[1];
            string model = (string)values[2];
            string color = (string)values[3];
            int volume = (int)values[4];
            int mileage = (int)values[5];
            int year = (int)values[6];

            return new Car(id, make, model, color, volume, mileage, year);
        }
        catch 
        {
            return null;
        }
    }
}
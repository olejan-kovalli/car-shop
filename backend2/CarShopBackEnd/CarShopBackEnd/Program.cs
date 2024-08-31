
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using CarShopBackEnd;

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

var dbIp = Environment.GetEnvironmentVariable("DB_IP");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
var dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

var connString = @"" +
    "Host=" + dbIp + ";" + 
    "Port=" + dbPort + ";" + 
    "Username=" + dbUser + ";" +
    "Password=" + dbPassword + ";" +
    "Database=" + dbName + ";";

var ctx = new CarsContext(connString);

app.MapGet("/cars", async () => {

    var cars = await ctx.cars.ToListAsync();

    return JsonSerializer.Serialize(cars);
});

app.MapGet("/car/{id}", async (string id) => {

    if (!Int32.TryParse(id, out _))
        return string.Empty;

    var cars = await ctx.cars.Where(c => c.id == Int32.Parse(id)).ToListAsync();

    if (cars.Count > 0)
        return JsonSerializer.Serialize(cars[0]);
    else
        return string.Empty;
});

app.MapPost("/car", async(Car car) => {

    if (car != null)
    {
        await ctx.cars.AddAsync(car);
        await ctx.SaveChangesAsync();
    }
});

app.MapPut("/car/{id}", async (string id, Car car) =>
{
    await ctx.cars
        .Where(c => c.id == Int32.Parse(id))
        .ExecuteUpdateAsync(setters => setters
        .SetProperty(c => c.make, car.make)
        .SetProperty(c => c.model, car.model)
        .SetProperty(c => c.color, car.color)
        .SetProperty(c => c.volume, car.volume)
        .SetProperty(c => c.mileage, car.mileage)
        .SetProperty(c => c.year, car.year)
        );

    await ctx.SaveChangesAsync(true);

    //
    ctx = new CarsContext(connString);
    //without this does not update records, only after back end is restarted

});


app.MapDelete("/car/{id}", async(string id) => {

    if (!Int32.TryParse(id, out _))
        return;

    await ctx.cars.Where(c => c.id == Int32.Parse(id)).ExecuteDeleteAsync();
    await ctx.SaveChangesAsync();
});

app.UseCors(corsAllowAnyOriginPolicy);

app.Run();
public class CarsContext : DbContext
{
    public DbSet<Car> cars { get; set; }

    private string connString = string.Empty;
    public CarsContext(string connString)
    {
        this.connString = connString;
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(this.connString);
}
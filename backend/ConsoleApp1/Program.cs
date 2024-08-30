using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Accelergreat.EntityFramework;
//using Npgsql;
using System.Reflection.PortableExecutable;
using Microsoft.Extensions.Logging;



// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

var connString = "Host=localhost;Port=5432;Username=postgres;Password=pass123;Database=car_shop;";

await using var conn = new Npgsql.NpgsqlConnection(connString);
await conn.OpenAsync();


// Retrieve all rows
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

await using var ctx = new BlogContext();
//await ctx.Database.EnsureDeletedAsync();
//await ctx.Database.EnsureCreatedAsync();

// Insert a Blog
//ctx.Blogs.Add(new() { Name = "FooBlog" });
//await ctx.SaveChangesAsync();

// Query all blogs who's name starts with F
var fBlogs = await ctx.Blogs.ToListAsync();

public class BlogContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(@"Host=localhost;Username=postgres;Password=pass123;Database=car_shop");
}

public class Blog
{
    public int Id { get; set; }
    public string Model { get; set; }
}
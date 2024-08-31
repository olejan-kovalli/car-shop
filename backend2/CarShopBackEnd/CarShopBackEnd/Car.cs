using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CarShopBackEnd
{
    public class Car
    {
        public int id { get; set; }
        public string make { get; set; }
        public string model { get; set; }
        public string color { get; set; }
        public int volume { get; set; }
        public int mileage { get; set; }
        public int year { get; set; }
    }
}

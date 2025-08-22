using KayraExportTask2Domain.Entities.Common;
using KayraExportTask2Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Domain.Entities
{
    public class User : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? PhoneNumber {  get; set; }
        public UserRole Role { get; set; } 

        // İlerleyen süreçlerde email verification tanımlanabilir.
        public bool IsEmainConfirmed { get; set; } = true;

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}

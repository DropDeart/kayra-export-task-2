using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.DTOs.ProductImageDTOs
{
    public class ProductImageDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public bool IsMain { get; set; }
    }
}

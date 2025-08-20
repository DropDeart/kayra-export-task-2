using KayraExportTask2Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Domain.Entities
{
    public class ProductImage : BaseEntity
    {
        public string FileName { get; set; }
        public string? FileDescription { get; set; }
        public string FileExtension { get; set; }
        public long FileSizeInBytes { get; set; }
        public string FilePath { get; set; }
        public bool IsMain { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }

}

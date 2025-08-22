using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.DTOs.ProductImageDTOs
{
    public class ProductImageUploadRequest
    {
        public List<IFormFile> Files { get; set; }
    }
}

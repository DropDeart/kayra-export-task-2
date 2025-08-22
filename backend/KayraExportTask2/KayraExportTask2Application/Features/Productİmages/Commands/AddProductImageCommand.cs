using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class AddProductImageCommand : IRequest<bool>
    {
        public Guid ProductId { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}

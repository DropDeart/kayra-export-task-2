using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class UpdateProductImageCommand : IRequest<bool>
    {
        public Guid ImageId { get; set; }
        public Guid ProductId { get; set; }
        public bool IsMain { get; set; }
    }
}

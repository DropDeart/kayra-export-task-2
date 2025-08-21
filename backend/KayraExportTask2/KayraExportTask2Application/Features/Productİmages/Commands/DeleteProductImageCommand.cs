using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class DeleteProductImageCommand : IRequest<bool>
    {
        public Guid ImageId { get; set; }
    }
}

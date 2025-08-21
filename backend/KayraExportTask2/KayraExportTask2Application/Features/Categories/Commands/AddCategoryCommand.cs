using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Categories.Commands
{
    public class AddCategoryCommand : IRequest<bool>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
    }
}

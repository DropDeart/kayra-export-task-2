using KayraExportTask2Application.DTOs.CategoryDTOs;
using KayraExportTask2Application.DTOs.ProductDTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Categories.Queries
{
    public class GetCategoriesQuery : IRequest<List<CategoryDto>>
    {
    }
}

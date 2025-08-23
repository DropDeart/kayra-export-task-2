using KayraExportTask2Application.DTOs.ProductImageDTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Queries
{
    public class GetProductImagesQuery : IRequest<List<ProductImageDto>>
    {
        public Guid Id { get; set; }
    }
}

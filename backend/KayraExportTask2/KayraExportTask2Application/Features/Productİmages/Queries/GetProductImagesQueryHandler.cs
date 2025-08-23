using KayraExportTask2Application.DTOs.ProductImageDTOs;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Queries
{
    public class GetProductImagesQueryHandler : IRequestHandler<GetProductImagesQuery, List<ProductImageDto>>
    {
        private readonly IReadRepositories<Product> _repository;

        public GetProductImagesQueryHandler(IReadRepositories<Product> readRepositories)
        {
            _repository = readRepositories;
        }

        public async Task<List<ProductImageDto>> Handle(GetProductImagesQuery request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetAll()
                                   .Include(p => p.Images)
                                   .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return new List<ProductImageDto>();
            }

            return product.Images?.Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                FileName = pi.FileName,
                FilePath = pi.FilePath
            }).ToList() ?? new List<ProductImageDto>();
        }
    }
}

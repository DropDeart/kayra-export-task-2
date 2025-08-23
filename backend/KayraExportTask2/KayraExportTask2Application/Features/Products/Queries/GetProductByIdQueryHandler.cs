using KayraExportTask2Application.DTOs.ProductDTOs;
using KayraExportTask2Application.DTOs.ProductImageDTOs;
using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Configurations;
using KayraExportTask2Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Products.Queries
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        private readonly IReadRepositories<Product> _readRepositories;
        private readonly ICacheService _cacheService;

        public GetProductByIdQueryHandler(IReadRepositories<Product> readRepositories, ICacheService cacheService)
        {
            _readRepositories = readRepositories;
            _cacheService = cacheService;
        }

        public async Task<ProductDto> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
        {
            var cacheKey = $"product:{query.Id}";
            var cachedProduct = await _cacheService.GetAsync<ProductDto>(cacheKey);
            if (cachedProduct != null)
            {
                return cachedProduct;
            }

            
            var products = _readRepositories.GetAll();
            
            var product = await products.Include(p => p.Images)
                                     .FirstOrDefaultAsync(p => p.Id == query.Id, cancellationToken);

            if (product == null)
            {
                throw new NotFoundException($"Ürün bulunamadı. Id : {query.Id}");
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Slug = product.Slug,
                CategoryId = product.CategoryId,
                ProductImages = product.Images != null
                ? product.Images.Select(pi => new ProductImageDto
                {
                    Id = pi.Id,
                    FileName = pi.FileName,
                    FilePath = pi.FilePath,
                    IsMain = pi.IsMain
                }).ToList()
                : new List<ProductImageDto>()
            };

            await _cacheService.SetAsync(cacheKey, productDto, TimeSpan.FromMinutes(15));

            return productDto;
        }
    }
}

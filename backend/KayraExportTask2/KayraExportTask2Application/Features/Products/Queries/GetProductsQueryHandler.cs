using KayraExportTask2Application.DTOs.ProductDTOs;
using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
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
    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
    { 

        private readonly IReadRepositories<Product> _readRepositories;
        private readonly ICacheService _cacheService;
        public GetProductsQueryHandler(IReadRepositories<Product> readRepositories, ICacheService cacheService)
        {
            _readRepositories = readRepositories;
            _cacheService = cacheService;

        }

        public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = "allproducts";

            var cachedProducts = await _cacheService.GetAsync<List<ProductDto>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = _readRepositories.GetAll().Include(p => p.Images).AsQueryable();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Slug = p.Slug,
            }).ToList();

            //Save to redis (caching 15 minutes)
            await _cacheService.SetAsync(cacheKey, productDtos, TimeSpan.FromMinutes(15));

            return productDtos;
        }
    }
}

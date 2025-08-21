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
    public class GetProductsByFilterQueryHandler : IRequestHandler<GetProductsByFilterQuery, List<ProductDto>>
    {
        private readonly IReadRepositories<Product> _readRepositories;
        private readonly ICacheService _cacheService;

        public GetProductsByFilterQueryHandler(IReadRepositories<Product> readRepositories, ICacheService cacheService)
        {
            _readRepositories = readRepositories;
            _cacheService = cacheService;
        }

        public async Task<List<ProductDto>> Handle(GetProductsByFilterQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = $"products:filtered:search={request.SearchText?.ToLower()}&minPrice={request.MinPrice}&maxPrice={request.MaxPrice}&categoryId={request.CategoryId}&page={request.PageNumber}&size={request.PageSize}&sort={request.SortBy?.ToLower()}";

            var cachedProducts = await _cacheService.GetAsync<List<ProductDto>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var query = _readRepositories.GetAll().Include(p => p.Images).AsQueryable();

            if (!string.IsNullOrEmpty(request.SearchText))
            {
                var searchTextLower = request.SearchText.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchTextLower) || p.Description.ToLower().Contains(searchTextLower));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }
            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
            }

            // Sıralama mantığı
            if (!string.IsNullOrEmpty(request.SortBy))
            {
                switch (request.SortBy.ToLowerInvariant())
                {
                    case "price_asc":
                        query = query.OrderBy(p => p.Price);
                        break;
                    case "price_desc":
                        query = query.OrderByDescending(p => p.Price);
                        break;
                    default:
                        query = query.OrderBy(p => p.Name);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(p => p.Price);
            }

            var products = await query.Skip((request.PageNumber - 1) * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync(cancellationToken);

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Slug = p.Slug,
                CategoryId = p.CategoryId
            }).ToList();

            // Save Redis
            await _cacheService.SetAsync(cacheKey, productDtos, TimeSpan.FromMinutes(10));

            return productDtos;
        }
    }
}

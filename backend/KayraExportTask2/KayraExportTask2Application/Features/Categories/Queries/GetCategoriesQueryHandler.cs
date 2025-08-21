using KayraExportTask2Application.DTOs.CategoryDTOs;
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

namespace KayraExportTask2Application.Features.Categories.Queries
{
    public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
    {
        private readonly IReadRepositories<Category> _readRepository;
        private readonly ICacheService _cacheService;
        public GetCategoriesQueryHandler(IReadRepositories<Category> readRepositories, ICacheService cacheService)
        {
            _cacheService = cacheService;
            _readRepository = readRepositories;
        }
        public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = "allcategories";

            var cachedProducts = await _cacheService.GetAsync<List<CategoryDto>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var categories = await _readRepository.GetAll().ToListAsync(cancellationToken);

            var categoryDtos = categories.Select(p => new CategoryDto
            {
                Id = p.Id,
                Name = p.Name,                
                Description = p.Description,
                Slug = p.Slug,
            }).ToList();

            //Save to redis (caching 15 minutes)
            await _cacheService.SetAsync(cacheKey, categoryDtos, TimeSpan.FromMinutes(15));

            return categoryDtos;
        }
    }
}

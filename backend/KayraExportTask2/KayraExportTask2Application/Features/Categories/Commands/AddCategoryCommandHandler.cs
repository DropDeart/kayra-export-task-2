using KayraExportTask2Application.DTOs.CategoryDTOs;
using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Categories.Commands
{
    public class AddCategoryCommandHandler : IRequestHandler<AddCategoryCommand, bool>
    {
        private readonly IWriteRepositories<Category> _writeRepositories;
        private readonly ICacheService _cacheService;
        public AddCategoryCommandHandler(IWriteRepositories<Category> writeRepositories, ICacheService cacheService)
        {
            _writeRepositories = writeRepositories;
            _cacheService = cacheService;
        }

        public async Task<bool> Handle(AddCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                Slug = request.Slug
            };

            await _cacheService.RemoveAsync("");

            await _writeRepositories.AddAsync(category);
            await _writeRepositories.SaveAsync();

            return true;
        }
    }
}

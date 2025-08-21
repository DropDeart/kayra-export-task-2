using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Configurations;
using KayraExportTask2Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Categories.Commands
{
    public class DeleteCategoryCommandHandle : IRequestHandler<DeleteCategoryCommand, bool>
    {
        private readonly IWriteRepositories<Category> _writeRepositories;
        private readonly ICacheService _cacheService;
        private readonly IReadRepositories<Category> _readRepositories;

        public DeleteCategoryCommandHandle(IWriteRepositories<Category> writeRepositories, ICacheService cacheService, IReadRepositories<Category> readRepositories)
        {
            _cacheService = cacheService;
            _writeRepositories = writeRepositories;
            _readRepositories = readRepositories;
        }

        public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _readRepositories.GetByIdAsync(request.Id.ToString());

            if (category == null)
            {
                throw new NotFoundException($"Kategori bulunamadı. Id : {request.Id}");
            }

            await _cacheService.RemoveAsync($"category:{request.Id}");
            await _cacheService.RemoveAsync("allcategories");
            _writeRepositories.Remove(category);
            await _writeRepositories.SaveAsync();

            return true;
        }
    }
}

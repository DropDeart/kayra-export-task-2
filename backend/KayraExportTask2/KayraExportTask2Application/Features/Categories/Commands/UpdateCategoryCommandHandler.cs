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
    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, bool>
    {
        private readonly IWriteRepositories<Category> _writeRepository;
        private readonly IReadRepositories<Category> _readRepository;
        private readonly ICacheService _cacheService;

        public UpdateCategoryCommandHandler(IWriteRepositories<Category> writeRepositories, IReadRepositories<Category> readRepositories, ICacheService cacheService)
        {
            _cacheService = cacheService;
            _writeRepository = writeRepositories;
            _readRepository = readRepositories;
        }

        public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _readRepository.GetByIdAsync(request.Id.ToString());

            if (category == null)
            {
                throw new NotFoundException($"Kategori bulunamadı. Id : {request.Id}");
            }

            category.Name = request.Name;
            category.Description = request.Description;
            category.Slug = request.Slug;

            await _cacheService.RemoveAsync($"category:{request.Id}");
            await _cacheService.RemoveAsync("allcategories");
            _writeRepository.Update(category);
            await _writeRepository.SaveAsync();
            return true;
        }
    }
}

using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Entities;
using MediatR;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class DeleteProductImageCommandHandler : IRequestHandler<DeleteProductImageCommand, bool>
    {
        private readonly IWriteRepositories<ProductImage> _writeRepositories;
        private readonly IReadRepositories<ProductImage> _readRepositories;
        private readonly ICacheService _cacheService;
        private readonly IHostEnvironment _env;

        public DeleteProductImageCommandHandler(
            IWriteRepositories<ProductImage> writeRepositories,
            IReadRepositories<ProductImage> readRepositories,
            ICacheService cacheService,
            IHostEnvironment env)
        {
            _writeRepositories = writeRepositories;
            _readRepositories = readRepositories;
            _cacheService = cacheService;
            _env = env;
        }

        public async Task<bool> Handle(DeleteProductImageCommand request, CancellationToken cancellationToken)
        {
            var image = await _readRepositories.GetByIdAsync(request.ImageId.ToString());
            if (image == null)
            {
                return false;
            }

            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", image.FilePath.TrimStart('/'));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            await _writeRepositories.RemoveAsync(image.Id.ToString());
            await _writeRepositories.SaveAsync();

            
            await _cacheService.RemoveAsync($"product:{image.ProductId}");
            
            await _cacheService.RemoveAsync("allproducts");
            await _cacheService.RemoveAsync($"products:filtered:*");

            return true;
        }
    }
}

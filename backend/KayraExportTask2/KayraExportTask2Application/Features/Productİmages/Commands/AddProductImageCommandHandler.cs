using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Configurations;
using KayraExportTask2Domain.Entities;
using MediatR;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class AddProductImageCommandHandler : IRequestHandler<AddProductImageCommand, bool>
    {
        private readonly IWriteRepositories<ProductImage> _writeRepositories;
        private readonly IReadRepositories<Product> _readRepositories;
        private readonly IHostEnvironment _env;
        private readonly ICacheService _cacheService;

        public AddProductImageCommandHandler(
       IWriteRepositories<ProductImage> writeRepositories,
       IReadRepositories<Product> readRepositories,
       IHostEnvironment env,
       ICacheService cacheService)
        {
            _writeRepositories = writeRepositories;
            _readRepositories = readRepositories;
            _env = env;
            _cacheService = cacheService;
        }
        public async Task<bool> Handle(AddProductImageCommand request, CancellationToken cancellationToken)
        {
            var product = await _readRepositories.GetByIdAsync(request.ProductId.ToString());
            if (product == null)
            {
                return false;
            }

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.File.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(fileStream);
            }

            var productImage = new ProductImage
            {
                FileName = request.File.FileName,
                FileExtension = Path.GetExtension(request.File.FileName),
                FileSizeInBytes = request.File.Length,
                FilePath = "/images/" + uniqueFileName,
                ProductId = request.ProductId,
                IsMain = false,
            };

            await _writeRepositories.AddAsync(productImage);
            await _writeRepositories.SaveAsync();
            
            await _cacheService.RemoveAsync("allproducts");

            return true;
        }

    }
}

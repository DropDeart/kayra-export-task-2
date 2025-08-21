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

namespace KayraExportTask2Application.Features.Products.Commands
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
    {
        private readonly IWriteRepositories<Product> _writeRepositories;
        private readonly IReadRepositories<Product> _readRepositories;  
        private readonly ICacheService _cacheService;

        public UpdateProductCommandHandler(IWriteRepositories<Product> writeRepositories, IReadRepositories<Product> readRepositories, ICacheService cacheService)
        {
            _writeRepositories = writeRepositories;   
            _readRepositories = readRepositories;
            _cacheService = cacheService;
        }
        public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var productToUpdate = await _readRepositories.GetByIdAsync(request.Id.ToString());

            if (productToUpdate == null)
            {
                throw new NotFoundException($"Ürün bulunamadı. Id : {request.Id}");
            }

            productToUpdate.Name = request.Name;
            productToUpdate.Description = request.Description;
            productToUpdate.Price = request.Price;
            productToUpdate.Stock = request.Stock;
            productToUpdate.Slug = request.Slug;
            productToUpdate.CategoryId = request.CategoryId;
            productToUpdate.UpdatedTime = DateTime.UtcNow;

            _writeRepositories.Update(productToUpdate);
            await _cacheService.RemoveAsync($"product:{request.Id}");
            await _cacheService.RemoveAsync("allproducts");

            return true;
        }
    }
}

using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Features.Products.Commands
{
    public class AddProductCommandHandler : IRequestHandler<AddProductCommand, bool>
    {
        private readonly IWriteRepositories<Product> _productWriteRepository;
        private readonly ICacheService _cacheService;

        public AddProductCommandHandler(IWriteRepositories<Product> productWriteRepository, ICacheService cacheService)
        {
            _productWriteRepository = productWriteRepository;
            _cacheService = cacheService;
        }

        public async Task<bool> Handle(AddProductCommand request, CancellationToken cancellationToken)
        {
            var newProduct = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Stock = request.Stock,
                Slug = request.Slug,
                CategoryId = request.CategoryId,
                CreatedTime = DateTime.UtcNow
            };

            await _cacheService.RemoveAllAsync("products:filtered");

            await _productWriteRepository.AddAsync(newProduct);
            await _productWriteRepository.SaveAsync();

            return true;
        }
    }
}

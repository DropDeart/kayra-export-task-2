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
    public class DeleteProductCommandHandler :IRequestHandler<DeleteProductCommand, bool>
    {
        private readonly IWriteRepositories<Product> _writeRepositories;
        private readonly IReadRepositories<Product> _readRepositories;
        private readonly ICacheService _cacheService;

        public DeleteProductCommandHandler(IWriteRepositories<Product> writeRepositories, IReadRepositories<Product> readRepositories, ICacheService cacheService)
        {
            _writeRepositories = writeRepositories;
            _readRepositories = readRepositories;
            _cacheService = cacheService;
        }

        public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _readRepositories.GetByIdAsync(request.Id.ToString());

            if (product == null)
            {
                throw new NotFoundException($"Ürün bulunamadı. Id : {request.Id}");
            }

            _writeRepositories.Remove(product);
            await _cacheService.RemoveAsync($"product:{request.Id}");
            await _cacheService.RemoveAsync("allproducts");

            return true;
        }
    }
}

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

namespace KayraExportTask2Application.Features.Productİmages.Commands
{
    public class UpdateProductImageCommandHandler : IRequestHandler<UpdateProductImageCommand, bool>
    {
        private readonly IWriteRepositories<ProductImage> _writeRepositories;
        private readonly IReadRepositories<ProductImage> _readRepositories;
        private readonly ICacheService _cacheService;

        public UpdateProductImageCommandHandler(
            IWriteRepositories<ProductImage> writeRepositories,
            IReadRepositories<ProductImage> readRepositories,
            ICacheService cacheService)
        {
            _writeRepositories = writeRepositories;
            _readRepositories = readRepositories;
            _cacheService = cacheService;
        }

        public async Task<bool> Handle(UpdateProductImageCommand request, CancellationToken cancellationToken)
        {
            var image = await _readRepositories.GetByIdAsync(request.ImageId.ToString());
            if (image == null)
            {
                return false;
            }
                      
            if (request.IsMain)
            {
                var currentMainImage = await _readRepositories.GetAll()
                    .FirstOrDefaultAsync(pi => pi.ProductId == request.ProductId && pi.IsMain, cancellationToken);
                if (currentMainImage != null)
                {
                    currentMainImage.IsMain = false;
                    _writeRepositories.Update(currentMainImage);
                }
            }

            image.IsMain = request.IsMain;
            _writeRepositories.Update(image);
            await _writeRepositories.SaveAsync();


            await _cacheService.RemoveAsync($"product:{request.ProductId}");
            await _cacheService.RemoveAsync("allproducts");
            await _cacheService.RemoveAsync($"products:filtered:*");

            return true;
        }
    }
}

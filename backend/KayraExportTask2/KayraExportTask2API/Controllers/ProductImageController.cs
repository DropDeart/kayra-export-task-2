using KayraExportTask2Application.DTOs.ProductImageDTOs;
using KayraExportTask2Application.Features.Productİmages.Commands;
using KayraExportTask2Application.Features.Productİmages.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KayraExportTask2API.Controllers
{
    [ApiController]
    public class ProductImageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductImageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("api/GetProductImages/{productId}")]
        public async Task<ActionResult<List<ProductImageDto>>> GetProductImages(Guid productId)
        {
            var images = await _mediator.Send(new GetProductImagesQuery { Id = productId });

            var requestUrl = $"{Request.Scheme}://{Request.Host}";

            foreach (var image in images)
            {
                image.FilePath = requestUrl + image.FilePath;
            }

            return Ok(images);
        }

        [HttpPost("api/products/{productId}/images")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProductImage([FromRoute] Guid productId, [FromForm] ProductImageUploadRequest request)
        {
            var command = new AddProductImageCommand
            {
                ProductId = productId,
                Files = request.Files
            };

            var result = await _mediator.Send(command);
            if (!result)
            {
                return BadRequest("Ürün bulunamadı veya görsel yüklenemedi.");
            }
            return Ok(result);
        }

        [HttpDelete("api/products/{productId}/images/{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProductImage([FromRoute] Guid productId, [FromRoute] Guid imageId)
        {
            var command = new DeleteProductImageCommand { ImageId = imageId };
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound("Görsel bulunamadı.");
            }
            return NoContent();
        }

        [HttpPut("api/products/{productId}/images/{imageId}/set-main")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetMainImage([FromRoute] Guid productId, [FromRoute] Guid imageId)
        {
            var command = new UpdateProductImageCommand
            {
                ProductId = productId,
                ImageId = imageId,
                IsMain = true
            };
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound("Ürün veya görsel bulunamadı.");
            }
            return Ok(result);
        }
    }
}

using KayraExportTask2Application.Features.Productİmages.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KayraExportTask2API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductImageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProductImage([FromRoute] Guid productId, [FromForm] IFormFile file)
        {
            var command = new AddProductImageCommand
            {
                ProductId = productId,
                File = file
            };

            var result = await _mediator.Send(command);
            if (!result)
            {
                return BadRequest("Ürün bulunamadı veya görsel yüklenemedi.");
            }
            return Ok(result);
        }

        [HttpDelete("{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProductImage([FromRoute] Guid imageId)
        {
            var command = new DeleteProductImageCommand { ImageId = imageId };
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound("Görsel bulunamadı.");
            }
            return NoContent();
        }

        [HttpPut("{imageId}/set-main")]
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

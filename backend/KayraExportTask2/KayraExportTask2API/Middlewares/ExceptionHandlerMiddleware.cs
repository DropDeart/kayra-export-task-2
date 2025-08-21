using KayraExportTask2Application.DTOs.MiddlewareDTOs;
using KayraExportTask2Domain.Configurations;
using KayraExportTask2Domain.Enums;
using System.Net;
using System.Text.Json;

namespace KayraExportTask2API.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;
        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (CustomException ex)
            {
                _logger.LogError(ex, "An error occurred.");
                var errorResponse = new ErrorResponseDto(
                    ex.Message,
                    ex.Message,
                    ex.ErrorCodes
                );
                httpContext.Response.StatusCode = (int)ex.ErrorCodes;
                httpContext.Response.ContentType = "application/json";
                var jsonResponse = JsonSerializer.Serialize(errorResponse);
                await httpContext.Response.WriteAsync(jsonResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred.");
                var errorResponse = new ErrorResponseDto(
                    "Internal Server Error",
                    "An unexpected error occurred. Please try again later.",
                    ErrorCodesEnum.InternalServerError
                );
                httpContext.Response.StatusCode = 500;
                httpContext.Response.ContentType = "application/json";
                var jsonResponse = JsonSerializer.Serialize(errorResponse);
                await httpContext.Response.WriteAsync(jsonResponse);
            }
        }
    }

}

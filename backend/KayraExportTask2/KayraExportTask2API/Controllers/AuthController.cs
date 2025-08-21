using KayraExportTask2Application.DTOs.AuthDTOs;
using KayraExportTask2Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KayraExportTask2API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthService authService, ITokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRegisterDto registerDto)
        {
            var newUser = await _authService.Register(registerDto);
            return Ok(new { Message = "Kullanıcı başarıyla kaydedildi.", UserId = newUser.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {            
            var user = await _authService.Login(loginDto);
            var response = _tokenService.GenerateToken(user);

            return Ok(response);
        }
    }
}

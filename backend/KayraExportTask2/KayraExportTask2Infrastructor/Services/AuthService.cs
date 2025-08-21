using KayraExportTask2Application.DTOs.AuthDTOs;
using KayraExportTask2Application.Interfaces;
using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Configurations;
using KayraExportTask2Domain.Entities;
using KayraExportTask2Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Infrastructor.Services
{
    public class AuthService : IAuthService
    {
        private readonly IReadRepositories<User> _readRepository;
        private readonly IWriteRepositories<User> _writeRepository;

        public AuthService(IReadRepositories<User> readRepositories, IWriteRepositories<User> writeRepositories)
        {
            _readRepository = readRepositories;
            _writeRepository = writeRepositories;
        }

        public async Task<User> Register(LoginRegisterDto registerDto)
        {
            var existingUser = await _readRepository.GetSingleAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                throw new CustomException("Bu email adresi zaten kullanılıyor.", ErrorCodesEnum.EmailAlreadyExist);
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = hashedPassword,
                Role = UserRole.User,
                IsEmainConfirmed = true
            };

            await _writeRepository.AddAsync(newUser);
            await _writeRepository.SaveAsync();

            return newUser;
        }

        public async Task<User> Login(LoginDto loginDto)
        {
            var user = await _readRepository.GetSingleAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return null; 
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null; 
            }

            return user;
        }        
    }
}

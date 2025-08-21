using KayraExportTask2Application.DTOs.AuthDTOs;
using KayraExportTask2Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Interfaces
{
    public interface IAuthService
    {
        Task<User>Register(LoginRegisterDto loginRegisterDto);
        Task<User> Login(LoginDto loginDto);
    }
}

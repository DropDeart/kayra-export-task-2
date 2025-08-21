using KayraExportTask2Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Domain.Configurations
{
    public class NotFoundException : CustomException
    {
        public NotFoundException(string message)
                : base(message, ErrorCodesEnum.NotFound)
        {
        }
    }
}

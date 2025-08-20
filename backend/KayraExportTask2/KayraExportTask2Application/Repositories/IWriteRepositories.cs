using KayraExportTask2Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Application.Repositories
{
    public interface IWriteRepositories<T> : IRepositories<T> where T : BaseEntity
    {
        Task<bool> AddAsync(T model);
        Task<bool> AddRangeAsync(List<T> model);
        bool Remove(T model);
        Task<bool> RemoveAsync(string id);
        bool RemoveRange(List<T> model);
        bool Update(T model);
        Task<int> SaveAsync();
    }
}

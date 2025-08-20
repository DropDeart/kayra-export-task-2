using KayraExportTask2Application.Repositories;
using KayraExportTask2Domain.Entities.Common;
using KayraExportTask2Persistance.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace KayraExportTask2Persistance.Repositories
{
    public class ReadRepository<T> : IReadRepositories<T> where T : BaseEntity
    {
        private readonly AppDbContext _context;
        public ReadRepository(AppDbContext context)
        {
            _context = context;
        }
        public DbSet<T> Table => _context.Set<T>();

        public IQueryable<T> GetAll()
        => Table; 

        public IQueryable<T> GetWhere(Expression<Func<T, bool>> method)
        => Table.Where(method);

        public async Task<T> GetSingleAsync(Expression<Func<T, bool>> method)
        => await Table.FirstOrDefaultAsync(method);

        public async Task<T> GetByIdAsync(string id)
            => await Table.FirstOrDefaultAsync(p => p.Id == Guid.Parse(id));

    }
}

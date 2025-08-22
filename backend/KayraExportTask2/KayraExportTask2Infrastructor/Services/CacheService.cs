using KayraExportTask2Application.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using IDatabase = StackExchange.Redis.IDatabase;

namespace KayraExportTask2Infrastructor.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDatabase _cacheDb;
        private readonly IConnectionMultiplexer _redis;

        public CacheService(IConnectionMultiplexer redis)
        {
            _redis = redis; 
            _cacheDb = redis.GetDatabase();
        }

        public async Task<T> GetAsync<T>(string key)
        {
            var value = await _cacheDb.StringGetAsync(key);
            if (string.IsNullOrEmpty(value))
            {
                return default;
            }
            return JsonSerializer.Deserialize<T>(value);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
        {
            var serializedValue = JsonSerializer.Serialize(value);
            await _cacheDb.StringSetAsync(key, serializedValue, expiry ?? TimeSpan.FromMinutes(30));
        }

        public async Task RemoveAsync(string key)
        {
            await _cacheDb.KeyDeleteAsync(key);
        }

        public async Task RemoveAllAsync(string pattern)
        {
            var keys = _redis.GetServer(_redis.GetEndPoints().First()).Keys(pattern: $"*{pattern}*").ToArray();
            await _redis.GetDatabase().KeyDeleteAsync(keys);
        }
    }
}

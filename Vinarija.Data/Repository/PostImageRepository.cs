using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vinarija.Data.Infrastructure;
using Vinarija.Entities;

namespace Vinarija.Data.Repository
{
    public class PostImageRepository : GenericRepository<PostImage>
    {
        public PostImageRepository(DbContext dbContext) : base(dbContext) { }
    }
}

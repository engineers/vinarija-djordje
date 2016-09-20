using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vinarija.Common.Models.PostPageModel;
using Vinarija.Data.Infrastructure;
using Vinarija.Entities;

namespace Vinarija.Data.Repository
{
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(DbContext dbContext) : base(dbContext) { }
    }
}

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
    public class GalleryRepository : GenericRepository<Gallery>
    {
        public GalleryRepository(DbContext dbContext) : base(dbContext) { }

        public override void Insert(Gallery entity)
        {
            int? sortOrder = dbSet.Any() ? dbSet.Max(g => g.SortOrder) + 1 : 1;
            entity.SortOrder = sortOrder;

            base.Insert(entity);
        }
    }
}

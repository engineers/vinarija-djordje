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
    public class PostRepository : GenericRepository<Post>
    {
        public PostRepository(DbContext dbContext) : base(dbContext) { }

        public PostPageModel GetAll(int? pageSize, int? pageNumber, string orderBy, string searchTerm, bool all)
        {
            PostPageModel model = new PostPageModel();

            var query = (IQueryable<Post>)dbSet.Include("PostImages");

            if (!all)
            {
                query = query.Where(p => p.Active);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.Title.ToLower().Contains(searchTerm.ToLower())
                                || p.Content.ToLower().Contains(searchTerm.ToLower()));
            }

            switch (orderBy)
            {
                case "title": query = query.OrderBy(p => p.Title); break;
                case "-title": query = query.OrderByDescending(p => p.Title); break;
                case "date": query = query.OrderBy(p => p.Date); break;
                case "-date": query = query.OrderByDescending(p => p.Date); break;
                default: query = query.OrderBy(pg => pg.Id); break;
            }

            model.TotalCount = query.Count();
            if (pageNumber.HasValue && pageSize.HasValue)
            {
                query = query.Skip((pageNumber.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            model.Posts = query.ToList();

            return model;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Vinarija.Entities;

namespace Vinarija.Common.Models.PostPageModel
{
    public class PostPageModel
    {
        public List<Post> Posts { get; set; }
        public int TotalCount { get; set; }
    }
}
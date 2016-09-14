using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Vinarija.Api.Helpers;
using Vinarija.Api.Models;
using Vinarija.Common.Exceptions;
using Vinarija.Common.Models.PostModel;
using Vinarija.Common.Models.PostPageModel;
using Vinarija.Entities;

namespace Vinarija.Api.Controllers
{
    public class PostController : BaseController
    {
        [AllowAnonymous]
        [HttpGet]
        public PostPageModel GetAll(int? pageSize = null, int? pageNumber = null, string orderBy = null, string searchTerm = null)
        {
            PostPageModel postPageModel = PostManager.GetAll(pageSize, pageNumber, orderBy, searchTerm);

            return postPageModel;
        }

        [TokenAuthorize]
        [HttpPost]
        public Post Add(PostModel input)
        {
            Post post = new Post
            {
                Active = false,
                Content = input.Content,
                Date = input.Date,
                DateCreated = DateTime.UtcNow,
                Title = input.Title
            };

            post = PostManager.Add(post);

            return post;
        }

        [TokenAuthorize]
        [HttpPut]
        public Post Update(PostModel input)
        {
            Post post = new Post
            {
                Id = input.Id.Value,
                Content = input.Content,
                Date = input.Date,
                Title = input.Title
            };

            post = PostManager.Update(post);

            return post;
        }

        [TokenAuthorize]
        [HttpDelete]
        public void Delete(int postId)
        {
            PostManager.Delete(postId);
        }
    }
}

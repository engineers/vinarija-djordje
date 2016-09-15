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

        
        [ValidateModel]
        [TokenAuthorize]
        [HttpPost]
        public Post Add(PostModel input)
        {
            Post post = new Post
            {
                Active = false,
                Content = input.Content,
                Date = input.Date.Value,
                DateCreated = DateTime.UtcNow,
                Title = input.Title
            };

            post = PostManager.Add(post);

            return post;
        }

        [ValidateModel]
        [TokenAuthorize]
        [HttpPut]
        public Post Update(PostModel input)
        {
            Post post = new Post
            {
                Id = input.Id.Value,
                Content = input.Content,
                Date = input.Date.Value,
                Title = input.Title
            };

            post = PostManager.Update(post);

            return post;
        }

        [ValidateModel]
        [TokenAuthorize]
        [HttpPut]
        public Post ActiveDeactive(PostActiveDeactiveModel model)
        {
            Post post = PostManager.ActiveDeactive(model.PostId.Value, model.Active.Value);

            return post;
        }

        [TokenAuthorize]
        [HttpDelete]
        public void Delete(int postId)
        {
            PostManager.Delete(postId);
        }

        [TokenAuthorize]
        [HttpPost]
        public void UploadImage()
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count == 0) throw new ValidationException("Odaberite fajl!");
            if (string.IsNullOrEmpty(httpRequest.Form.Get("id"))) throw new ValidationException("Id posta je obavezan parametar!");

            int postId = int.Parse(httpRequest.Form.Get("id"));

            HttpPostedFile postedFile = httpRequest.Files[0];
            string rootFolder = HttpContext.Current.Server.MapPath($"~/Content/Posts/" + postId);
            string extension = Path.GetExtension(postedFile.FileName);

            PostManager.AddImage(rootFolder, postedFile.InputStream, postedFile.FileName, postId);
        }

        [ValidateModel]
        [TokenAuthorize]
        [HttpPut]
        public void RemoveImage(PostImageModel model)
        {
            string rootFolder = HttpContext.Current.Server.MapPath($"~/Content/Posts/" + model.PostId.Value);
            PostManager.RemoveImage(model.PostId.Value, model.PostImageId.Value, rootFolder);
        }
    }
}

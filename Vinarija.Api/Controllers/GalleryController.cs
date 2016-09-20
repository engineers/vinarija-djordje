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
using Vinarija.Entities;

namespace Vinarija.Api.Controllers
{
    public class GalleryController : BaseController
    {
        [AllowAnonymous]
        public List<Gallery> GetAll()
        {
            List<Gallery> gallery = GalleryManager.GetAll();

            return gallery;
        }

        [TokenAuthorize]
        [HttpPost]
        public void UploadImage()
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count == 0) throw new ValidationException("Nijedan fajl nije odabran za upload!");

            HttpPostedFile postedFile = httpRequest.Files[0];
            string rootFolder = HttpContext.Current.Server.MapPath($"~/Content/Gallery/");
            string extension = Path.GetExtension(postedFile.FileName);

            GalleryManager.AddImage(rootFolder, postedFile.InputStream, (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds + "_" + postedFile.FileName);
        }

        [TokenAuthorize]
        [HttpPut]
        public void Reorder(GalleryReorderModel input)
        {
            GalleryManager.Reorder(input.GalleryIds);
        }

        [TokenAuthorize]
        [HttpDelete]
        public void RemoveImage(int imageId)
        {
            string filePath = HttpContext.Current.Server.MapPath($"~/Content/Gallery/");

            GalleryManager.removeImage(filePath, imageId);
        }
    }
}

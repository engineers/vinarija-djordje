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

namespace Vinarija.Api.Controllers
{
    [TokenAuthorize]
    public class GalleryController : BaseController
    {
        /// <summary>
        /// Upload the image.
        /// </summary>
        /// <param name="folderPath">The folder path. (format '/folder1/folder2')</param>
        /// <exception cref="ValidationException">You did not select a file!</exception>
        /// <exception cref="Phin.Common.Exceptions.ValidationException">You did not select a file!</exception>
        [HttpPost]
        public void UploadImage(string folderPath)
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count == 0) throw new ValidationException("You did not select a file!");

            HttpPostedFile postedFile = httpRequest.Files[0];
            string rootFolder = HttpContext.Current.Server.MapPath($"~/Content/Gallery{folderPath}/");
            string extension = Path.GetExtension(postedFile.FileName);

            //GalleryManager.AddImage(postedFile.InputStream, rootFolder, postedFile.FileName);
        }
    }
}

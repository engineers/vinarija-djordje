﻿using System;
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
        public List<Gallery> GetAll()
        {
            List<Gallery> gallery = GalleryManager.GetAll();

            return gallery;
        }

        [HttpPost]
        public void UploadImage(string folderPath)
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count == 0) throw new ValidationException("You did not select a file!");

            HttpPostedFile postedFile = httpRequest.Files[0];
            string rootFolder = HttpContext.Current.Server.MapPath($"~/Content/Gallery/");
            string extension = Path.GetExtension(postedFile.FileName);

            //GalleryManager.AddImage(postedFile.InputStream, rootFolder, postedFile.FileName);
        }
    }
}
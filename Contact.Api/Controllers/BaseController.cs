using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vinarija.Api.Models;
using Vinarija.Core;

namespace Vinarija.Api.Controllers
{
    public class BaseController : ApiController
    {
        public UserJwtModel CurrentUser { get; set; }

        private UserManager userManager;
        public UserManager UserManager
        {
            get
            {
                return userManager ?? (userManager = new UserManager());
            }
        }

        private PostManager blogManager;
        public PostManager BlogManager
        {
            get
            {
                return blogManager ?? (blogManager = new PostManager());
            }
        }

        private GalleryManager galleryManager;
        public GalleryManager GalleryManager
        {
            get
            {
                return galleryManager ?? (galleryManager = new GalleryManager());
            }
        }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vinarija.Api.Mailers;
using System.Configuration;
using Vinarija.Api.Models;

namespace Vinarija.Api.Controllers
{
    public class MailController : ApiController
    {
        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage Contact(MailModel model)
        {
            if (!ModelState.IsValid) return Request.CreateResponse(HttpStatusCode.BadRequest);

            if (Request.Headers.Authorization.ToString() != ConfigurationManager.AppSettings["AuthorizationHeader"])
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized);
            }

            var mailer = new UserMailer();
            mailer.Contact(model).Send();

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}

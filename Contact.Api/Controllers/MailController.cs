using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Contact.Api.Models;
using Contact.Api.Mailers;
using System.Configuration;

namespace Contact.Api.Controllers
{
    public class MailController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage Contact(MailModel model)
        {
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

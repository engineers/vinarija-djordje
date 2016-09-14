using Contact.Api.Models;
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
    public class UserController : BaseController
    {
        [ValidateModel]
        [HttpPost]
        public object Login(UserLoginModel model)
        {
            //User user = UserManager.Login(model.Username, model.Password, model.WebLogin);
            //dynamic rights = RoleManager.GetRightsObject(user.Role);
            return new { };
            //return new { User = user, Rights = rights, Token = CreateLoginToken(user) };
        }

    }
}

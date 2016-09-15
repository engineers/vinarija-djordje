using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using Vinarija.Api.Helpers;
using Vinarija.Api.Models;
using Vinarija.Common.Exceptions;
using Vinarija.Common.Models.User;
using Vinarija.Entities;

namespace Vinarija.Api.Controllers
{
    public class UserController : BaseController
    {
        [ValidateModel]
        [HttpPost]
        public object Login(UserLoginModel model)
        {
            UserModel user = UserManager.Login(model.Email, model.Password);
            return new { User = user, Token = CreateLoginToken(user) };
        }

        [NonAction]
        private string CreateLoginToken(UserModel user)
        {
            UserJwtModel userModel = new UserJwtModel();
            userModel.ExpirationDate = DateTime.UtcNow.AddDays(1);
            userModel.Email = user.Email;
            userModel.Id = user.Id;

            string secretKey = WebConfigurationManager.AppSettings["JwtSecret"];
            string token = JWT.JsonWebToken.Encode(userModel, secretKey, JWT.JwtHashAlgorithm.HS256);

            return token;
        }
    }
}

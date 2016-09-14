using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Vinarija.Api.Controllers;
using Vinarija.Api.Models;
using Vinarija.Common.Exceptions;

namespace Vinarija.Api.Helpers
{
    public class TokenAuthorizeAttribute : ActionFilterAttribute
    {
        public string Roles { get; set; }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            // Skip validation if AllowAnonymous attribute is set
            if (!SkipValidation(actionContext))
            {
                // Check for authorization header
                var authorizationHeader = actionContext.Request.Headers.FirstOrDefault(h => h.Key == "Authorization");
                if (authorizationHeader.Key == null)
                {
                    throw new AuthenticationException("No Authorization header present");
                }

                // Get token from Authorization header
                string tokenString = authorizationHeader.Value.FirstOrDefault();
                if (string.IsNullOrWhiteSpace(tokenString))
                {
                    throw new AuthenticationException("Authorization header cannot be empty");
                }

                // Validate JWT token
                var secretKey = WebConfigurationManager.AppSettings["JwtSecret"];
                UserJwtModel user;

                try
                {
                    user = JWT.JsonWebToken.DecodeToObject<UserJwtModel>(tokenString, secretKey);
                }
                catch (JWT.SignatureVerificationException)
                {
                    throw new AuthenticationException("Invalid token!");
                }

                if (user.ExpirationDate < DateTime.UtcNow)
                {
                    throw new AuthenticationException("Token expired! Please, login again");
                }

                // Add current user to base controller
                var controller = actionContext.ControllerContext.Controller as BaseController;
                //controller.CurrentUser = user;
            }

            base.OnActionExecuting(actionContext);
        }

        private bool SkipValidation(HttpActionContext actionContext)
        {
            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Vinarija.Api.Helpers
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!actionContext.ModelState.IsValid)
            {
                var errorMessages = string.Join("; ", actionContext.ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)));

                throw new ApplicationException(errorMessages);
            }

            base.OnActionExecuting(actionContext);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;
using System.Net;
using System.Net.Http;
using Vinarija.Common.Exceptions;

namespace Vinarija.Api.Helpers
{
    public class GlobalExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            Exception exception = context.Exception;

            HttpStatusCode statusCode;

            if (exception is ValidationException)
            {
                statusCode = HttpStatusCode.BadRequest;
            }
            else if (exception is RuntimeException)
            {
                statusCode = HttpStatusCode.InternalServerError;
            }
            else if (exception is AuthenticationException)
            {
                statusCode = HttpStatusCode.Unauthorized;
            }
            else
            {
                statusCode = HttpStatusCode.InternalServerError;
            }

            string errorMessage = exception.Message;

            if (exception.InnerException != null && exception.InnerException.Message.Length > 0)
            {
                errorMessage += "; Inner Exception: " + exception.InnerException.Message;
            }

            context.Result = new ResponseMessageResult(context.Request.CreateErrorResponse(statusCode, errorMessage));
        }
    }
}
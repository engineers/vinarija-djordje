using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mvc.Mailer;
using Contact.Api.Models;
using System.Configuration;

namespace Contact.Api.Mailers
{
    public class UserMailer : MailerBase, IUserMailer
    {
        public UserMailer()
        {
            MasterName = "_Layout";
        }

        public virtual MvcMailMessage Contact(MailModel model)
        {
            ViewBag.Message = model;
            return Populate(x =>
            {
                x.Subject = ConfigurationManager.AppSettings["Subject"];
                x.ViewName = "Contact";
                x.To.Add(ConfigurationManager.AppSettings["ToEmail"]);
            });
        }
    }
}
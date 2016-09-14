﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mvc.Mailer;
using Vinarija.Api.Models;

namespace Contact.Api.Mailers
{
    public interface IUserMailer
    {
        MvcMailMessage Contact(MailModel model);
    }
}
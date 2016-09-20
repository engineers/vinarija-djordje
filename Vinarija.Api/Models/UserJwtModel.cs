using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class UserJwtModel
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public DateTime ExpirationDate { get; set; }
    }
}
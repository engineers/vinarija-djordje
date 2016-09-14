using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class UserJwtM
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string Role { get; set; }
    }
}
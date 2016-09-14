using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinarija.Common.Models.User
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
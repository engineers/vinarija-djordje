using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinarija.Common.Models.PostModel
{
    public class PostModel
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public System.DateTime Date { get; set; }
        public System.DateTime DateCreated { get; set; }
    }
}
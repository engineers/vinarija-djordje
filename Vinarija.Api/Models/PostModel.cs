using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class PostModel
    {
        public int? Id { get; set; }
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Content is required.")]
        public string Content { get; set; }
        [Required(ErrorMessage = "Date is required.")]
        public System.DateTime? Date { get; set; }
        public System.DateTime DateCreated { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class PostActiveDeactiveModel
    {
        [Required(ErrorMessage = "PostId is required.")]
        public int? PostId { get; set; }
        [Required(ErrorMessage = "Active is required.")]
        public bool? Active { get; set; }
    }
}
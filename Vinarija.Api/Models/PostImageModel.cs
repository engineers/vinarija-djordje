using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class PostImageModel
    {
        [Required(ErrorMessage = "PostId is required.")]
        public int? PostId { get; set; }
        [Required(ErrorMessage = "PostImageId is required.")]
        public int? PostImageId { get; set; }
    }
}
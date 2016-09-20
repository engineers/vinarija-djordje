using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class GalleryImageModel
    {
        [Required(ErrorMessage = "ImageId is required.")]
        public int? ImageId { get; set; }
    }
}
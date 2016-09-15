using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Vinarija.Api.Models
{
    public class GalleryReorderModel
    {
        [Required(ErrorMessage = "Gallery Ids are required")]
        [MinLength(1, ErrorMessage = "GalleryIds must contain at least one element")]
        public int[] GalleryIds { get; set; }
    }
}
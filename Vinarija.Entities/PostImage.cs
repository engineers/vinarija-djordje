//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Vinarija.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class PostImage
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int PostId { get; set; }
        public System.DateTime DateCreated { get; set; }
    
        public virtual Post Post { get; set; }
    }
}

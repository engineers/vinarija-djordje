using Vinarija.Common.Exceptions;
using Vinarija.Common.Helpers;
using Vinarija.Data;
using Vinarija.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vinarija.Common.Models.User;
using Vinarija.Common.Models.PostPageModel;

namespace Vinarija.Core
{
    public class GalleryManager
    {
        public List<Gallery> GetAll()
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                List<Gallery> gallery = uow.GalleryRepository.GetAll().OrderByDescending(g => g.SortOrder).ToList();

                return gallery;
            }
        }
    }
}

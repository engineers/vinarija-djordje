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
using System.IO;

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

        public void AddImage(string rootFolder, Stream inputStream, string fileName)
        {
            if (!Directory.Exists(rootFolder))
            {
                Directory.CreateDirectory(rootFolder);
            }

            using (var imageFile = System.Drawing.Image.FromStream(inputStream))
            {
                imageFile.Save(rootFolder + "\\" + fileName);

                using (UnitOfWork uow = new UnitOfWork())
                {
                   
                    Gallery galleryImage = new Gallery
                    {
                        FilePath = fileName,
                    };
                    uow.GalleryRepository.Insert(galleryImage);

                    uow.Save();
                }
            }
        }

        public void removeImage(string filePath, int imageId)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                Gallery gallery = uow.GalleryRepository.GetById(imageId);
                if (gallery != null)
                {
                    uow.GalleryRepository.Delete(imageId);
                    if (File.Exists(filePath + "\\" + gallery.FilePath)) File.Delete(filePath + "\\" + gallery.FilePath);
                    uow.Save();
                }
            }
        }
    }
}

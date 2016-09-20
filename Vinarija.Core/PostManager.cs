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
using System.Drawing;


namespace Vinarija.Core
{
    public class PostManager
    {
        public PostPageModel GetAll(int? pageSize, int? pageNumber, string orderBy, string searchTerm)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                PostPageModel postPageModel = uow.PostRepository.GetAll(pageSize, pageNumber, orderBy, searchTerm);
                return postPageModel;
            }
        }

        public Post Add(Post post)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.PostRepository.Insert(post);
                uow.Save();

                return post;
            }
        }

        public Post Update(Post post)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                Post postFromDB = uow.PostRepository.GetById(post.Id);
                ValidationHelper.ValidateNotNull(postFromDB);

                postFromDB.Title = post.Title;
                postFromDB.Content = post.Content;
                postFromDB.Date = post.Date;

                uow.PostRepository.Update(postFromDB);

                uow.Save();

                return postFromDB;
            }
        }

        public void Delete(int postId)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                if (postId != 0)
                {
                    Post postFromDB = uow.PostRepository.GetById(postId);
                    ValidationHelper.ValidateNotNull(postFromDB);

                    List<PostImage> postImages = uow.PostImageRepository.Find(pi => pi.PostId == postId);
                    if (postImages != null)
                    {
                        foreach (PostImage postImage in postImages)
                        {
                            uow.PostImageRepository.Delete(postImage);
                        }
                    }

                    uow.PostRepository.Delete(postFromDB);

                    uow.Save();
                }
                else
                {
                    throw new ValidationException("Unable to delete post!");
                }
            }
        }

        public Post ActiveDeactive(int postId, bool active)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {

                Post postFromDB = uow.PostRepository.GetById(postId);
                ValidationHelper.ValidateNotNull(postFromDB);

                postFromDB.Active = active;
                uow.PostRepository.Update(postFromDB);

                uow.Save();

                return postFromDB;
            }
        }

        public void RemoveImage(int postId, int postImageId, string rootFolder)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                PostImage postImage = uow.PostImageRepository.Find(pi => pi.Id == postImageId && pi.PostId == postId).FirstOrDefault();
                if (postImage != null)
                {
                    uow.PostImageRepository.Delete(postImage);
                    uow.Save();
                    if (File.Exists(rootFolder + "\\" + postImage.FilePath)) File.Delete(rootFolder + "\\" + postImage.FilePath);
                }
            }
        }

        public void AddImage(string rootFolder, Stream inputStream, string fileName, int postId)
        {
            if (!Directory.Exists(rootFolder))
            {
                Directory.CreateDirectory(rootFolder);
            }

            if (File.Exists(rootFolder + "\\" + fileName))
            {
                throw new ValidationException("Slika sa istim imenom vec postoji!");
            }

            using (var imageFile = System.Drawing.Image.FromStream(inputStream))
            {
                imageFile.Save(rootFolder + "\\" + fileName);

                using (UnitOfWork uow = new UnitOfWork())
                {
                    PostImage postImage = uow.PostImageRepository.Find(pi => pi.PostId == postId).FirstOrDefault();
                    if (postImage != null)
                    {
                        postImage.FilePath = fileName;
                        postImage.DateCreated = DateTime.UtcNow;

                        uow.PostImageRepository.Update(postImage);
                    }
                    else
                    {
                        PostImage newPostImage = new PostImage
                        {
                            FilePath = fileName,
                            PostId = postId,
                            DateCreated = DateTime.UtcNow
                        };
                        uow.PostImageRepository.Insert(newPostImage);
                    }

                    uow.Save();
                }
            }
        }
    }
}

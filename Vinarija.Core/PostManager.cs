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
    }
}

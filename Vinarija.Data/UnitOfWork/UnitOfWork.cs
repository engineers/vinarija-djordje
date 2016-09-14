using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vinarija.Entities;
using Vinarija.Data.Repository;
using System.Data.Entity;
using Vinarija.Data.Model;

namespace Vinarija.Data
{
    public class UnitOfWork : IDisposable
    {
        #region Fields

        /// <summary>
        /// Data context
        /// </summary>
        private DbContext context;

        private PostRepository blogRepository;
        private PostImageRepository postImageRepository;
        private UserRepository userRepository;

        #endregion Fields

        #region Properties

        /// <summary>
        /// Data context
        /// </summary>
        public DbContext DataContext
        {
            get
            {
                return context ?? (context = new VinarijaEntities());
            }
        }

        #region Repository

        public PostRepository PostRepository
        {
            get
            {
                return blogRepository ?? (blogRepository = new PostRepository(DataContext));
            }
        }
        public PostImageRepository PostImageRepository
        {
            get
            {
                return postImageRepository ?? (postImageRepository = new PostImageRepository(DataContext));
            }

        }

        public UserRepository UserRepository
        {
            get
            {
                return userRepository ?? (userRepository = new UserRepository(DataContext));
            }
        }

        #endregion Repository

        #endregion Properties

        #region Methods

        /// <summary>
        /// Save changes for unit of work async
        /// </summary>
        public async Task SaveAsync()
        {
            context.ChangeTracker.DetectChanges();
            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Save changes for unit of work
        /// </summary>
        public void Save()
        {
            context.ChangeTracker.DetectChanges();
            context.SaveChanges();
        }

        #endregion Methods

        #region IDisposable Members

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (context != null)
                        context.Dispose();
                }
            }
            this.disposed = true;
        }

        /// <summary>
        /// Dispose objects
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion IDisposable Members
    }
}

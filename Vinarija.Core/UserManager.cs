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

namespace Vinarija.Core
{
    public class UserManager
    {
        /// <summary>
        /// Gets the user by specified email and password.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        /// <exception cref="ValidationException">Wrong password!
        /// or
        /// Account not confirmed! Please, check your e-mail for confirmation.</exception>
        public UserModel Login(string email, string password)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                User user = uow.UserRepository.Find(u => u.Email.ToLower().Trim() == email.ToLower().Trim()).FirstOrDefault();
                ValidationHelper.ValidateNotNull(user);

                if (!PasswordHelper.ValidatePassword(password, user.Password))
                {
                    throw new ValidationException("Wrong password!");
                }

                UserModel userModel = new UserModel {
                    Email = user.Email,
                    FullName = user.FullName,
                    Id = user.Id
                };

                return userModel;
            }
        }
    }
}

﻿using Microsoft.AspNetCore.Identity;

namespace kuaforberberApp.Server.Interface
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(string email, string password);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string userId);

        Task<bool> SaveUserAsync(User user); // Add this
        string HashPassword(string password);
    }

}
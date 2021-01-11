using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<
        AppUser, 
        AppRole, 
        int,
        IdentityUserClaim<int>,
        AppUserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>
        >
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<UserLike> Likes { get; set; } // Table name
        public DbSet<Message> Messages {get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserRole - ManytoMany Relationship
            modelBuilder.Entity<AppUser>().
                HasMany(userRole => userRole.UserRoles).
                WithOne(user => user.User).
                HasForeignKey(userRole => userRole.UserId).
                IsRequired();

            modelBuilder.Entity<AppRole>().
                HasMany(userRole => userRole.UserRoles).
                WithOne(role => role.Role).
                HasForeignKey(userRole => userRole.RoleId).
                IsRequired();

            // UserLike - ManyToMany Relationship
            modelBuilder.Entity<UserLike>().HasKey(k => new
            {
                k.SourceUserId,
                k.LikedUserId
            });

            modelBuilder.Entity<UserLike>().
                HasOne(user => user.SourceUser).
                WithMany(like => like.LikedUsers).
                HasForeignKey(key => key.SourceUserId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>().
                HasOne(user => user.LikedUser).
                WithMany(like => like.LikedByUsers).
                HasForeignKey(key => key.LikedUserId).
                OnDelete(DeleteBehavior.Cascade);

            // Messages - OneToMany Relationship
            modelBuilder.Entity<Message>().
                HasOne(user => user.Receiver).
                WithMany(message => message.ReceivedMessages).
                OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>().
                HasOne(user => user.Sender).
                WithMany(message => message.SentMessages).
                OnDelete(DeleteBehavior.Restrict);
        }
    }
}
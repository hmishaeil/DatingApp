using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; } // Table name

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}
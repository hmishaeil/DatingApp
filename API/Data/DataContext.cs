using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; } // Table name
        public DbSet<Message> Messages {get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
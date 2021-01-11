using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
     // Acting as join table for User & Role tables
    public class AppUserRole: IdentityUserRole<int>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}
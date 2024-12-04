using Microsoft.AspNetCore.Identity;

namespace kuaforberberApp.Server.Interface
{
    namespace CodePulse.API.Repositories.Interface
    {
        public interface ITokenRepository
        {
            string CreateJwtToken(User user, List<string> roles);
        }
    }
}

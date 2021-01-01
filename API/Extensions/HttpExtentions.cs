using System.Text.Json;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtentions
    {
        public static void AddPaginationHeader(
            this HttpResponse httpResponse,
            int currentPage, 
            int totalPages, 
            int itemsPerPage, 
            int totalItems){
                var paginationHeader = new PaginationHeader(currentPage, totalPages, itemsPerPage, totalItems);
                
                var options = new JsonSerializerOptions{
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                httpResponse.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options));
                httpResponse.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
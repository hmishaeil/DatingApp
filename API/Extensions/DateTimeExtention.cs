using System;

namespace API.Extensions
{
    public static class DateTimeExtention
    {
        public static int CalcAge(this DateTime DOB){
            var today = DateTime.Today;
            var age = today.Year - DOB.Year;
            // todo: needs to fix?  
            return age;
        }
    }
}
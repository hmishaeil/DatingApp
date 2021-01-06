using System;
using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDTO>().
            ForMember(
                dest => dest.PhotoUrl,
                opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url)
            ).ForMember(
                dest => dest.Age,
                opt => opt.MapFrom(
                    src => src.DateOfBirth.CalcAge()
                )
            );
            CreateMap<Photo, PhotoDTO>();
            CreateMap<MemberUpdateDTO, AppUser>();
            CreateMap<RegisterDTO, AppUser>();
            CreateMap<Message, MessageDTO>().
                ForMember(
                    dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(
                        src => src.Sender.Photos.FirstOrDefault(photo => photo.IsMain).Url
                    )).
                ForMember(
                    dest => dest.ReceiverPhotoUrl,
                    opt => opt.MapFrom(
                        src => src.Receiver.Photos.FirstOrDefault(photo => photo.IsMain).Url
                    )
                );
        }
    }
}
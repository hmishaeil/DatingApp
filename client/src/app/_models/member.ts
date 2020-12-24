import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    intro: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    createdAt: Date;
    lastActive: Date;
    gender: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
  }
  
 
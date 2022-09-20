export interface User {
  _id?:any;
  email: string;
  specialty: string;
  firstName: string;
  lastName: string;
  password: string;
  imagePath?: string;
  yearsOfExperience: string;
  bio?:string;
  posts?: [];
  facebookLink?: string,
  instagramLink?: string,
  twitterLink?: string,
  websiteLink?: string,
}

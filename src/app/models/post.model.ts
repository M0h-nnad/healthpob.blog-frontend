import { SafeHtml } from '@angular/platform-browser';

export interface Post {
  _id: any;
  authorId: string;
  title: string;
  content: any;
  date: Date;
  imagePath: string;
  published: boolean;
  category: string;
  views: number;
  numOfShares: number;
}

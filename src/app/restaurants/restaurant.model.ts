import { Hours, Rating } from '../shared/Interfaces';
import { Review } from './restaurant/reviews/review.model';

export class Restaurant {
  public name: string;
  public address: string;
  public phone: string;
  public hours: Hours;
  public price: number;
  public websiteURL: string;
  public googleURL: string;
  public rating: Rating;
  public reviews: Review[];
  public photos: any[];

  constructor(
    name: string,
    address: string,
    phone: string,
    hours: Hours,
    price: number,
    websiteURL: string,
    googleURL: string,
    rating: Rating,
    reviews: Review[],
    photos: any[]
  ) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.hours = hours;
    this.price = price;
    this.websiteURL = websiteURL;
    this.googleURL = googleURL;
    this.rating = rating;
    this.reviews = reviews;
    this.photos = photos;
  }
}

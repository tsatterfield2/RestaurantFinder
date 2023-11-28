import { Injectable } from '@angular/core';
import { Restaurant } from './restaurant.model';
import { Observable, Subject } from 'rxjs';
import { Hours, Rating } from '../shared/Interfaces';
import { Review } from './restaurant/reviews/review.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  restaurants: Restaurant[] = [];
  restaurauntsChanged = new Subject<Restaurant[]>();
  restaurauntsLoaded = new Subject<null>();
  restaurauntsCleared = new Subject<boolean>();

  GetRestaurantsSubject(): Observable<Restaurant[]> {
    return this.restaurauntsChanged.asObservable();
  }

  GetRestaurantsClearedSubject(): Observable<boolean> {
    return this.restaurauntsCleared.asObservable();
  }

  GetRestaurantsLoadedSubject(): Observable<null> {
    return this.restaurauntsLoaded.asObservable();
  }

  constructor() {}

  // Update the restaurants //
  AddRestaurants(response: any[]): void {
    const newRestaurants = response.map((res) => {
      const {
        name,
        formatted_address: address,
        international_phone_number: phone,
        current_opening_hours,
        price_level: priceLevel,
        website: websiteURL,
        url: googleURL,
        rating,
        user_ratings_total: total_votes,
        photos,
      } = res;

      // Create Reviews //
      const reviews: Review[] = [];
      if (res.reviews) {
        res.reviews.forEach((element: any) => {
          const {
            author_name: authorName,
            rating,
            relative_time_description: timeDesc,
            text: content,
          } = element;
          const review = new Review(authorName, rating, timeDesc, content);
          reviews.push(review);
        });
      }

      // Create Hours //
      const hours: Hours = {
        open_now: current_opening_hours?.open_now ?? null,
        operation_hours: current_opening_hours?.weekday_text ?? [],
      };

      // Create Rating //
      const ratingObject: Rating = { aggregate_rating: rating, total_votes };

      const restaurant = new Restaurant(
        name,
        address,
        phone,
        hours,
        priceLevel,
        websiteURL,
        googleURL,
        ratingObject,
        reviews,
        photos
      );
      return restaurant;
    });

    this.restaurants = [...this.restaurants, ...newRestaurants];
    this.restaurauntsChanged.next([...this.restaurants]);
    this.restaurauntsLoaded.next(null);
  }

  Clear(): void {
    this.restaurants = [];
    this.restaurauntsChanged.next([...this.restaurants]);
    this.restaurauntsCleared.next(false);
  }

  RemoveRestaurant(address: string) {
    this.restaurants = this.restaurants.filter(
      (item) => item.address !== address
    );
  }
}

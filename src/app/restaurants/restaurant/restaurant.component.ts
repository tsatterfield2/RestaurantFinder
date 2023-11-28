import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Restaurant } from '../restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
})
export class RestaurantComponent {
  @Input() restaurant: Restaurant;
  @Output() remove: EventEmitter<string> = new EventEmitter<string>();
  currentDay = new Date().getDay();

  CreateRatingArray() {
    const array = [];
    const number = +this.restaurant.rating.aggregate_rating;
    if (number !== 0) {
      for (var i = 0; i < Math.floor(number); i++) array.push(1);
      for (i = 0; i < 5 - number; i++) array.push(0);
    }
    return array;
  }

  CreatePriceArray() {
    const array = [];
    const number = +this.restaurant.price;
    if (number !== 0) {
      for (var i = 0; i < Math.floor(number); i++) array.push(1);
      for (i = 0; i < 5 - number; i++) array.push(0);
    }
    return array;
  }

  GetDayIndex(day: string): number {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek.indexOf(day);
  }

  onRemoveRestaurant() {
    this.remove.emit(this.restaurant.address);
  }
}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.model';
import { LocationService } from '../location.service';
import { Hours, Rating } from '../shared/Interfaces';
import { Review } from './restaurant/reviews/review.model';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
})
export class RestaurantsComponent {
  @ViewChild('targetElement', { static: false }) targetElement: ElementRef;
  restaurants: Restaurant[] = [];
  moreClicked: boolean;
  loadMoreVisible: boolean;
  restaurantsVisible: boolean;

  constructor(
    private restaurantService: RestaurantService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) {
    this.moreClicked = false;
    //this.CreateTestRestaurant();
  }

  ngOnInit() {
    this.restaurantService
      .GetRestaurantsSubject()
      .subscribe((response: Restaurant[]) => {
        this.restaurantsVisible = true;
        this.restaurants = response;
        this.cdr.detectChanges();
      });

    this.restaurantService
      .GetRestaurantsClearedSubject()
      .subscribe((response: boolean) => {
        this.restaurantsVisible = response;
        this.cdr.detectChanges();
      });

    this.restaurantService.GetRestaurantsLoadedSubject().subscribe(() => {
      if (!this.moreClicked) this.ScrollToElement();
    });

    this.locationService
      .GetMorePagesSubject()
      .subscribe((response: boolean) => {
        this.loadMoreVisible = response;
        this.cdr.detectChanges();
      });
  }

  ScrollToElement() {
    if (this.targetElement.nativeElement) {
      this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  OnRemoveRestaurant(address: string) {
    this.restaurants = this.restaurants.filter(
      (item) => item.address !== address
    );
    this.restaurantService.RemoveRestaurant(address);
    this.cdr.detectChanges();
  }

  OnToTop() {
    this.moreClicked = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  OnMore() {
    this.moreClicked = true;
    this.locationService.getNextPage();
  }

  // Testing method //
  CreateTestRestaurant() {
    const hours: Hours = {
      open_now: true,
      operation_hours: [
        'Monday: 10 - 10',
        'Tuesday: 10 - 10',
        'Wednesday: 10 - 10',
        'Thursday: 10 - 10',
        'Friday: 10 - 10',
        'Saturday: 10 - 10',
        'Sunday: 10 - 10',
      ],
    };
    const ratingObject: Rating = { aggregate_rating: '3', total_votes: '124' };

    const reviews: Review[] = [];

    const review = new Review(
      'billybob',
      3,
      '3 months ago',
      'Worst place in town!'
    );

    reviews.push(review);

    const restaurant = new Restaurant(
      'Popeyes',
      '4300 Cornhusker HWY',
      '9168997216',
      hours,
      3,
      'url.com',
      'url.com',
      ratingObject,
      reviews,
      []
    );

    this.restaurants.push(restaurant);
    this.restaurantsVisible = true;
  }
}

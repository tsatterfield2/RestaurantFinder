import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Review } from './review.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent {
  @Input() reviews: Review[];
  currentReview: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  CreateRatingArray() {
    const array = [];
    const number = +this.reviews[this.currentReview].rating;
    if (number !== 0) {
      for (var i = 0; i < Math.floor(number); i++) array.push(1);
      for (i = 0; i < 5 - number; i++) array.push(0);
    }
    return array;
  }

  OnPreviousReview(): void {
    if (this.currentReview == 0) this.currentReview = this.reviews.length - 1;
    else this.currentReview--;
    this.cdr.detectChanges();
  }

  OnNextReview(): void {
    if (this.currentReview == this.reviews.length - 1) this.currentReview = 0;
    else this.currentReview++;
    this.cdr.detectChanges();
  }
}

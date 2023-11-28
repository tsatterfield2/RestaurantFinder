import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../location.service';
import { NgxGpAutocompleteDirective } from '@angular-magic/ngx-gp-autocomplete';
import { RestaurantService } from '../restaurants/restaurant.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  inputValue: string;
  location: google.maps.places.PlaceResult;
  locationSelected: boolean;
  displayLoading: boolean;
  navigatedLocation: boolean;
  errorMessage: string;

  @ViewChild('placesRef', { static: false })
  placesRef: NgxGpAutocompleteDirective;

  constructor(
    private locationService: LocationService,
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {
    this.inputValue = '';
    this.locationSelected = false;
    this.displayLoading = false;
    this.navigatedLocation = false;
  }

  ngOnInit(): void {
    this.locationService.GetVicinitySubject().subscribe((response: string) => {
      if (this.navigatedLocation) this.inputValue = response;
      this.displayLoading = false;
      this.cdr.detectChanges();
    });

    this.locationService.GetErrorSubject().subscribe((response: string) => {
      this.errorMessage = response;
      this.displayLoading = false;
      this.locationSelected = false;
      this.inputValue = '';
      this.cdr.detectChanges();
    });
  }

  OnUseLocation(): void {
    this.errorMessage = '';
    this.navigatedLocation = true;
    this.locationSelected = true;
    this.displayLoading = true;
    this.locationService.BrowserFindLocation();
  }

  HandleAddressChange(place: google.maps.places.PlaceResult): void {
    this.location = place;
    this.inputValue = this.location.formatted_address as string;
  }

  OnClearLocation(): void {
    this.inputValue = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  OnReset(): void {
    this.navigatedLocation = false;
    this.inputValue = '';
    this.errorMessage = '';
    this.locationSelected = false;
    this.restaurantService.Clear();
  }

  OnSubmit(): void {
    this.errorMessage = '';
    this.navigatedLocation = false;
    this.locationSelected = true;
    this.displayLoading = true;

    const address =
      (this.location?.formatted_address as string) ?? this.inputValue;

    this.locationService.GoogleRequestCoordinates(address);
    this.cdr.detectChanges();
  }
}

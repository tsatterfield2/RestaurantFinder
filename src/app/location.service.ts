import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable, forkJoin, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilService } from './shared/utils.service';
import { RestaurantService } from './restaurants/restaurant.service';
import { Coordinates, GoogleResponse } from './shared/Interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  coords!: Coordinates;
  placesService: google.maps.places.PlacesService;
  navigationVicinity: string;
  vicinitySubject = new Subject<string>();
  morePages = new Subject<boolean>();
  errorSubject = new Subject<string>();

  GetVicinitySubject(): Observable<string> {
    return this.vicinitySubject.asObservable();
  }

  GetErrorSubject(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  GetMorePagesSubject(): Observable<boolean> {
    return this.morePages.asObservable();
  }

  getNextPage: () => void | false;

  constructor(
    private http: HttpClient,
    private util: UtilService,
    private restaurantService: RestaurantService
  ) {
    this.placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  }

  // Find a location using the browser navigator and use that lat,long //
  BrowserFindLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          this.coords = { lat: latitude, lon: longitude };
          this.GetNearbyRestaurants();
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting geolocation:', error.message);
          this.errorSubject.next(
            'Browser finding Geolocation using the Browser.'
          );
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.errorSubject.next(
        'Browser Geolocation is not supported by this browser.'
      );
    }
  }

  // Request the from google the lat,long of a place //
  GoogleRequestCoordinates(locationName: string): void {
    const params = new HttpParams()
      .append('address', locationName)
      .append('key', this.util.GOOGLEKEY);

    this.http
      .get<GoogleResponse>(this.util.GOOGLEGEOCODEURL, { params })
      .pipe(
        catchError((error: any) => {
          console.error(error);
          return throwError(() => error);
        })
      )
      .subscribe((response: GoogleResponse) => {
        if (response.status === 'OK') {
          const { lat, lng } = response.results[0].geometry.location;
          this.coords = { lat, lon: lng };
          this.GetNearbyRestaurants();
        } else {
          console.error('Place did not exist');
          this.errorSubject.next('Place did not exist.');
        }
      });
  }

  // Populate nearby restaurants //
  private GetNearbyRestaurants(): void {
    this.GoogleNearbyRestaurants(
      this.coords.lat,
      this.coords.lon,
      3000
    ).subscribe((results) => {
      this.navigationVicinity = results[0].vicinity!;
      this.vicinitySubject.next(this.navigationVicinity);
    });
  }

  // Get nearby restaurants from google using the lat and long //
  private GoogleNearbyRestaurants(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<google.maps.places.PlaceResult[]> {
    const location = new google.maps.LatLng(latitude, longitude);

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius,
      rankBy: google.maps.places.RankBy.PROMINENCE,
      type: 'restaurant',
      keyword: 'food',
    };

    return new Observable((observer) => {
      this.placesService.nearbySearch(
        request,
        (results, status, pagination) => {
          // Get all the place details of these restaurants //
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const placeDetailsObservables: Observable<any>[] = [];
            for (const element of results!.slice(0, 20)) {
              const placeDetailsObservable = this.GooglePlaceDetails(
                element.place_id as string
              );
              placeDetailsObservables.push(placeDetailsObservable);
            }

            forkJoin(placeDetailsObservables).subscribe(
              (placeDetailsResponses) => {
                this.restaurantService.AddRestaurants(placeDetailsResponses);
                this.morePages.next(pagination?.hasNextPage!);
              }
            );

            // Load next page using this same callback //
            if (pagination && pagination.hasNextPage) {
              this.getNextPage = () => {
                pagination.nextPage();
              };
            }
            observer.next(results!);
            observer.complete();
          }

          // Zero results //
          else if (
            status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            console.error('No nearby restaurants found.');
            this.errorSubject.next('No nearby restaurants found.');
            observer.next([]);
            observer.complete();
          }

          // API Limit exceeded //
          else if (
            status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
          ) {
            console.error('Too many requests. Please try again later.');
            this.errorSubject.next(
              'Too many requests, please wait and try again.'
            );
            observer.next([]);
            observer.complete();
          } else {
            observer.error(`Nearby search failed. Status: ${status}`);
          }
        }
      );
    });
  }

  // Get further restaurant details from google //
  private GooglePlaceDetails(
    placeId: string
  ): Observable<google.maps.places.PlaceResult> {
    const request: google.maps.places.PlaceDetailsRequest = { placeId };

    return new Observable((observer) => {
      this.placesService.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          observer.next(result!);
          observer.complete();
        }

        // API Limit exceeded //
        else if (
          status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
        ) {
          console.error('Too many requests. Please try again later.');
          this.errorSubject.next(
            'Too many requests, please wait and try again.'
          );
          observer.error(`Place Details search failed. Status: ${status}`);
        }
      });
    });
  }
}

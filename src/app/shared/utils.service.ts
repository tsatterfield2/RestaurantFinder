import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    // Google utilities //
    readonly GOOGLEKEY = "AIzaSyDojavJMHo174aNn3gjc1hNRyCUA8_yues";
    readonly GOOGLEGEOCODEURL = "https://maps.googleapis.com/maps/api/geocode/json";
    readonly GOOGLENEARBYSEARCHURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
}
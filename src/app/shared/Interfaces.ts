// Location Coordinates //
export interface Coordinates {
  lat: number;
  lon: number;
}

// Google Response //
export interface GoogleResponse {
  results: any[];
  status: string;
}

// Restaurant Rating //
export interface Rating {
  aggregate_rating: string;
  total_votes: string;
}

// Restaurant Hours //
export interface Hours {
  open_now: boolean;
  operation_hours: string[];
}

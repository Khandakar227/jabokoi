import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getShohozSignIn = () => {
  const options = { method: 'GET' };
  fetch('/api/shohozsignin', options)
    .then(response => response.json())
    .then(response => {
      localStorage.setItem('shohoz_access_token', response.data.token)
      localStorage.setItem('shohoz_refresh_token', response.data.refresh_token)
    })
    .catch(err => console.error(err));
}

export const getBusRoutes = async (from_city: string, to_city: string, date_of_journey: string) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('shohoz_access_token') as string,
    }
  };
  const res = await fetch(`/api/shohozbusapi?from_city=${from_city}&to_city=${to_city}&date_of_journey=${date_of_journey}`, options);
  const data = await res.json();
  console.log(data);
  return data;
}

export const getTrainRoutes = async (from_city: string, to_city: string, date_of_journey: string, seat_class: string) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('shohoz_access_token') as string,
    }
  };
  const res = await fetch(`/api/shohoztrainapi?from_city=${from_city}&to_city=${to_city}&date_of_journey=${date_of_journey}&seat_class=${seat_class}`, options);
  const data = await res.json();
  console.log(data);
  return data;
}


export function formatDate(date: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const getMaxBusFare = (arr: any[]) => {
  return arr.reduce((max, item) => {
    return item.business_class_fare && item.business_class_fare > max ? item.business_class_fare : max;
  }, 0);
}

export const getMinBusFare = (arr: { business_class_fare: number }[]) => {
  return arr.reduce((min, item) => {
    return item.business_class_fare && (item.business_class_fare < min) ? item.business_class_fare : min;
  }, Infinity);
}

function getMaxSeatFare(train: any) {
  let maxFare = train.seat_types.reduce((max: any, seat: any) => {
    const fare = parseFloat(seat.fare);
    return fare > max ? fare : max;
  }, 0); // initialize with 0
  return maxFare;
}

// Function to get the minimum seat fare
function getMinSeatFare(train: any) {
  let minFare = train.seat_types.reduce((min: any, seat: any) => {
    const fare = parseFloat(seat.fare);
    return (fare > 0 && (fare < min || min === 0)) ? fare : min;
  }, 0); // initialize with 0
  return minFare;
}

// get overall min fare
export const getMinTrainFare = (trains: any) => {
  let minFare = Infinity;
  trains.forEach((train: any) => {
    const minSeatFare = getMinSeatFare(train);
    if (minSeatFare < minFare) {
      minFare = minSeatFare;
    }
  });
  return minFare;
}

export const getMaxTrainFare = (trains: any) => {
  let maxFare = 0;
  trains.forEach((train: any) => {
    const maxSeatFare = getMaxSeatFare(train);
    if (maxSeatFare > maxFare) {
      maxFare = maxSeatFare;
    }
  });
  return maxFare;
}

export const getNearbyHotels = async (lat: string, long: string, arrival_date: string, { days_to_stay = 1, room_qty = 1 }) => {
  let d = new Date(arrival_date);
  d.setDate(d.getDate() + days_to_stay);
  let departure_date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates?latitude=${lat}&longitude=${long}&arrival_date=${arrival_date}&departure_date=${departure_date}&radius=10&adults=1&children_age=0%2C17&room_qty=${room_qty}&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=USD`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.XRapidapiKey as string,
      'x-rapidapi-host': process.env.XRapidapiHost as string
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}


export const getLatLong = async (locationName:string, API_KEY:string) => {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${API_KEY}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const location = data.results[0].geometry.location;
    console.log('Latitude:', location.lat);
    console.log('Longitude:', location.lng);
    
    return location; // {lat: ..., lng: ...}
  } catch (error) {
    console.error('Error fetching coordinates:', error);
  }
};

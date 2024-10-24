import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getShohozSignIn = () => {
  const options = {method: 'GET'};
  fetch('/api/shohozsignin', options)
    .then(response => response.json())
    .then(response => {
      localStorage.setItem('shohoz_access_token', response.data.token)
      localStorage.setItem('shohoz_refresh_token', response.data.refresh_token)
    })
    .catch(err => console.error(err));
}

export const getBusRoutes = async (from_city:string, to_city: string, date_of_journey:string) => {
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

export const getTrainRoutes = async (from_city:string, to_city: string, date_of_journey:string, seat_class:string) => {
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
    return item.business_class_fare && item.business_class_fare > max.business_class_fare ? item.business_class_fare : max?.business_class_fare;
  }, 0); 
}

export const getMinBusFare = (arr:any[]) => {
  return arr.reduce((min, item) => {
    return item.business_class_fare && (item.business_class_fare < min.business_class_fare) ? item.business_class_fare : min?.business_class_fare;
  }, Infinity);
}
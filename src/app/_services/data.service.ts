import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject<string>("");
  currentMessage = this.messageSource.asObservable();

  private searchedUserIdSource = new BehaviorSubject<number>(0);
  searchedUserId = this.searchedUserIdSource.asObservable();   
  
  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  setSearchedUserId(id: number) {
    this.searchedUserIdSource.next(id);
  }
}


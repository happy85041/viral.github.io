import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStrorageService {
  constructor() { }

  public SetItem(key: string) 
  {
    localStorage.setItem('userName', key);
  }
  public RemoveItem() {
    localStorage.removeItem('userName');
  }
  public GetData() {   
     return localStorage.getItem('userName');   
  }
}


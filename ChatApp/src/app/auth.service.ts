import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private firestore: AngularFirestore) { }
  createUser(user:User){   
      return this.firestore.collection("users").add({
        Name: user.Name,
        Password:user.Password
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
  getPolicies() {
    return this.firestore.collection('users').snapshotChanges();
  }
}
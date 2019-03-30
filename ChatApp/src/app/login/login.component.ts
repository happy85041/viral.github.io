import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../auth.service';
import { User } from '../user.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public model =new  User;
  public users : User[];  
  public errorMessage:string; 

  constructor(private router: Router,
    public authService: AuthService) { }

  ngOnInit() {   
    this.errorMessage="";
   
  }
  login(){   
    this.errorMessage=""; 
    debugger; 
    if(this.model.Name)
    {
        if(this.model.Password)
        {            
             this.signIn();             
        }
     }
  };    
  signup() {   
   this.authService.createUser(this.model)
  }

  signIn() {
    this.authService.getPolicies().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as User;        
      })
      if(this.users && this.users.length>0)
      {
        var isValid=this.users.filter(s=>s.Name==this.model.Name && s.Password==this.model.Password);
        if(isValid.length>0)
        {
          this.router.navigate(['/user',this.model.Name])
        }
        else
        {
          this.errorMessage="Invalid Login Credentials";
        };       
      }
    });
    return false;
  }
}

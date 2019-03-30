import { Component, OnInit, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
  import Chatkit from '@pusher/chatkit-client';
  import { FormsModule } from '@angular/forms';
  import { ActivatedRoute } from '@angular/router';
  import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
  

})
export class UserComponent implements OnInit {
  userId = '';
  currentUser = <any>{};
  messages = [];
  currentRoom = <any>{};
  roomUsers = [];
  userRooms = [];
  newMessage = '';
  newRoom = {
    name: '',
    isPrivate: false
  };
  newUser = '';
  joinableRooms = [];
  constructor( private activatedRoute: ActivatedRoute ,
    private router: Router) 
  {
    this.userId = this.activatedRoute.snapshot.params["id"];
    if(!this.userId)
    {
      this.router.navigate(['/login'])
    }
    else{
      this.addUser();
    }
  }
  
  LogOut()
  {
  
    this.router.navigate(['/login'])
  }
  connectToRoom(id) {
    this.messages = [];
    const { currentUser } = this;
    currentUser.subscribeToRoom({
      roomId: `${id}`,
      messageLimit: 50,
      hooks: {
        onMessage: message => {
          message.createdAt= this.formatAMPM(new Date(message.createdAt));
          this.messages.push(message);

        },
        onPresenceChanged: () => {
          this.roomUsers = this.currentRoom.users.sort((a) => {
            if (a.presence.state === 'online') return -1;

            return 1;
          });
        },
      },
    })
    .then(currentRoom => {
      this.currentRoom = currentRoom;
      this.roomUsers = currentRoom.users;
      this.userRooms = currentUser.rooms;
    });
  }

  addUser() {   
    const { userId } = this;
    const tokenProvider = new Chatkit.TokenProvider({
     // url: 'https://chatappviral.firebaseapp.com/authenticate'
     url:'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f5a23db4-810f-4bed-8737-f6d3b3d7c67f/token'
    });

    const chatManager = new Chatkit.ChatManager({
      instanceLocator: "v1:us1:f5a23db4-810f-4bed-8737-f6d3b3d7c67f",
      userId,
      tokenProvider
    });

    chatManager
    .connect()
    .then(currentUser => {
      this.currentUser = currentUser;
            this.connectToRoom(currentUser.rooms[0].id);
            
    })
    .catch(error => {
        console.error("error:", error);
    });
  }
  sendMessage() {
    const { newMessage, currentUser, currentRoom } = this;

    if (newMessage.trim() === '') return;

    currentUser.sendMessage({
      text: newMessage,
      roomId: `${currentRoom.id}`,
    });

    this.newMessage = '';
  }
  createRoom() {
    const { newRoom: { name, isPrivate }, currentUser } = this;

    if (name.trim() === '') return;

    currentUser.createRoom({
      name,
      private: isPrivate,
    }).then(room => {
      this.connectToRoom(room.id);
      this.newRoom = {
        name: '',
        isPrivate: false,
      };
    })
    .catch(err => {
      console.log(`Error creating room ${err}`)
    })
  }
  getJoinableRooms() {
    const { currentUser } = this;
    currentUser.getJoinableRooms()
    .then(rooms => {
      this.joinableRooms = rooms;
    })
    .catch(err => {
      console.log(`Error getting joinable rooms: ${err}`)
    })
  }

  joinRoom(id) {
    const { currentUser } = this;
    currentUser.joinRoom({ roomId: id })
    .catch(err => {
      console.log(`Error joining room ${id}: ${err}`)
    })
  }
  addUserToRoom() {
    const { newUser, currentUser, currentRoom } = this;
    currentUser.addUserToRoom({
      userId: newUser,
      roomId: currentRoom.id
    })
      .then((currentRoom) => {
        this.roomUsers = currentRoom.users;
      })
      .catch(err => {
        console.log(`Error adding user: ${err}`);
      });

    this.newUser = '';
  }
  ngOnInit() {
  }
  onKey(event: any) {   
   if(event.which === 13) 
   {
     this.sendMessage();
   }
  }
   formatAMPM(date:any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}


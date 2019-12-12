import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mode = 'side';
  subject = webSocket('ws://echo.websocket.org/');

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.subject.subscribe();
    this.subject.next('ada kaga ya');
    this.subject.subscribe(
      msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
    // this.subject.complete();
    if (window.localStorage.getItem('token') == null) {
      this.router.navigateByUrl('/login');
    }
    const partsToken = window.localStorage.getItem('token').split('.');
    window.localStorage.setItem( 'user_info', decodeURIComponent((window as any).escape(window.atob(partsToken[1]))) );
    if (window.screen.width <= 510) {
      this.mode = 'over';
    }
  }

  logout() {
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}

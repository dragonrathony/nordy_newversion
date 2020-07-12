import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

declare var $;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  loggedInUsername: string = 'Maxiplast';
  constructor(private location: Location) { }

  ngOnInit(): void {
    let userinfo = JSON.parse(localStorage.getItem('currentUser'))
    this.loggedInUsername = userinfo[0].Username
    
    $(document).ready(() => {
      $('.sidebar-menu').tree();
    });
    $(".slimscroll-menu").slimScroll({ height: "100% !important", position: "right", size: "8px", touchScrollStep: 20, color: "#9ea5ab" });
  }

  loadScript(url) {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  logout() {
    localStorage.clear();
    location.reload();
  }
}

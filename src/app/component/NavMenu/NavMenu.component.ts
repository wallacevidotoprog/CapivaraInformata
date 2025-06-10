import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-NavMenu',
  standalone: true,
  templateUrl: './NavMenu.component.html',
  styleUrls: ['./NavMenu.component.scss'],
  imports: [RouterLink],
})
export class NavMenuComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

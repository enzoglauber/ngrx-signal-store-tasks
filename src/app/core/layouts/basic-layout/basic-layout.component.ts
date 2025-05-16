import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-basic-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './basic-layout.component.html',
  styleUrl: './basic-layout.component.scss',
})
export class BasicLayoutComponent {}

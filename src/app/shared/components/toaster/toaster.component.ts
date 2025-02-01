import { Component } from '@angular/core';
import { ToasterService } from '../../../core/services/toaster/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent {
  constructor(public toasterService: ToasterService) {}
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterComponent } from './components/toaster/toaster.component';

const declarations = [NotFoundComponent, ToasterComponent];
const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbTooltipModule,
  NgbToastModule,
];
@NgModule({
  declarations: declarations,
  imports: imports,
  exports: [...declarations, ...imports],
})
export class SharedModule {}

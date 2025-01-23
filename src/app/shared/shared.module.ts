import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/not-found/not-found.component';

const declarations = [NotFoundComponent];
const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
];
@NgModule({
  declarations: declarations,
  imports: imports,
  exports: [...declarations, ...imports],
})
export class SharedModule {}

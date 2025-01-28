import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotHeaderComponent } from './bot-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BotHeaderComponent],
  imports: [CommonModule, RouterModule],
  exports: [BotHeaderComponent],
})
export class BotHeaderModule {}

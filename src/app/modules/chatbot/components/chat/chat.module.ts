import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [ChatComponent],
})
export class ChatModule {}

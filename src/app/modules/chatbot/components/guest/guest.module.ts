import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { ChatModule } from '../chat/chat.module';
import { BotFooterModule } from '../bot-footer/bot-footer.module';
import { BotHeaderModule } from '../bot-header/bot-header.module';

@NgModule({
  declarations: [GuestComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
    ChatModule,
    BotHeaderModule,
    BotFooterModule,
  ],
})
export class GuestModule {}

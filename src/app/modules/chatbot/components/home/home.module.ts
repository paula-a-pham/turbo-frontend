import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChatModule } from '../chat/chat.module';
import { BotHeaderModule } from '../bot-header/bot-header.module';
import { BotFooterModule } from '../bot-footer/bot-footer.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChatModule,
    BotHeaderModule,
    BotFooterModule,
    SharedModule,
  ],
})
export class HomeModule {}

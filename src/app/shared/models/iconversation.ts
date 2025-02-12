import { Timestamp } from '@angular/fire/firestore';
import { IMessage } from './imessage';

export interface IConversation {
  userMessage: IMessage;
  assistantMessage?: IMessage;
  creationDate: Timestamp;
  index: number;
}

import { Timestamp } from '@angular/fire/firestore';
import { MessageRole } from '../enums/message-role';

export interface IMessage {
  role: MessageRole;
  content: string;
  creationDate: Timestamp;
}

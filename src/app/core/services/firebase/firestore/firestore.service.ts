import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  IChat,
  IChatBase,
  IChatUpdateDto,
} from '../../../../shared/models/ichat';
import { from, map, Observable } from 'rxjs';
import { IMessage } from '../../../../shared/models/imessage';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  // setup firestore collection name
  private collectionName: string = 'chats';

  // inject firestore
  constructor(private firestore: Firestore) {}

  // create new document in chats collection to represent a single chat
  createNewChat(chat: IChat): Observable<string> {
    // reference to collection
    const itemsCollection: CollectionReference<DocumentData, DocumentData> =
      collection(this.firestore, this.collectionName);

    return from(addDoc(itemsCollection, chat)).pipe(map((doc) => doc.id));
  }

  // get all chats as an id and name only
  getAllChatsByUserId(userId: string): Observable<IChatBase[]> {
    // reference to collection
    const itemsCollection: CollectionReference<DocumentData, DocumentData> =
      collection(this.firestore, this.collectionName);

    // apply filter to get only document for logged in user
    const filteredQuery = query(
      itemsCollection,
      where('userId', '==', userId),
      orderBy('lastUpdate', 'desc')
    );

    return from(collectionData(filteredQuery, { idField: 'id' })).pipe(
      map((chats) =>
        chats.map(
          (chat) => ({ id: chat['id'], name: chat['name']??'New Chat' } as IChatBase)
        )
      )
    );
  }

  // get only one chat using its id
  getChatById(chatId: string): Observable<IChat> {
    // reference to chat
    const itemRef: DocumentReference<DocumentData, DocumentData> = doc(
      this.firestore,
      `${this.collectionName}/${chatId}`
    );

    return from(getDoc(itemRef)).pipe(map((doc) => doc.data() as IChat));
  }

  // extract all messages inside a specifiec chat
  getChatMessagesByChatId(chatId: string): Observable<IMessage[]> {
    return this.getChatById(chatId).pipe(map((chat) => chat.messages || []));
  }

  // update chat properties in optional way using IChatUpdateDto
  updateChatById(
    chatId: string,
    updatedChat: Partial<IChatUpdateDto>
  ): Observable<void> {
    // reference to chat
    const itemRef: DocumentReference<DocumentData, DocumentData> = doc(
      this.firestore,
      `${this.collectionName}/${chatId}`
    );

    return from(updateDoc(itemRef, updatedChat));
  }

  // delete chat with id
  deleteChatById(chatId: string): Observable<void> {
    // reference to chat
    const itemRef: DocumentReference<DocumentData, DocumentData> = doc(
      this.firestore,
      `${this.collectionName}/${chatId}`
    );

    return from(deleteDoc(itemRef));
  }
}

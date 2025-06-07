import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private stompClient!: Client;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  private notificationCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  notificationCount$ = this.notificationCountSubject.asObservable();

  constructor() {
    this.connect();
  }

  connect() {
    const socket = new SockJS('http://localhost:8282/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/user/notifications', (message: IMessage) => {
        const notification = JSON.parse(message.body);
        console.log('Notification received:', notification);
        
        // Update notifications array and count
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = [notification, ...currentNotifications];
        this.notificationsSubject.next(updatedNotifications);
        this.notificationCountSubject.next(updatedNotifications.length);
      });
    };

    this.stompClient.activate();
  }

  clearNotificationCount() {
    this.notificationCountSubject.next(0);
  }

  clearAllNotifications() {
    this.notificationsSubject.next([]);
    this.clearNotificationCount();
  }
}

function Injectable(arg0: { providedIn: string; }): (target: typeof NotificationService) => void | typeof NotificationService {
  throw new Error('Function not implemented.');
}

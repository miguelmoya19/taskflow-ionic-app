import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  checkmarkDoneCircle, searchOutline, notificationsOutline, 
  listOutline, timeOutline, checkmarkCircleOutline, add,
  apps, briefcase, person, fitness, trashOutline, 
  closeCircle, folderOutline, checkmark 
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      'checkmark-done-circle': checkmarkDoneCircle,
      'search-outline': searchOutline,
      'notifications-outline': notificationsOutline,
      'list-outline': listOutline,
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'add': add,
      'apps': apps,
      'briefcase': briefcase,
      'person': person,
      'fitness': fitness,
      'trash-outline': trashOutline,
      'close-circle': closeCircle,
      'folder-outline': folderOutline,
      'checkmark': checkmark,
        'document': document
    });
  }
}

import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class ServiceAlert 
{
  constructor(public alertCtrl: AlertController,private toast: Toast) 
  {
  }

  MyAlert(title: string, message: string, handler: any) 
  {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: handler
        }
      ]
    });
    confirm.present();
  }

  msgbox(str)
  {
        let alert = this.alertCtrl.create({
        title: '알림',
        subTitle: str,
        buttons: ['확인']
    });
    alert.present();
  }

  toastmsg(str)
  {
        this.toast.show(str, '1000', 'bottom').subscribe//새글이 올라왔습니다
        (
            toast => 
            {
              console.log(toast);
            }
        );   
  }

  MyToast(title: string, message: string, handler: any) 
  {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: handler
        }
      ]
    });
    confirm.present();
  }

}
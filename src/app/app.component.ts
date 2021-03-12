import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from 'ionic-angular';
import { IonicApp } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { App } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { ServerComm } from '../providers/server_comm';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NoticeListPage } from '../pages/notice-list/notice-list';
import { NotifyListPage } from '../pages/notify-list/notify-list';
import { CustomerCenterPage } from '../pages/customer-center/customer-center';
import { SettingPage } from '../pages/setting/setting';
import { ServiceAlert } from '../providers/service_message';
import { PvEssPage } from '../pages/pv-ess/pv-ess';
import { EvPage } from '../pages/ev/ev';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

//import {Plugins, LocalNotificationEnabledResult, LocalNotificationActionPerformed, LocalNotification, Device} from '@capacitor/core'
//const { LocalNotifications } = Plugins;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
    
  rootPage:any = LoginPage;
  public confirm:any;
  public islogin:any = false;
  public userid:any;
  public password:any;
  
  public  confirmAlert:any=null;

  backButtonPressed: boolean = false; 

  site_name:any="";//아파트명
  apt_dong_name:any="";//아파트동
  apt_ho_name:any="";//아파트호수
  member_name:any="";//회원이름

  alarm_unread_count:any;//알림
  notice_unread_count:any;//공지
  answer_unread_count:any;//고객센터

  is_ev_pv_ess:any; //PV-ESS 지원 여부

  constructor( public ionicApp:IonicApp, public msg:ServiceAlert, public alertCtrl: AlertController,public app: App, public keyboard: Keyboard,public host:ServerComm,public menu: MenuController,public fcm: FCM,public platform: Platform, private toastCtrl:ToastController, public toast: Toast, private mobileAccessibility: MobileAccessibility,public statusBar: StatusBar, private events: Events,public storage: Storage,public splashScreen: SplashScreen, public localNotifications: LocalNotifications) {

    this.BackButton();//뒤로가기 할때 이벤트 화면 종료창
    this.getEvent()//이벤트받기
    this.initializeApp();
   
  }



  initializeApp() 
  {
    
    this.platform.ready().then(() => 
    {

       //이렇게 해야 폰트 크기 변경으로 깨지지 않음
       this.mobileAccessibility.setTextZoom(100);//기본 폰트로 줌설정
       this.mobileAccessibility.usePreferredTextZoom(false);//시스템 글자 크기 사용안함
             
        this.storage.ready().then(() => 
        {      
              /*
              //저장소 작업준비가되어있다면..진행
              this.storage.get('islogin').then((islogin) => 
              {
                if(islogin==false || islogin==null)//로그인이 아닌상태이면..
                {
                    this.storage.set('islogin',false);
                    this.nav.setRoot(LoginPage);//인트로 보여줌
                    this.islogin = false;
                }
                else//로그인이 된상태이면
                {
                    this.islogin = true; 
                    this.nav.setRoot(HomePage);//로그인바로 진입
                }
              });*/
        });            
          
        this.statusBar.styleDefault();
        this.splashScreen.hide();
    });
  }

  getEvent()
  {
        //푸시셋팅시..
        this.events.subscribe('app_push_setting',(data)=>
        {
          if(this.islogin == false)//로그인 안되어있으면
          {
                this.toast.show('Sign up now', '1000', 'bottom').subscribe
                (
                    toast => 
                    {
                        console.log(toast);
                    }
                );   
                return;      
          }
          if(data['app_push_setting']==true)//푸시 전부 보내기 셋팅
          {
              
              this.fcm.subscribeToTopic('all');//푸시구독
              this.loadLocalData(true);
          }
          else
          {
            //alert('test3');
            //  this.pushObject.unregister();
              this.SaveDevicePushID('0000000000000');//푸시 안받기위해서

              this.fcm.unsubscribeFromTopic('all');//푸시해지
              this.toast.show('push off state', '1000', 'bottom').subscribe
              (
                  toast => 
                  {
                      console.log(toast);
                  }
              );            
          }
        }); 

        //내설정에서 보내는 로그아웃버튼 신호 로그아웃한다.
        this.events.subscribe('app_logout',()=>
        {
            this.logout_func();
        }); 

        //홈에서 신호가 오면 애드몹 보여주기
        this.events.subscribe('init_home',(data)=>
        {
          this.loadLocalData(false);
//          this.loadLocalData();
        });   

      //로그인했을때 최초로 한번 푸시셋팅을 보내준다.. 푸시 셋팅을 하지만 register는 하지 않는다..
      this.events.subscribe('auto_login',()=>
      {
      //  this.PushInstall(false);
          this.loadLocalData(true);
      });

      //로그인했을때 최초로 한번 푸시셋팅을 보내준다..
      this.events.subscribe('first_login',()=>
      {
//        this.fcm.subscribeToTopic('all');//푸시구독

        this.loadLocalData(true);
       // this.PushInstall(true);  
      });
    }  


 
    logout_func()
    {
    
          //this.data.GetUserLocalNew();
        //이걸하므로써 로그인정보등이 로컬에 저장된것을 모두 가져온다
        this.host.getUser().then((data)=>
        { 
             if(data==null)
              {
                  this.SaveDevicePushID('0000000000000');//푸시 안받기위해서
                  this.fcm.unsubscribeFromTopic('all');//푸시해지
              
                  this.host.userid="";
                  this.host.password="";
                  this.host.islogin = false;
                  this.islogin = false;
                  this.storage.clear();
                  this.storage.set('islogin',false);    //로그인유무 true/false  
                  this.menu.close();//메뉴닫기
                  this.nav.setRoot(LoginPage);//인트로페이지로 이동
              }
              else //로그인정보 넣어준다.
              {
                this.storage.ready().then(() => 
                {     
                        var myjson:any = JSON.parse(JSON.stringify(data));
                        this.host.password = myjson.password;
                        this.host.userid   = myjson.userid;
                     //   this.host.nickname = myjson.nickname;
    
                        this.SaveDevicePushID('0000000000000');//푸시 안받기위해서
                        this.fcm.unsubscribeFromTopic('all');//푸시해지
                    
                        this.host.userid="";
                        this.host.password="";
                        this.host.islogin = false;
                        this.islogin = false;
                        this.storage.clear();
                        this.storage.set('islogin',false);    //로그인유무 true/false  
                        this.menu.close();//메뉴닫기
                        
                        this.nav.setRoot(LoginPage);//인트로페이지로 이동                    
                  });           
              }
        },(e)=>
        { //reject함수가 실행된경우
          console.log('getting err',e); 
          alert('unable to get local from native storage'); 
        }) 
    
      }

      setting()
      {
        this.menu.close();
        this.nav.push(SettingPage);
      }
      customer()
      {
        this.menu.close();
        this.nav.push(CustomerCenterPage);        
      }

      home()
      {
        this.menu.close();
        this.nav.popToRoot();
      }
      notice()
      {
        this.menu.close();
        this.nav.push(NoticeListPage);
      }

      notify()
      {
        this.menu.close();
        this.nav.push(NotifyListPage);
      }

      //enernet 이승호 작업 페이지

      pvEss()
      {
        this.menu.close();
        this.nav.push(PvEssPage);
      }

      ev()
      {
        this.menu.close();
        this.nav.push(EvPage);
      }

      //end

      search(type)
      {
        this.menu.close();
        this.nav.popToRoot();
/*
        if(type==0)  this.events.publish('home_menu_1'); 
        if(type==1)  this.events.publish('home_menu_2'); 
        if(type==2)  this.events.publish('home_menu_3'); 
        if(type==3)  this.events.publish('home_menu_4'); 
        if(type==4)  this.events.publish('home_menu_5'); */

        this.events.publish('home_reload', { menu:type} );
      }

      logout()
      {
        this.confirm = this.alertCtrl.create({
          title: '알림',
          message: '로그아웃을 하시면, 로그인 정보가 초기화 됩니다. 정말로 로그아웃 하시겠습니까?',
          buttons: [
            {
              text: '아니오',
              handler: () => 
              {
                console.log('Disagree clicked');
                this.confirm.dismiss();
                this.confirm = null;          
              }
            },
            {
              text: '예',
              handler: () => 
              {
                //this.nav.getActiveChildNav().select(0);
                          
                console.log('Agree clicked');
                this.logout_func();
                this.confirm.dismiss();
                this.confirm = null;
              }
            }
          ]
        });
        this.confirm.present();
      }      

//각종알림카운트받기
    getNotifyCount(seq_member)
    {
       //알림갯수
       this.host.GetUnreadAlarmCount(seq_member).subscribe(
        data => 
        {
          this.alarm_unread_count=data.unread_count;
        },
        err=>
        {
          console.log(err);
          this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
        },
        () => 
        {//this.loginstate=1;
          console.log('Movie Search Complete');
        }
      );

       //공지갯수
       this.host.GetUnreadNoticeCount(seq_member).subscribe(
        data => 
        {
          this.notice_unread_count=data.unread_count;
        },
        err=>
        {
          console.log(err);
          this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
        },
        () => 
        {//this.loginstate=1;
          console.log('Movie Search Complete');
        }
      );
      
       //고객센터갯수
       this.host.GetUnreadAnswerCount(seq_member).subscribe(
        data => 
        {
          this.answer_unread_count=data.unread_count;
        },
        err=>
        {
          console.log(err);
          this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
        },
        () => 
        {//this.loginstate=1;
          console.log('Movie Search Complete');
        }
      );      
    }

    loadLocalData(fcmflag)
    {
      //this.data.GetUserLocalNew();
      //이걸하므로써 로그인정보등이 로컬에 저장된것을 모두 가져온다
        this.host.getUser().then((data)=>
        { 
             if(data==null)
              {
                  this.islogin = false; 
              }
              else //로그인정보 넣어준다.
              {
                this.storage.ready().then(() => 
                {     
                        var myjson:any = JSON.parse(JSON.stringify(data));
                    //    this.host.password = myjson.password;
                     //   this.host.userid   = myjson.userid;
                    //    this.host.nickname = myjson.nickname;

                        this.is_ev_pv_ess = myjson.is_ev_pv_ess;
                        
                        if(fcmflag==true)
                        {
                          //저장소 작업준비가되어있다면..진행
                          this.storage.get('islogin').then((islogin) => 
                          {
                            
                              if(islogin==true)//로그인상태이면
                              {
                                  this.host.islogin = true;
                                  this.islogin = true; 
                              }
                              else
                              {
                                  this.islogin = false; 
                              }



                            //회원정보얻기
                              this.host.GetMemberInfo(myjson.seq_member).subscribe(
                                data => 
                                {
                                  this.site_name = data.member_info.site_name;
                                  this.apt_dong_name = data.member_info.apt_dong_name;
                                  this.apt_ho_name = data.member_info.apt_ho_name;
                                  this.member_name = data.member_info.member_name;

                                  this.storage.set('seq_apt_ho', data.member_info.seq_apt_ho);
                                  this.storage.set('site_read_day_elec', data.member_info.site_read_day_elec);
                                  this.storage.set('site_read_day_water', data.member_info.site_read_day_water);
                                  this.storage.set('site_read_day_gas', data.member_info.site_read_day_gas);
                                  this.storage.set('site_read_day_heat', data.member_info.site_read_day_heat);
                                  this.storage.set('site_read_day_steam', data.member_info.site_read_day_steam);

                                  this.FcmPushInit();

                                    
                                },
                                err=>
                                {
                                  console.log(err);
                                  this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
                                },
                                () => 
                                {//this.loginstate=1;
                                  console.log('Movie Search Complete');
                                }
                              );

                              
  /*
                              if(this.host.islogin == true)
                              {
                                  this.host.ModifyGetUserInfo(this.host.userid, this.host.password).subscribe(datadata =>
                                  {
                                      if(datadata=="0")
                                      {
                                        //  this.msgbox("아이디가 없거나 비밀번호가 다릅니다.");//아이디가 없거나 비밀번호가 다릅니다.");
                                      }
                                      else if(datadata=="1")
                                      {
                                        //   this.msgbox("아이디가 없거나 비밀번호가 다릅니다.");//아이디가 없거나 비밀번호가 다릅니다.");
                                      }
                                      else
                                      {
                                      if(datadata.status=="200")
                                      {
  
                                          //this.usertype = datadata.mb_7;
                                          this.ismanager = datadata.mb_7;//0일반회원, 1매니저
                                          this.isusecan = datadata.mb_8;//미승인1 , 승인완료2
                                          this.logintype = datadata.mb_11;//0일반, 1카톡
                                          this.loginstate = datadata.mb_12;//0생성중, 2:생성완료
                                        //  this.userid = datadata.userid;
                                        //  this.password = datadata.password;
                                        this.FcmPushInit();//푸시초기화
                                        //  this.host.platform = datadata.platform;
                                        //  this.org_password = datadata.password;//오리지널 비밀번호 보관
                                        //  this.profile_pic_check(this.userid);
                                      }
                                      else
                                      {
                  
                                      }
                                  }
                                      },
                                      err=>
                                      {
                                      console.log(err);
                                      alert(err);
                                      //this.loader.dismiss();
                                      },
                                      () => console.log('Movie Search Complete')
                                  );                        
                              }*/
                          });                                                                   
                        }
                  });           
              }
        },(e)=>
        { //reject함수가 실행된경우
          console.log('getting err',e); 
          alert('unable to get local from native storage'); 
        }) 
    }
 

  

    FcmPushInit()
    {
            //토큰가져오기
              this.fcm.getToken().then(token=>
              {
               // this.badge.clear();//뱃지클리어
              // backend.registerToken(token);

                  this.SaveDevicePushID(token);
              })
              .catch(error=>{
              console.error(error);
              });
                
              this.fcm.onNotification().subscribe(data =>
              {

               //   this.badge.increase(1);
                  //alert(JSON.stringify(data)); 

                  if(data.wasTapped)//사용자가 상태바에서 알림이 온것을 클릭해서 들어온경우
                  {
                    //alert("Received in background");
                  } 
                  else //포그라운드에서 메시지가 들어온경우
                  {
                    //alert("Received in foreground");
                  };

                if (data.push_type == 1001) {
                  this.confirm = this.alertCtrl.create({
                    title: data.title,
                    message: data.body,
                    buttons: [
                      {
                        text: '승인',
                        handler: () => {
                          console.log('accept clicked');
                          this.host.ResponseAckMember(data.seq_member_ack_requester, 1).subscribe(
                            data => {
                              this.toast.show('승인했습니다', '1000', 'bottom').subscribe
                                (
                                  toast => {
                                    console.log(toast);
                                  }
                                );
                            },
                            err => {
                              console.log(err);
                              alert('네트워크 연결을 확인해주세요.');
                              //this.loader.dismiss();
                            },
                            () => console.log('Movie Search Complete')
                          );
                          this.confirm = null;
                        }
                      },
                      {
                        text: '취소',
                        handler: () => {

                          console.log('decline clicked');
                          this.host.ResponseAckMember(data.seq_member_ack_requester, 2).subscribe(
                            data => {
                              this.toast.show('거절했습니다', '1000', 'bottom').subscribe
                                (
                                  toast => {
                                    console.log(toast);
                                  }
                                );
                            },
                            err => {
                              console.log(err);
                              alert('네트워크 연결을 확인해주세요.');
                              //this.loader.dismiss();
                            },
                            () => console.log('Movie Search Complete')
                          );
                          this.confirm.dismiss();
                          this.confirm = null;
                        }
                      }
                    ]
                  });
                  this.confirm.present();
                }

                  else{
                    this.confirm = this.alertCtrl.create({
                      title: data.title,
                      message: data.body,
                      buttons: [
                        {
                          text: '확인',
                          handler: () => 
                          {
                            console.log('check btn clicked');
                            this.confirm.dismiss();
                            this.confirm = null;          
                          }
                        }
                      ]
                    });
                    this.confirm.present();
                  }
                  

                  /*
                  ALARM_TYPE_UNKNOWN = 0;
                  ALARM_TYPE_REQUEST_ACK_MEMBER = 1001;
                  ALARM_TYPE_RESPONSE_ACK_MEMBER_ACCEPTED = 1002;
                  ALARM_TYPE_RESPONSE_ACK_MEMBER_REJECTED = 1003;
                  ALARM_TYPE_RESPONSE_ACK_MEMBER_CANCELED = 1004;
                  ALARM_TYPE_NOTI_KWH = 1101;
                  ALARM_TYPE_NOTI_WON = 1102;
                  ALARM_TYPE_NOTI_PRICE_LEVEL = 1103;
                  ALARM_TYPE_NOTI_USAGE = 1104;
                  ALARM_TYPE_NOTI_TRANS = 1110;
                  */

                

                  /*
                  if(data.msgtype=="notice")//공지사항
                  {
                     this.msg.msgbox(data.message);
                     this.msg.toastmsg('알림');
                  }      
  
                  if(data.msgtype=="bun")//공지사항
                  {
                     this.msg.msgbox(data.message);
                     this.msg.toastmsg('알림');
                  }
  
                  if(data.msgtype=="overflow")//누적사용량
                  {
                   //  this.msg.msgbox(data.message);
                     //this.msg.toastmsg("해당 매물을 확인하시겠습니까?");     
  
                     let confirm = this.alertCtrl.create({
                      title: '알림',
                      message: '이번달 누적 전기사용량이 250kWh 에 도달 했습니다 . 불필요한 전기 사용이 없는지 한번 살펴보세요',
                      buttons: 
                      [{
                        text: '자세히 보기',
                        handler: () => 
                        {
  //                       this.nav.push(HouseViewPage,{boardname:'g5_write_houseinfo',detail:'', wr_id:data.housecode});   
                        },
                      },
                      {
                        text: '확인',
                        handler: () => 
                        {
                        
                        }
                      }],
                    });
                    confirm.onDidDismiss(() =>{ 
                    });
                    confirm.present();
                     //this.events.publish('tab_badge_increment'); //증가함
                  }     
                  
                  if(data.msgtype=="reply")//댓글답변알림
                  {
                    this.msg.msgbox(data.message);
                     this.msg.toastmsg('댓글알림');              
                  }                              
  
           
  
                  if(data.msgtype=="new")//새글알림
                  {
                    this.msg.msgbox(data.message);
                     this.msg.toastmsg('공지알림');                 
                  }   
                  */        
              })
              //새토큰 새로 가져옴
              this.fcm.onTokenRefresh().subscribe(token=>
              {
                 // backend.registerToken(token);
                 // alert("token Refresh : "+token);
                 this.SaveDevicePushID(token);
              })
        
    }      
  

//디바이스 푸시아이디를 저장해서 나중에 푸시를 보내기 위함
SaveDevicePushID(token)
{
 /*   
    //푸시키 업데이트 다시 
    this.host.updateDevicePush(this.host.userid,this.host.password,token).subscribe(
    data2 => 
    {
        if(data2=="1")
        {
        }
        else if(data2=="2")
        {
           
        }
        else if(data2=="3")
        {
        }
        else
        {
            this.toast.show('device update fail!', '500', 'bottom').subscribe
            (
                toast => 
                {
                  console.log(toast);
                }
            );  
        }
        this.host.SetRegistrationId(token);            
    },
    err => 
    {
            console.log(err);
            alert(err);
            //this.loader.dismiss();
    },
    () => console.log('Complete')
  );*/
}  

closebtn()
{
  this.menu.close();
}

  //백버튼 연속누르면 종료되도록 하자    
  showExit() 
  {
    if(this.backButtonPressed) 
    { 
        this.platform.exitApp();
    } 
    else 
    {
        this.toastCtrl.create({
            message: '다시 누르면 앱이 종료됩니다.',//다시누르면 응용프로그램이 종료됩니다.
            duration: 1000,
            position: 'bottom',
            cssClass: 'text-align: center'
        }).present();
        
        this.backButtonPressed = true;
  
        setTimeout(() => this.backButtonPressed = false, 1000);//다시 트리거 플래그를 false로 표시하지 않고 2 초간 기다립니다. 2秒内没有再次点击返回则将触发标志标记为false
    }
  }
     
  
  
    BackButton()
    {
        this.platform.ready().then(() => 
        { 
          this.confirmAlert =null;
        
          //안드로이드 백버튼 눌렀을때 종료하기..
          this.platform.registerBackButtonAction(() => 
          {
            if (this.keyboard.isOpen()) {//Return 키를 누르면 먼저 키보드를 닫습니다
            this.keyboard.close();
            return;
            }
            if (this.menu.isOpen()) //사이드바가 열려있으면 닫아버린다
            {
                this.menu.close();
                return;
            }
            let navv = this.app.getActiveNav();
            let view = this.nav.getActive();
            
            let currentPage = this.app.getActiveNav().getViews()[0].name;
            
            if(view.component.name=="InfoPage")
            { 
                this.nav.pop();
                return;
            }
            if(view.component.name=="Login")
            {
                this.platform.exitApp();//로그인창에서 뒤로가기하면 바로 종료시켜버린다.
                return;
            }
  
            if(this.confirm)//종료창이 이미 떠있다면 닫자
            {
              this.confirm.dismiss();
              this.confirm = null;
              return;
            }
            
            let activePortal = this.ionicApp._loadingPortal.getActive() ||
            this.ionicApp._modalPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();
            
            if (activePortal) //각종 팝업창이뜬경우 그 팝업창을닫자
            {
              activePortal.dismiss();
              return;
            }          
  
            if (this.nav.canGoBack() && this.nav.length()>1)
            { 
                this.nav.pop();
            }
            else if (navv.canGoBack() && navv.length()>1)
            { 
                navv.pop();
            }
  
            else//더이상 없으면 종료를 물어본다.
            {
                  this.showExit();
            }
          }); 
        });  
    }
  

}


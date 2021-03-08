import { Component } from '@angular/core';
import { Events, MenuController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { PwchangePage } from '../pwchange/pwchange';
import { ServerComm } from '../../providers/server_comm';
import { ServiceAlert } from '../../providers/service_message';
import { NotifyListPage } from '../notify-list/notify-list';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  public islogin:boolean = false;
  public confirm:any;
  seq_member:any;

  site_name:any="";//아파트명
  apt_dong_name:any="";//아파트동
  apt_ho_name:any="";//아파트호수
  member_name:any="";//회원이름
  member_id:any="";//회원id
  member_main:any="";//세대주는 1
  public family_list: Array<any>;

  constructor(public host:ServerComm,public msg:ServiceAlert, public navCtrl: NavController, private events: Events,public navParams: NavParams, private data:ServerComm,public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

    this.loadLocalData();
  }

  //알림
  notify()
  {
    this.navCtrl.push(NotifyListPage);
  }


  //기본데이터 가져오기
  loadLocalData()
  {
      this.host.getUser().then((data)=>
      { 
        if(data==null)
          {
          }
          else //로그인정보 넣어준다.
          {
              var myjson:any = JSON.parse(JSON.stringify(data));
              this.seq_member = myjson.seq_member;//회원seq얻어온다
              this.member_id = myjson.userid;
              this.member_main = myjson.is_main_member;
              //회원정보얻기
              this.host.GetMemberInfo(myjson.seq_member).subscribe(
                data => 
                {
                  this.site_name = data.member_info.site_name;
                  this.apt_dong_name = data.member_info.apt_dong_name;
                  this.apt_ho_name = data.member_info.apt_ho_name;
                  this.member_name = data.member_info.member_name;
                  this.GetMemberRequest(this.seq_member);                  
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
        });
  }

//가족리스트
 GetFamilyListRequest()
 {
  this.host.GetFamilyList(this.seq_member).subscribe(
    data => 
    {
              for(let family of data.family_list) //현재 갯수만큼 추가..
              {   

              }     
              this.family_list = data.family_list;//json배열리스트      
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

 
//회원정보얻기
GetMemberRequest(seq_member)
{
   this.host.GetMemberInfo(seq_member).subscribe(
    data => 
    {
         this.member_main = data.member_info.member_main;//세대주여부 1
         this.GetFamilyListRequest();        //가족정보요청       
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



  msgbox(str)
  {
          let alert = this.alertCtrl.create({
          title: '알림',
          subTitle: str,
          buttons: ['확인']
      });
      alert.present();
  }

  //로그아웃
  logout()
  {
          let confirm = this.alertCtrl.create({
          title: '로그아웃',
          message: '로그아웃 하시겠습니까?',
          buttons: [
            {
              text: '아니오',
              handler: () => 
              {
                console.log('Disagree clicked');
              }
            },
            {
              text: '예',
              handler: () => 
              {
                /*
                console.log('Agree clicked');

                  this.storage.set('islogin',false);    //로그인유무 true/false  
          
                this.storage.clear();
                this.navCtrl.setRoot(Login);//인트로페이지로 이동
                this.menu.close();//메뉴닫기
                */
                this.events.publish('app_logout');
              }
            }
          ]
        });
        confirm.present();
  }

  
  //멤버제거
  memberout(seq_member)
  {
    //this.msgbox('회원탈퇴 동의가 반드시 필요합니다.');
      let confirm = this.alertCtrl.create({
        title: '세대원 제거 알림',
        message: '세대원을 제거 하시겠습니까?',
        buttons: [
          {
            text: '아니오',
            handler: () => 
            {

            }
          },
          {
            text: '예',
            handler: () => 
            {

                this.host.Unsubscribemember(seq_member).subscribe(
                data => 
                {
                    if(data.result_code==1)
                    {
                      this.loadLocalData();
                      this.msgbox('세대원을 제거했습니다');
                    }
                    else
                    {
                      this.msgbox("알수없는 오류로 탈퇴할 수 없습니다.");
                    }
                  
                },
                err=>
                {
                  console.log(err);
                  this.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
                },
                () => 
                {//this.loginstate=1;
                  console.log('Movie Search Complete');
                }
              );     

            }
          }
        ]
      });
      confirm.present();
  }  


  //탈퇴하기
  userout()
  {
    var msg="";
    if(this.member_main)  msg="세대대표자가 회원을 탈퇴하면 세대의 일반회원도 모두 탈퇴 되어 모든 계정정보가 삭제됩니다 . 정말로 탈퇴하시겠습니까 ?";
    else msg="회원을 탈퇴하면 계정의 모든 정보가 삭제됩니다 . 정말로 탈퇴하시겠습니까 ?";

    //this.msgbox('회원탈퇴 동의가 반드시 필요합니다.');
      let confirm = this.alertCtrl.create({
        title: '회원탈퇴 경고!',
        message: msg,//'한번 계정을 삭제하면 재 이용 및 이용 정보가 영구삭제 됩니다. 정말 계정을 삭제하시겠습니까?',
        buttons: [
          {
            text: '아니오',
            handler: () => 
            {

            }
          },
          {
            text: '예',
            handler: () => 
            {

                this.host.Unsubscribemember(this.seq_member).subscribe(
                data => 
                {
                    if(data.result_code==1)
                    {
                      this.events.publish('app_logout');
                    }
                    else
                    {
                      this.msgbox("알수없는 오류로 탈퇴할 수 없습니다.");
                    }
                  
                },
                err=>
                {
                  console.log(err);
                  this.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
                },
                () => 
                {//this.loginstate=1;
                  console.log('Movie Search Complete');
                }
              );     

            }
          }
        ]
      });
      confirm.present();
  }  

  change_pw()
  {
    this.navCtrl.push(PwchangePage);
  }

  //세대사용자정보 도움말
  userinfo()
  {
    this.msgbox("세대에 등록된 세대원을 확인할 수 있으며, 세대 대표자는 목록을 관리 삭제 할 수 있습니다.");
  }

  //요금도움말
  price()
  {
    this.msgbox("해당하는 요금을 설정하시면, 보다 정확한 예상 요금을 안내 받을 수 있습니다.");
  }
}

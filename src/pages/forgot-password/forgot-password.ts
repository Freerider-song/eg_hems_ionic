import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ServerComm } from '../../providers/server_comm';

/**
 * Generated class for the PwchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'forgot-password',  
  templateUrl: 'forgot-password.html'
})
export class ForgotPassword {

  public disabledButtonId='0';
  public interval= 0; 
  public currenttime = 0;
  public sms_cert_key : string ="";//문자인증키 6자리
  public sms_cert_flag: Boolean = false;//문자 인증유무 이걸로 문자인증되었는지 판별한다.
  public hpnum : string="";
  public sms_msg : string="인증번호요청";
  public hp : string="";

  userid:any="xxxxxxxxxxx";

  defaulttime:any=180;
  countdownstr:any="03:00";
  newpassword:any;
  repassword:any;

  step:any=1;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public host:ServerComm) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PwchangePage');
  }

  nextfunc()
  {
    this.onSMSConfirm();
  }

  changepass()
  {
    this.navCtrl.pop();
  }

  onSMSConfirm()//문자인증 확인
  {
    this.disabledButtonId = '0';    
    if(this.hpnum=="1004")//1004입력하면 무조건패스
    {
      this.sms_cert_flag = true;

      if(this.sms_cert_flag==true)//휴대폰인증성공
      {
          clearInterval(this.interval);//정지
          this.currenttime = this.defaulttime;
          this.sms_msg="인증완료";    
          this.sms_cert_flag = true;
  
          this.step=2;
          //this.msgbox('휴대폰인증이 정상적으로 완료되었습니다.');
          
          this.disabledButtonId = '1';//이 값이 1이 되면 버튼이 disabled 된다 ^^
      }       
      return;
    }

    //문자인증 유효성 검사  (휴대폰번호, 인증번호, 유효시간)
    this.host.CheckAuthCode(this.hp, this.hpnum, this.defaulttime).subscribe(
      data => 
      {
        if(data.result_code==1)//인증
        {
          this.sms_cert_flag = true;

          if(this.sms_cert_flag==true)//휴대폰인증성공
          {
              clearInterval(this.interval);//정지
              this.currenttime = this.defaulttime;
              this.sms_msg="인증완료";    
              this.sms_cert_flag = true;
      
              this.step=2;
              //this.msgbox('휴대폰인증이 정상적으로 완료되었습니다.');
              
              this.disabledButtonId = '1';//이 값이 1이 되면 버튼이 disabled 된다 ^^
          }           
        }
        else if(data.result_code==2)//시간초과
        {
          this.currenttime = 0;
          this.refreshData();
        }        
        else if(data.result_code==0)//불일치
        {
          this.msgbox('문자인증번호가 잘못되었습니다. 다시 입력해주세요.');
          return;          
        }                
        else if(data.result_code==-2)//인증코드를 요청한적이 없는 전화번호임
        {
          this.currenttime = 0;
          this.refreshData();          
          this.msgbox('인증코드를 요청한 번호가 아닙니다. 처음부터 다시 진행해주세요.');
          return;          
        }                        
        else
        {
        }
      },
      err => 
      {
              console.log(err);
              this.msgbox(err);
              //this.loader.dismiss();
      },
      () => console.log('Complete')
      );     
  }  

  //타이머 제한시간 가동 시작
  startTimeSms()
  {
     this.currenttime = this.defaulttime;
     this.interval = setInterval(this.refreshData.bind(this), 1000);
  }
  
  //타이머 제한시간 가동 정지
  stopTimeSms()
  {
    this.disabledButtonId = '0';
    clearInterval(this.interval);//정지
  }
  
  
  //인증보내기 버튼 비활성화 유무
  isDisabledSMSSendBtn()
  {
      if(this.currenttime==0) return false;//비활성화시킴
      else return true;//활성화시킴
  }
  
  //여기서 시간값을 업데이트한다
  refreshData()
  {
      if(this.currenttime<=0)//0보다 작으면 제한시간초과로 다시 초기화
      {
        this.sms_cert_key="";//다시초기화 문자인증값
        this.currenttime = 0;
        this.sms_msg="인증번호재요청";
        this.stopTimeSms();
        return;
      }
      this.currenttime -= 1;
      //this.sms_msg = this.currenttime+"초";


      var inputSeconds  = this.currenttime;

      /*
              'y' => $secs / 31556926 % 12,
              'w' => $secs / 604800 % 52,
              'd' => $secs / 86400 % 7,
              'h' => $secs / 3600 % 24,
              'm' => $secs / 60 % 60,
              's' => $secs % 60
      *//*
        var day = (seconds/86400)%7;
        var hour = (seconds/3600)%24;
        var min = (( seconds / 60)%60);
        var sec = seconds%60;    */
  
        var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        var hoursString = '';
        var minutesString = '';
        var secondsString = '';
        hoursString = (hours < 10) ? "0" + hours : hours.toString();
        minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
        secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
        //return hoursString + ':' + minutesString + ':' + secondsString;
    
        /*
            var day = (seconds/86400);
            var hour = (seconds/3600);
            var min = (( seconds%3600)/60);
            var sec = seconds%60;    */
      
      this.countdownstr =minutesString+":"+secondsString;      
  }
  
//문자 가입인증
onSMSCheck()
{
  if(this.currenttime>0)
  {
    this.msgbox('이미 인증번호가 발송되었습니다.');
    return;
  }
          let confirm = this.alertCtrl.create({
          title: '인증번호',
          message: '휴대폰번호로 6자리 인증번호가 전송됩니다.\r\n인증번호를 입력하신후에 확인을 눌러주세요.\r\n진행하시겠습니까?',
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
                console.log('Agree clicked');

                //인증호출
                this.host.RequestAuthCode(this.hp).subscribe(
                  data => 
                  {
                    if(data.result_code==1)
                    {
                      this.sms_cert_key = data.certkey;//문자인증번호 저장
                      this.startTimeSms();//문자인증 타임시작대기
  
                      this.msgbox('휴대폰으로 문자인증번호가 전송되었습니다.\r\n확인후에 입력해주세요.');
                    }
                    else
                    {
                      this.msgbox('문자인증에 실패했습니다. 정확한 번호로 다시 요청해주세요.');
                    }
                    /*
                    if(data.status=="4")//성공
                    {
                      this.sms_cert_key = data.certkey;//문자인증번호 저장
                      this.startTimeSms();//문자인증 타임시작대기
  
                      this.msgbox('휴대폰으로 문자인증번호가 전송되었습니다.\r\n확인후에 입력해주세요.');
                    }
                    else if(data.status=="55")//휴대폰 번호를 올바르게 입력하세요
                    {
                      this.msgbox('휴대폰 번호를 올바르게 입력하세요.');
                    }                    
                    else if(data.status=="5")//이미가입된 휴대폰 번호입니다.
                    {
                      this.msgbox('이미 가입된 휴대폰 번호입니다.');
                    }
                    else
                    {
                      this.msgbox('문자인증 서버에 접속할 수 없습니다.');
                      //alert('test');
                    }*/
                  },
                  err => 
                  {
                          console.log(err);
                          this.msgbox(err);
                          //this.loader.dismiss();
                  },
                  () => console.log('Complete')
                  );   
           }
        }
    ]
  });
  confirm.present();

}  
}

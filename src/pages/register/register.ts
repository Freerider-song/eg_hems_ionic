import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ServerComm } from '../../providers/server_comm';
import { LoginPage } from '../login/login';
import { Events, MenuController, Nav, Platform, Loading } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';

/**
 * Generated class for the PwchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public disabledButtonId='0';
  public interval= 0; 
  public currenttime = 0;
  public sms_cert_key : string ="";//문자인증키 6자리
  public sms_cert_flag: Boolean = false;//문자 인증유무 이걸로 문자인증되었는지 판별한다.
  public hpnum : string="";
  public sms_msg : string="본인인증하기";
  public hp : string="";//폰번호
  public username: string="";//이름
  
  is_candidate:any; //동의서 작성한 세대대표 여부 (0/1)
  ho_state:any; // (1=동의서에 명시된 세대 대표이며 아직 미등록 상태=vacant, 2=동일인이 동일호수에 이미 등록됨=subscribed, 3=다른분이 세대 대표로 이미 등록되어 있슴=occupied)

  user_create_seq_member:any; //생성된 id (실패인 경우 0, 세대 대표자 미등록 상태=-1)
  user_create_result_code:any;//result_code (0=성공, 1=아이디 중복으로 생성 실패, 2=세대 대표자 미등록 상태)

  apart_name:any;//seq_site;
  apart_dong:any;//seq_dong
  apart_ho:any;//seq_ho

  apart_name_str:any;//아파트 실제명
  apart_dong_str:any;//실제동숫자
  apart_ho_str:any;//실제호숫자

  newid:any="";//신규아이디
  userid:any="xxxxxxxxxxx";

  //인증시간값
  defaulttime:any=180;
  countdownstr:any="03:00";

  newpassword:any="";
  repassword:any="";

  //약관동의
  public agree1:any=false;
  public agree2:any=false;
  public agree3:any=false;

  //public ApartInfoList: Array<any>;
  public ApartInfoList: any;//아파트정보json
  public dong_list:any;//동 json
  public ho_list:any;//호 json

  //기본 선택박스 비활성유무
  aprt_list_isEnabled:any = false;
  dong_list_isEnabled:any = true;
  ho_list_isEnabled:any = true;

  step:any=1;

  constructor(public navCtrl: NavController, 
    private sim: Sim,
    public platform: Platform, 
    public navParams: NavParams, 
    private alertCtrl: AlertController, 
    public host:ServerComm) {
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
    
    this.platform.ready().then(() => 
    { 

      this.sim.hasReadPermission().then(
        (info) => console.log('Has permission: '+info)
      );
  
      this.sim.requestReadPermission().then(
        () => console.log('Permission granted'),
        () => console.log('Permission denied')
      );    
      

    //장치에서 전화번호를 가져온다.
    this.sim.getSimInfo().then(
      (info) => 
      {
          //alert('siminfo'+info);
          var phonenumber:string = info.phoneNumber;
          // var str = "0"+phonenumber.substring(3,13);//내전화번호 얻기     
          //alert(phonenumber);
          this.hp  = "010"+phonenumber.substring(phonenumber.length-8,phonenumber.length);//내전화번호 얻기     
          //alert(this.hp);          
      });

      this.GetSiteList_Request();      
    });
  }


  login()
  {
    this.navCtrl.setRoot(LoginPage);
  }

  exit()
  {
    this.platform.exitApp();
  }

  nextfunc()
  {

    var str = this.apart_ho;
    var tok = str.split('|');
     

    //호수,이름,폰번호로 세대주인지 체크하자.
    this.GetMemberCandidateInfo_Request(tok[0],this.username,this.hp);
  }


  
//아파트 배열정보  ( 예외처리를 안주셔서...)
  GetSiteList_Request()
  {

      this.host.GetSiteList().subscribe(
        datadata => 
        {
          for(let data of datadata.site_list) //현재 갯수만큼 찾아온다
          {
           //alert(data.seq_site);
          }
          this.ApartInfoList = datadata.site_list;//json배열리스트

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

//아파트 동리스트요청
   GetAptDongList_Request(seqsite)
   {
       this.host.GetAptDongList(seqsite).subscribe(
         datadata => 
         {
           for(let data of datadata.dong_list) //현재 갯수만큼 찾아온다
           {
            //alert(data.seq_site);
           }
           this.dong_list = datadata.dong_list;//json배열리스트

           if(this.dong_list.length==0)
           {
             this.aprt_list_isEnabled = false;
             this.dong_list_isEnabled = true;
             this.ho_list_isEnabled= true;  
             this.msgbox('선택할 수 있는 동이 없습니다.');
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


//아파트 호리스트 요청
GetAptHoList_Request(seqsite,seqdong)
{
    
    this.host.GetAptHoList(seqsite,seqdong).subscribe(
      datadata => 
      {
        for(let data of datadata.ho_list) //현재 갯수만큼 찾아온다
        {
         //alert(data.seq_site);
        }
        this.ho_list = datadata.ho_list;//json배열리스트

        if(this.ho_list.length==0)
        {
          this.aprt_list_isEnabled = false;
          this.dong_list_isEnabled = false;
          this.ho_list_isEnabled= true;  
          this.msgbox('선택할 수 있는 호수가 없습니다.');
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
 
 
 //동의서 작성한 세대 대표 회원 가입 정보 확인
 GetMemberCandidateInfo_Request(SeqHo,Name,Phone)
 {
  this.host.GetMemberCandidateInfo(SeqHo,Name,Phone).subscribe(
    data => 
    {
      this.is_candidate = data.is_candidate;//작동되지 않음..체크바람. 1이면 세대주, 0이면세대원
      this.ho_state = data.ho_state;


      if(this.is_candidate==1)//세대주가 들어온경우
      {
          /*
          ho_state는 해당 아파트 세대의 등록 상태를 의미합니다. 매뉴얼에 있는것과 같이 ho_state=1 은 해당호는 세대대표 미등록 상태를 의미합니다. 세대 대표를 등록하면 ho_state는 2로 바뀌게 됩니다.
          */
          if(this.ho_state==1)//(1=동의서에 명시된 세대 대표이며 아직 미등록 상태 vacant
          {
            //this.msgbox('세대 대표이며 아직 미등록 상태입니다.');
            this.onSMSConfirm();
          }//
          if(this.ho_state==2)//2=동일인이 동일호수에 이미 등록됨=subscribed
          {
            this.msgbox('동일인이 동일호수에 이미 등록되어 있습니다. 로그인해주세요.');
            return;
          }//
          if(this.ho_state==3)//3=다른분이 세대 대표로 이미 등록되어 있슴=occupied
          {
            this.msgbox('다른분이 세대 대표로 등록되어있습니다. 가입정보를 확인해주세요.');        
            return;
          }//            
        }
        if(this.is_candidate==0)//세대원이 들어온경우
        {
          /*
          if(this.ho_state==1)//(1=동의서에 명시된 세대 대표이며 아직 미등록 상태 vacant
          {
            this.msgbox('세대 대표가 현재 가입하지 않았습니다. 세대 대표가 가입된 상태에서 진행해주세요.');
            return;
          }//
          if(this.ho_state==2)//2=동일인이 동일호수에 이미 등록됨=subscribed
          {
            //세대 대표가 가입이 되었으므로 가입을 시키면됩니다.
            this.onSMSConfirm();
            return;
          }//
          if(this.ho_state==3)//3=다른분이 세대 대표로 이미 등록되어 있슴=occupied
          {
            this.msgbox('세대 대표가 이미 등록되어 있습니다. 가입정보를 확인해주세요.');        
            return;
          }//           
          */
          this.onSMSConfirm();
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


 //세대주가입
 CreateMemberMain_Request(SeqHo, Name, Phone, MemberId, Password )
 {
  this.host.CreateMemberMain(SeqHo, Name, Phone, MemberId, Password).subscribe(
    data => 
    {
      /*
      seq_member 생성된 id (실패인 경우 0)
      result_code (0=성공, 1=아이디 중복으로 생성 실패)
      "seq_member": 0,
      "result_code": 1
      */
      this.user_create_seq_member = data.seq_member; //생성된 id (실패인 경우 0)
      this.user_create_result_code = data.result_code;//result_code (0=성공, 1=아이디 중복으로 생성 실패)

      if(this.user_create_result_code==1)//아이디중복 생성실패
      {
        this.msgbox('이미 가입된 아이디 입니다. 다른 아이디로 사용해주세요.');
        return;
      }
      else if(this.user_create_seq_member==0)//실패
      {
        this.msgbox('아이디 생성에 실패하였습니다.');
        return;
      }      
      else if(this.user_create_result_code==0)//성공
      {
        this.step=3;//마지막단계        
      }    
      else
      {
        this.msgbox('알 수 없는 오류 입니다. 아이디 생성을 할 수 없습니다.');
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

//테스트를 위해서 광교 휴먼시아 20 단지 2001동 101호에 세대대표로 김대영, 01056963467을 동의서 작성한 것으로 입력했으니 회원 가입등을 테스트할 때 이용하시면 됩니다.

 //세대원가입
 CreateMemberSub_Request(SeqHo, Name, Phone, MemberId, Password )
 {
  this.host.CreateMemberSub(SeqHo, Name, Phone, MemberId, Password).subscribe(
    data => 
    {
      /*
      seq_member 생성된 id (실패인 경우 0, 세대 대표자 미등록 상태=-1)
      result_code (0=성공, 1=아이디 중복으로 생성 실패, 2=세대 대표자 미등록 상태)
      */
      this.user_create_seq_member = data.seq_member; //생성된 id (실패인 경우 0, 세대 대표자 미등록 상태=-1)
      this.user_create_result_code = data.result_code;//result_code (0=성공, 1=아이디 중복으로 생성 실패, 2=세대 대표자 미등록 상태)     

      if(this.user_create_seq_member==0)//실패
      {
        this.msgbox('아이디 생성에 실패하였습니다.');
        return;
      }
      else if(this.user_create_result_code==1)//아이디중복 생성실패
      {
        this.msgbox('이미 가입된 아이디 입니다. 다른 아이디로 사용해주세요.');
        return;
      }
      else if(this.user_create_result_code==2)//세대대표 미등록상태
      {
        this.msgbox('세대 대표가 등록되지 않은 상태에서는 가입할 수 없습니다.');
        return;
      }
      else if(this.user_create_result_code==0)//성공
      {
        this.step=3;//마지막단계        
        this.RequestAckMember_request();//승인요청보내기
      }    
      else
      {
        this.msgbox('알 수 없는 오류 입니다. 아이디 생성을 할 수 없습니다.');
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


//아파트선택시
    Apart_Selected(event)
    {


//      let term = this.dong_list.filter(person => person.name ==this.apart_name );
      //alert('id is '+this.apart_name);
      //alert('value is '+term[0].value);

      //alert(event);
   //   this.apart_name_str=event ;//아파트 실제명

      var str:string = event;//"2000|3000";

      var tok = str.split('|');

 //     alert(tok[0]);
      //alert(tok[1]);

//      this.apart_name = str[0];
      this.apart_name_str = tok[1];
      
//      alert(this.apart_name);
      //alert(this.apart_name_str);
      this.GetAptDongList_Request(tok[0]);
      this.apart_dong="";      
      this.apart_ho="";

      this.aprt_list_isEnabled = false;
      this.dong_list_isEnabled = false;
      this.ho_list_isEnabled= true;      
    }

//동선택시
    Dong_Selected(event)
    {

    //  this.apart_dong_str=event;//실제동숫자
      
      var str = event;

      var tok =str.split('|');

   //   this.apart_dong = str[0];
      this.apart_dong_str = tok[1];      

      var str2 = this.apart_name;
      var tok2 = str2.split('|');      

      //아파트,동호,코드로,
      this.GetAptHoList_Request(tok2[0],tok[0]);
      this.apart_ho="";   
      
      this.aprt_list_isEnabled = false;
      this.dong_list_isEnabled = false;
      this.ho_list_isEnabled= false;   
    }
    
//호선택시    
    Ho_Selected(event)
    {
      var str = event;
      var tok = str.split('|');
    //  this.apart_ho = str[0];
      this.apart_ho_str=tok[1];//event;//실제호숫자      
  //alert(this.apart_ho);
    }    



  //계정생성
  create_id()
  {
    if(this.agree1==false || this.agree2==false || this.agree3==false )
    {
      this.msgbox("약관에 동의해주세요.");
      return false;
    }    

    if(this.newid=="")
    {
      this.msgbox("아이디를 입력해주세요.");
      return false;
    }

    if(this.newpassword=="")
    {
      this.msgbox("비밀번호를 입력해주세요.");
      return false;
    }
    if(this.repassword=="")
    {
      this.msgbox("비밀번호 확인을 입력해주세요.");
      return false;
    }
    if(this.newpassword!=this.repassword)
    {
      this.msgbox("입력한 비밀번호 확인이 서로 일치하지 않습니다. 정확히 입력해주세요.");
      return false;      
    }

    var str = this.apart_ho;
    var tok = str.split('|');

    //this.navCtrl.pop();
     if(this.is_candidate==1)//세대주가입
     {
        this.CreateMemberMain_Request(tok[0], this.username, this.hp, this.newid, this.newpassword );
     }
     else//새대원가입
     {
      this.CreateMemberSub_Request(tok[0], this.username, this.hp, this.newid, this.newpassword );
     }
  }
  
  //승인요청
  RequestAckMember_request()
  {
    this.host.RequestAckMember(this.user_create_seq_member).subscribe(
      data => 
      {
        if(data.result_code ==0)
        {
          this.msgbox('승인 요청을 보낼 수 없습니다.');          
        }
        else if(data.result_code ==1)
        {
        }        
        else if(data.result_code ==-1)
        {
          this.msgbox('세대주에게 승인 요청을 보낼 수 없습니다.');                    
        }    
        else
        {
          this.msgbox('다시 접속해주세요. 승인 요청을 보낼 수 없습니다.');          
        }            
        /*
        "ack_request_today_count": 2,
        "result_code": 1,
        "seq_alarm_inserted": 1772
        */
        //result_code (0=member 찾기 실패, 1=성공, -1=푸시 보내기 실패)
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

    /*
      this.disabledButtonId = '0';    
  
      if(this.hpnum=="1004")//1004입력하면 무조건패스
      {
        this.sms_cert_flag = true;
      }
      else
      {
        if(this.sms_cert_key!=this.hpnum)
        {
          this.msgbox('문자인증번호가 잘못되었습니다. 다시 입력해주세요.');
          return;
        }
        else
        {
          this.sms_cert_flag = true;
        }
      }
           
  
      if(this.sms_cert_flag==true)//휴대폰인증성공
      {
          clearInterval(this.interval);//정지
          this.currenttime = this.defaulttime;
          this.sms_msg="인증완료";    
          this.sms_cert_flag = true;
  
          this.step=2;
          //this.msgbox('휴대폰인증이 정상적으로 완료되었습니다.');
          
          this.disabledButtonId = '1';//이 값이 1이 되면 버튼이 disabled 된다 ^^
      } */
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
        this.sms_msg="본인인증재요청";
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
          message: '휴대폰번호로 6자리 인증번호가 전송됩니다.\r\n인증번호를 입력하신후에 계속하기를 눌러주세요.\r\n진행하시겠습니까?',
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

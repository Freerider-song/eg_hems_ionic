import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
//import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { FCM } from '@ionic-native/fcm';
import moment from 'moment';
/*
  Generated class for the Datamembers provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServerComm {

    Version:any = "1.0";
    islogin:boolean  = false;
    userid:string ='';
    password:string='';
    deviceid:any = '';
    platform:any;
    seq_member:any;
    seq_site:any;
    is_main_member:any;
    logintype:any;

    is_ev_pv_ess:any;

    serverurl = "https://www.egservice.co.kr:4187";

  constructor(public device: Device, public http: Http,public plt: Platform,public storage: Storage, public fcm: FCM) 
  {
    console.log('Hello Datamembers Provider');
  }


    //디바이스아이디push
    SetRegistrationId(deviceid)
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.storage.ready().then(() => 
            {     
                this.storage.set('deviceid',deviceid);
            //  alert("set"+deviceid);
                resolve(); 
            });
        });     
    }

    //내 디바이스 아이디 얻기
    GetRegistrationId()
    {
        return new Promise((resolve, reject) => 
        {
            this.fcm.getToken().then(token => 
            {      
              
                  resolve(token);
            },(e)=>
            { 
                //resolve(Default);
                console.log('getting err',e); 
                alert('unable to get local from native storage') 
            
            });
        });    
    
    }

    //내디바이스 아이디 얻기(browser)
    GetRegistrationIdBrowser()
    {
        return new Promise((resolve, reject) => 
        {
            this.storage.ready().then(() => 
            {      
                //저장소 작업준비가되어있다면..진행
                this.storage.get('deviceid').then((d) => 
                {
                    resolve(d);
                },(e)=>
                { 
                //resolve(Default);
                console.log('getting err',e); 
                alert('unable to get local from native storage') 
                });
            });
        });     
    }  

    //문자인증보내기
    SMSRequest(hp)
    {
        var url = this.serverurl+'/page/sms_cert.php?hp='+hp+'&key=check567890check56991';
        var response = this.http.get(url).map(res => res.json());
        return response;  

    //  var cert;
    //  return cert;
    }        
    
      //faq list
      FaqListRequest(start,end)
      {
          var url = this.serverurl+'/page/faq_list.php?start='+start+'&end='+end;
      
          var response = this.http.get(url).map(res => res.json());
          return response;
      }    

    //유저아이디, 비밀번호, 유저고유코드, 아파트고유코드, 세대주인가?, 디바이스푸시키, 로그인타입
    setUser(userid, password, seq_member, seq_site, is_main_member, deviceid, is_ev_pv_ess)//,logintype)
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.storage.ready().then(() => 
            {       
                var platformtype:any;
                if(this.plt.is('android'))
                {
                    platformtype = 1;
                }
                if(this.plt.is('ios'))
                {
                    platformtype = 2;
                }                  
                this.storage.set('userinfo',
                {
                    userid: userid, 
                    password: password, 
                    seq_member:seq_member,
                    seq_site:seq_site,
                    is_main_member:is_main_member,
                    deviceid:deviceid,
                    is_ev_pv_ess:is_ev_pv_ess
               //     logintype:logintype
                });
                resolve(); 
            });
        });             
    }

//유저아이디, 비밀번호, 유저고유코드, 아파트고유코드, 세대주인가?, 디바이스푸시키, 로그인타입, 마지막 로그인
    getUser()
    {
        return new Promise((resolve, reject) => 
        {
            this.storage.ready().then(() => 
            {      
                //저장소 작업준비가되어있다면..진행
                this.storage.get('userinfo').then((d) => 
                {
                    if(d==null)
                    {
                        this.storage.set('userinfo',
                        {
                                userid: '', 
                                password: '', 
                                seq_member:'', 
                                seq_site:'',
                                is_main_member:'',
                                deviceid:'',
                                is_ev_pv_ess:'',
                              
                            //     logintype:''
                        });
                    }
                    else
                        {
                        
                        var myjson:any = d;//JSON.parse(JSON.stringify(d));
                        this.userid = myjson.userid;
                        this.password = myjson.password;
                        this.seq_member = myjson.seq_member;
                        this.seq_site = myjson.seq_site; 
                        this.is_main_member = myjson.is_main_member;
                        this.deviceid = myjson.deviceid;
                        this.is_ev_pv_ess = myjson.is_ev_pv_ess
                    //      this.logintype = myjson.logintype;
                        }
                        //var myjson:any = JSON.parse(JSON.stringify(d));
                    resolve(d);
                },(e)=>
                { 
                //resolve(Default);
                console.log('getting err',e); 
                alert('unable to get local from native storage');
                });
            });
        }); 
    }    

    //아파트단지목록
    GetSiteList()
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = '';
        var response = this.http.post(this.serverurl+'/hems/GetSiteList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;
    }

    //동리스트를 요청한다.
    GetAptDongList(SeqSite)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqSite='+SeqSite;
        var response = this.http.post(this.serverurl+'/hems/GetAptDongList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;
    }

    //아파트 호요청
    GetAptHoList(SeqSite,SeqDong)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqSite='+SeqSite+'&SeqDong='+SeqDong;
        var response = this.http.post(this.serverurl+'/hems/GetAptHoList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;
    }

    //세대대표가입정보확인
    GetMemberCandidateInfo(SeqHo,Name,Phone)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Name='+Name+'&Phone='+Phone;
        var response = this.http.post(this.serverurl+'/hems/GetMemberCandidateInfo', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
    }

    //세대 대표를 생성함
    CreateMemberMain(SeqHo, Name, Phone, MemberId, Password )
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Name='+Name+'&Phone='+Phone+'&MemberId='+MemberId+'&Password='+Password;
        var response = this.http.post(this.serverurl+'/hems/CreateMemberMain', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;       
        /*
        seq_member 생성된 id (실패인 경우 0)
        result_code (0=성공, 1=아이디 중복으로 생성 실패)
        */
    }

    //세대원 생성함
    CreateMemberSub(SeqHo, Name, Phone, MemberId, Password )
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Name='+Name+'&Phone='+Phone+'&MemberId='+MemberId+'&Password='+Password;
        //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
        var response = this.http.post(this.serverurl+'/hems/CreateMemberSub', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;    
        /*
        seq_member 생성된 id (실패인 경우 0, 세대 대표자 미등록 상태=-1)
        result_code (0=성공, 1=아이디 중복으로 생성 실패, 2=세대 대표자 미등록 상태)
        */
    }

    //로그인요청
    CheckLogin(MemberId, Password, DeviceId)
    {
        var platformtype:any;
        var version:any;
        if(this.plt.is('android'))
        {
            platformtype = "Android";
        }
        if(this.plt.is('ios'))
        {
            platformtype = "ios";
        } 
        var date = new Date();
        var now = moment(date).format("YYMMDD").toString() + "1";// date 객체를 YYYY년도로 받기
          
                                  
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'MemberId='+MemberId+'&Password='+Password+'&DeviceId='+DeviceId+'&Os='+platformtype+'&Version='+now;//MemberId='+MemberId+'&Password='+Password+'&DeviceId='+DeviceId+'&Os='+platformtype+'&Version='+this.Version;
        //alert(this.serverurl+'/hems/CheckLogin');
        //alert("params is " + params);
        var response = this.http.post(this.serverurl+'/hems/CheckLogin', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;    
        
                    //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
    }

    //승인요청하기
    /*
    푸시 보내기, 알림 생성, ack_member 테이블에 record 추가 등이 내부적으로 수행됨
    SeqMemberAckRequester (세대원으로 승인요청하는 회원의 seq 번호)
    result_code (0=member 찾기 실패, 1=성공, -1=푸시 보내기 실패)
    ack_request_today_count : 오늘의 승인요청 회수
    DB result : seq_member_main, reg_id_main, name_sub, phone_sub
    */
    RequestAckMember(seq_member)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMemberAckRequester='+seq_member;
        //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
        var response = this.http.post(this.serverurl+'/hems/RequestAckMember', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;
    }

    //가입승인응답
    //result_code (0=member 찾기 실패, 1=성공, -1=푸시 보내기 실패)
    //DB result : seq_member_main, reg_id_sub, name_main, name_sub
    ResponseAckMember(SeqMemberSub,Ack)//, Ack (1=accept, 2=reject, 3=cancel)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMemberSub='+SeqMemberSub+'&Ack='+Ack;
        //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
        var response = this.http.post(this.serverurl+'/hems/ResponseAckMember', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;
    }


    //회원정보얻기
    GetMemberInfo(seq_member)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+seq_member;
        //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
        var response = this.http.post(this.serverurl+'/hems/GetMemberInfo', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
    }

    //회원탈퇴하기
    Unsubscribemember(seq_member)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+seq_member;
        //MemberId=shpark&Password=1234&DeviceId&Os=android&Version=1910231
        var response = this.http.post(this.serverurl+'/hems/UnsubscribeMember', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;               
    }

      //faq list
      GetFaqList(SetSite)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqSite='+SetSite;
        var response = this.http.post(this.serverurl+'/hems/GetFaqList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;   
      } 

      GetMemberIdSeq(Name, Phone)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'Name='+Name+'&Phone='+Phone;
        var response = this.http.post(this.serverurl+'/hems/GetMemberIdSeq', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;             
      }
      
      //비밀번호변경 ( 성공하면 seq, 실패시 0 )
      GetPassword(SeqMember, PasswordNew)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&PasswordNew='+PasswordNew;
        var response = this.http.post(this.serverurl+'/hems/ChangePassword', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;             
      }

      //비밀번호 변경(New)
      ChangePasswordByMemberId(MemberId, PasswordNew)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'MemberId='+MemberId+'&PasswordNew='+PasswordNew;
        var response = this.http.post(this.serverurl+'/hems/ChangePasswordByMemberId', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;

      }

      //알림요청
      //https://www.egservice.co.kr:4187/hems/GetAlarmList?SeqMember=1&CountMax=20
      GetAlarmList(SeqMember,CountMax)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&CountMax='+CountMax;
        var response = this.http.post(this.serverurl+'/hems/GetAlarmList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;           
      }

      //알림읽음처리
      SetAlarmListAsRead(SeqMember,SeqAlarmList)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&SeqAlarmList='+SeqAlarmList;
        var response = this.http.post(this.serverurl+'/hems/SetAlarmListAsRead', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }

      //Q/A 리스트
      GetQnaList(SeqMember)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember;
        var response = this.http.post(this.serverurl+'/hems/GetQnaList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }      

      //Q/A 읽음처리
      SetQnaListAsRead(SeqMember,SeqQnaList)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&SeqQnaList='+SeqQnaList;
        var response = this.http.post(this.serverurl+'/hems/SetQnaListAsRead', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }   
      
      //Q/A 질문올리기
      CreateQuestion(SeqMember,Question)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&Question='+decodeURIComponent(Question);
        var response = this.http.post(this.serverurl+'/hems/CreateQuestion', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }        

      //공지사항리스트
      //https://www.egservice.co.kr:4187/hems/GetNoticeList?SeqMember=1&TimeCreatedMax=20191013162045&
      GetNoticeList(SeqMember,TimeCreatedMax,CountNotice)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&TimeCreatedMax='+TimeCreatedMax+'&CountNotice='+CountNotice;
        var response = this.http.post(this.serverurl+'/hems/GetNoticeList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }       
      
      //공지사항읽기처리
      SetNoticeListAsRead(SeqMember,SeqNoticeList)
      {//https://www.egservice.co.kr:4187/hems/SetNoticeListAsRead?SeqMember=1&SeqNoticeList=14,16
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember+'&SeqNoticeList='+SeqNoticeList;
        var response = this.http.post(this.serverurl+'/hems/SetNoticeListAsRead', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }    
      
      //패밀리 리스트
      GetFamilyList(SeqMember)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqMember='+SeqMember;
        var response = this.http.post(this.serverurl+'/hems/GetFamilyList', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }

      //휴대폰인증을 요청한다.
      RequestAuthCode(hp)
      {
          //result_code : 0/1
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'Phone='+hp;
        var response = this.http.post(this.serverurl+'/hems/RequestAuthCode', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }

      //휴대폰인증을 요청한다.
      CheckAuthCode(Phone,AuthCode,SecTimeLimit)
      {
          //result_code : -2=인증코드 요청한적이 없는 전화번호, 0=인증코드 불일치, 1=인증 OK, 2=타임아웃
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'Phone='+Phone+'&AuthCode='+AuthCode+'&SecTimeLimit='+SecTimeLimit;
        var response = this.http.post(this.serverurl+'/hems/CheckAuthCode', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;            
      }     
      
      /*
      지정한 기간의 사용량과 사용요금, 이달 말까지의 예상 사용량과 예상 사용요금을 조회함
         SeqHo, From (20191201 형식), To (201912251635 형식, 즉 분단위까지,)
        
        from : 시작날짜
        to : 조회 최종 시각 (분단위까지)
        usage_curr : 사용량
        won_curr : 사용요금
        usage_expected : 이번달 예상 사용량
        won_expectied : 이번달 예상 사용요금

      */
      GetCurrentUsageAll(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageAll', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }

      GetCurrentUsageElec(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageElec', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }

      GetCurrentUsageWater(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageWater', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }      

      GetCurrentUsageGas(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageGas', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }       

      GetCurrentUsageHeat(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageHeat', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }        

      GetCurrentUsageSteam(SeqHo,From,To)
      {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&From='+From+'&To='+To;
        var response = this.http.post(this.serverurl+'/hems/GetCurrentUsageSteam', params , {headers: headers2}).map(res=>res.json());
        //var response = this.http.get(url).map(res => res.json());
        return response;     
      }      
      
      /*
      GetUsageListDailyElec] / Water / Gas / Heat / Steam
      지정한 날의 시간별 사용량과 사용요금, 전년 동일의 시간별 사용량과 사용요금, 그리고 각 항목의 합계를 조회함.
       SeqHo, Year, Month, Day
      
      [list_usage]
      unit : 시간 (0 ~ 23)
      usage_curr : 사용량
      won_curr : 사용요금
      usage_prev : 전년 동일 사용량
      won_prev : 전년 동일 사용요금
      total_usage_curr : 사용량 합계
      total_won_curr : 사용요금 합계
      total_usage_prev : 전년 동일 사용량 합계
      total_won_prev : 전년 동일 사용요금 합계
      */
     GetUsageListDailyElec(SeqHo,Year,Month,Day)
     {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListDailyElec', params , {headers: headers2}).map(res=>res.json());
       return response;     
     }      

     GetUsageListDailyWater(SeqHo,Year,Month,Day)
     {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListDailyWater', params , {headers: headers2}).map(res=>res.json());
       return response;     
     }      
     
     GetUsageListDailyGas(SeqHo,Year,Month,Day)
     {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListDailyGas', params , {headers: headers2}).map(res=>res.json());
       return response;     
     }      
     
     GetUsageListDailyHeat(SeqHo,Year,Month,Day)
     {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListDailyHeat', params , {headers: headers2}).map(res=>res.json());
       return response;     
     }      
     
     GetUsageListDailySteam(SeqHo,Year,Month,Day)
     {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListDailySteam', params , {headers: headers2}).map(res=>res.json());
       return response;     
     }     
     
     /*
     [GetUsageListWeeklyElec] / Water / Gas / Heat / Steam
    지정한 달의 요일별 사용량과 사용요금, 전년 동월의 요일별 사용량과 사용요금, 그리고 각 항목의 합계를 조회함.
     SeqHo, Year, Month
    
    [list_usage]
    unit : 요일 (1 ~ 7, 1=일요일, 2=월요일….7=토요일)
    usage_curr : 사용량
    won_curr : 사용요금
    usage_prev : 전년 동월 사용량
    won_prev : 전년 동월 사용요금
    total_usage_curr : 사용량 합계
    total_won_curr : 사용요금 합계
    total_usage_prev : 전년 동월 사용량 합계
    total_won_prev : 전년 동월 사용요금 합계
    */
    GetUsageListWeeklyElec(SeqHo,Year,Month)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListWeeklyElec', params , {headers: headers2}).map(res=>res.json());
        return response;     
    } 
    GetUsageListWeeklyWater(SeqHo,Year,Month)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListWeeklyWater', params , {headers: headers2}).map(res=>res.json());
        return response;     
    } 
    GetUsageListWeeklyGas(SeqHo,Year,Month)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListWeeklyGas', params , {headers: headers2}).map(res=>res.json());
        return response;     
    } 
    GetUsageListWeeklyHeat(SeqHo,Year,Month)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListWeeklyHeat', params , {headers: headers2}).map(res=>res.json());
        return response;     
    } 
    GetUsageListWeeklySteam(SeqHo,Year,Month)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListWeeklySteam', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }   
    
    /*
    [GetUsageListMonthlyElec] / Water / Gas / Heat / Steam
    지정한 달의 일별 사용량과 사용요금, 전년 동월의 일별 사용량과 사용요금, 그리고 각 항목의 합계를 조회함.
     SeqHo, Year, Month
    
    [list_usage]
    unit : 일 (1일 ~ 28, 29, 30, 31 : 말일)
    usage_curr : 사용량
    won_curr : 사용요금
    usage_prev : 전년 동월 동일 사용량
    won_prev : 전년 동월 동일 사용요금
    total_usage_curr : 사용량 합계
    total_won_curr : 사용요금 합계
    total_usage_prev : 전년 동월 사용량 합계
    total_won_prev : 전년 동월 사용요금 합계
    */
   GetUsageListMonthlyElec(SeqHo,Year,Month)
   {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListMonthlyElec', params , {headers: headers2}).map(res=>res.json());
       return response;     
   }   
      
   GetUsageListMonthlyWater(SeqHo,Year,Month)
   {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListMonthlyWater', params , {headers: headers2}).map(res=>res.json());
       return response;     
   }   
   GetUsageListMonthlyGas(SeqHo,Year,Month)
   {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListMonthlyGas', params , {headers: headers2}).map(res=>res.json());
       return response;     
   }   
   GetUsageListMonthlyHeat(SeqHo,Year,Month)
   {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListMonthlyHeat', params , {headers: headers2}).map(res=>res.json());
       return response;     
   }   
   GetUsageListMonthlySteam(SeqHo,Year,Month)
   {
       var headers2 = new Headers();
       headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
       var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month;
       var response = this.http.post(this.serverurl+'/hems/GetUsageListMonthlySteam', params , {headers: headers2}).map(res=>res.json());
       return response;     
   }    
   
   /*
    [GetUsageListYearlyElec] / Water / Gas / Heat / Steam
    지정한 년도의 월별 사용량과 사용요금, 전년도의 월별 사용량과 사용요금, 그리고 각 항목의 합계를 조회함.
     SeqHo, Year
    
    [list_usage]
    unit : 월 (1 ~ 12)
    usage_curr : 사용량
    won_curr : 사용요금
    usage_prev : 전년 동월 사용량
    won_prev : 전년 동월 사용요금
    total_usage_curr : 사용량 합계
    total_won_curr : 사용요금 합계
    total_usage_prev : 전년 사용량 합계
    total_won_prev : 전년 사용요금 합계
   */
    GetUsageListYearlyElec(SeqHo,Year)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListYearlyElec', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }      
    GetUsageListYearlyWater(SeqHo,Year)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListYearlyWater', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }      
    GetUsageListYearlyGas(SeqHo,Year)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListYearlyGas', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }      
    GetUsageListYearlyHeat(SeqHo,Year)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListYearlyHeat', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }      
    GetUsageListYearlySteam(SeqHo,Year)
    {
        var headers2 = new Headers();
        headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        var params = 'SeqHo='+SeqHo+'&Year='+Year;
        var response = this.http.post(this.serverurl+'/hems/GetUsageListYearlySteam', params , {headers: headers2}).map(res=>res.json());
        return response;     
    }    
    
    
    //알림,공지,고객센터 카운트 가져오기

    GetUnreadAlarmCount(SeqMember)
    {
      var headers2 = new Headers();
      headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      var params = 'SeqMember='+SeqMember;
      var response = this.http.post(this.serverurl+'/hems/GetUnreadAlarmCount', params , {headers: headers2}).map(res=>res.json());
      //var response = this.http.get(url).map(res => res.json());
      return response;      
    }    
    
    GetUnreadNoticeCount(SeqMember)
    {
      var headers2 = new Headers();
      headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      var params = 'SeqMember='+SeqMember;
      var response = this.http.post(this.serverurl+'/hems/GetUnreadNoticeCount', params , {headers: headers2}).map(res=>res.json());
      //var response = this.http.get(url).map(res => res.json());
      return response; 
    }    

    GetUnreadAnswerCount(SeqMember)
    {
      var headers2 = new Headers();
      headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      var params = 'SeqMember='+SeqMember;
      var response = this.http.post(this.serverurl+'/hems/GetUnreadAnswerCount', params , {headers: headers2}).map(res=>res.json());
      //var response = this.http.get(url).map(res => res.json());
      return response; 
    }


    //enernet 이승호 작업

    GetPvEssState(SeqHo, Year, Month, Day)
    {
      var headers2 = new Headers();
      headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      var params = 'SeqHo='+SeqHo+'&Year='+Year+'&Month='+Month+'&Day='+Day;
      var response = this.http.post(this.serverurl+'/hems/GetPvEssState', params , {headers: headers2}).map(res=>res.json());

      return response;
    }

    GetEvChargeList(SeqHo)
    {
      var headers2 = new Headers();
      headers2.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      var params = 'SeqHo='+SeqHo;
      var response = this.http.post(this.serverurl+'/hems/GetEvChargeList', params , {headers: headers2}).map(res=>res.json());

      return response;
    }
}


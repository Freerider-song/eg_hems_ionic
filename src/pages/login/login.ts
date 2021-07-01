//import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { ForgotPassword } from '../forgot-password/forgot-password';
//import { Register } from '../register/register';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServerComm } from '../../providers/server_comm';
import { ServiceAlert } from '../../providers/service_message';
import { MenuController } from 'ionic-angular';

import { Chart } from 'chart.js';
import { NotifySetPage } from '../notify-set/notify-set';
import { PriceSetPage } from '../price-set/price-set';
import { CustomerCenterPage } from '../customer-center/customer-center';
import { SettingPage } from '../setting/setting';
import { PwchangePage } from '../pwchange/pwchange';
import { RegisterPage } from '../register/register';
import { ForgotPassword } from '../forgot-password/forgot-password';
import { Sim } from '@ionic-native/sim';
import { WaitingPage } from '../waiting/waiting';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  @ViewChild('barCanvas') barChart;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;  

  @ViewChild('horizontalcanvas') horizontalbar;  
  

  public loginstate = 0;
  userid:any;
  password:any;

  constructor( private menuCtrl: MenuController,    private sim: Sim,
     public msg:ServiceAlert, public host:ServerComm,public storage: Storage,private events: Events,public navCtrl: NavController, public navParams: NavParams) 
     {


      this.sim.hasReadPermission().then(
        (info) => console.log('Has permission: '+info)
      );
  
      this.sim.requestReadPermission().then(
        () => console.log('Permission granted'),
        () => console.log('Permission denied')
      );    


      //회원가입후 최초 자동 로그인
      events.subscribe('reg_autologin', ( data ) => 
      {
        this.userid = data['userid'];
        this.password = data['password'];
        this.gotoLogin();
      });      

      this.autoLoginCheck();//일반적인 기본형태의 자동로그인

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    //this.yourCustomFunctionName();
    //this.doughnutChartMethod();
    //this.lineChartMethod();
    //this.createHrzBarChart();
  }

  /*
ionViewDidLoad
ionViewWillEnter
ionViewDidEnter
ionViewWillLeave
ionViewDidLeave
ionViewWillUnload
ionViewCanEnter
ionViewCanLeave
*/

  findpw()
  {
    this.navCtrl.push(ForgotPassword);
  }

  sign()
  {
    this.navCtrl.push(RegisterPage);
  }


//자동로그인 체크
autoLoginCheck()
{
  this.storage.ready().then(() => 
  {      
        //저장소 작업준비가되어있다면..진행
        this.storage.get('islogin').then((islogin) => 
        {
              if(islogin==false || islogin==null)//로그인이 아닌상태이면..
              {
                setTimeout(() => //로그인화면표시
                {
                  //this.navCtrl.setRoot(HomePage);
                  this.loginstate = 1;
                }, 1000);                                    
              }
              else//로그인이 된상태이면
              {

                
                setTimeout(() => //로그인화면표시
                {
                  //this.loginstate = 2;    
                  this.loginstate = 1;                                          
                  //this.events.publish('auto_login');//register는 하지 않고 push 받는 곳 이벤트만 받는다.                                              
                  //this.navCtrl.setRoot(HomePage);
                }, 500); 

                this.host.getUser().then((data)=>
                { 
                     if(data==null)
                      {
                      }
                      else //로그인정보 넣어준다.
                      {
            
                        this.storage.ready().then(() => 
                        {     
                              //저장소 작업준비가되어있다면..진행
                              this.storage.get('islogin').then((islogin) => 
                              {                     
                                  var myjson:any = JSON.parse(JSON.stringify(data));
                                  this.userid = myjson.userid;
                                  this.password = myjson.password;
                             
                              });                                                                   
                         });  
            
                      }
                },(e)=>
                { //reject함수가 실행된경우
                  console.log('getting err',e); 
                  alert('unable to get local from native storage'); 
                }) 
                

                /*
                  this.host.getUser().then((data2)=>
                  { 
                        if(data2==null)
                        {
                        }
                        else //로그인정보 넣어준다.
                        {                                
                            this.host.GetRegistrationId().then((deviceid)=>//push id
                            { 
                                    var myjson2:any = JSON.parse(JSON.stringify(data2));*/

                                    
                                    /*
                                    //로그인정보를 다시 학교,지역을 바꾼다.
                                    this.host.setUser(myjson2.userid, 
                                                      myjson2.password,
                                                      myjson2.name, 
                                                      myjson2.nickname, 
                                                      myjson2.schoolname,
                                                      myjson2.area, 
                                                      myjson2.studentid, 
                                                      myjson2.department, 
                                                      myjson2.isusing_nick, 
                                                      //uniqueid, 
                                                      deviceid).then(()=>
                                    {
                                          setTimeout(() => 
                                          {
                                            this.loginstate = 2;                                              
                                            this.events.publish('auto_login');//register는 하지 않고 push 받는 곳 이벤트만 받는다.                                              
                                            this.navCtrl.setRoot(TabsPage);
                                            
                                          }, 500);                                    
                                          
                                    },(e)=>
                                    { //reject함수가 실행된경우
                                      console.log('getting err',e); 
                                      alert('unable to get local from native storage'); 
                                    }) 
                                    */
/*
                              },(e)=>
                              { //reject함수가 실행된경우
                                console.log('getting err',e); 
                                alert('unable to get local from native storage'); 
                              }) 
                          }                          
                  },(e)=>
                  { //reject함수가 실행된경우
                    console.log('getting err',e); 
                    alert('unable to get local from native storage'); 
                  }) 
                  */
              }
        });
  });
}


//로그인버튼 클릭시 실행
  gotoLogin()
  {
      this.host.GetRegistrationId().then((deviceid)=>//push id
      {   
          this.host.CheckLogin(this.userid, this.password, deviceid).subscribe(
          data => 
          {

            if(data.is_id_password_ok==false)
            {
               this.msg.msgbox("가입된 회원아이디가 아니거나 비밀번호가 틀립니다. 비밀번호는 대소문자를 구분합니다.");//가입된 회원아이디가 아니거나 비밀번호가 틀립니다.\r\n비밀번호는 대소문자를 구분합니다.");
               return;
            }

            else
            {

              if(data.is_main_member==false)//만약에 세대원인경우에는 인증에 따라 로그인여부를 체크할수 있다
              {

                if(data.ack_response_code_latest ==-1)//승인요청을 하시기 바랍니다.
                {
                  this.navCtrl.setRoot(WaitingPage,{state:-1,user_create_seq_member:data.seq_member});
                }
                if(data.ack_response_code_latest == 0)//승인요청한상태
                {
                  this.navCtrl.setRoot(WaitingPage,{state:0,user_create_seq_member:data.seq_member});
                }
                if(data.ack_response_code_latest == 1)//승인된상태
                {

                  this.host.setUser(this.userid, 
                    this.password,
                    data.seq_member, 
                    data.seq_site,
                    data.is_main_member, 
                    deviceid,
                    data.is_ev_pv_ess,
                    data.is_dr).then(()=>
                  {
                    this.storage.set('islogin',true);    //로그인유무 true/false      
                    this.events.publish('first_login');   //push 등록..과 register를 동시에 한다.
                    this.navCtrl.setRoot(HomePage);  
                  },(e)=>
                  { 
                    console.log('getting err',e); 
                    this.msg.msgbox('스마트폰 장애입니다. 다시 로그인 해주세요.');
                  });                 
                }                                                
                if(data.ack_response_code_latest == 2 || data.ack_response_code_latest == 3)//승인거절, 철회된상태
                {
                  //거절되거나 철회될 경우 승인대기로 변경
                  this.navCtrl.setRoot(WaitingPage,{state:0,user_create_seq_member:data.seq_member});
                }                                                
              }
              else// 세대주는 바로 로그인시키자
              {

                this.host.setUser(this.userid, 
                  this.password,
                  data.seq_member, 
                  data.seq_site,
                  data.is_main_member, 
                  deviceid,
                  data.is_ev_pv_ess,
                  data.is_dr).then(()=>
                {
                  this.storage.set('islogin',true);    //로그인유무 true/false      
                  this.events.publish('first_login');   //push 등록..과 register를 동시에 한다.
                  this.navCtrl.setRoot(HomePage);  
                },(e)=>
                { 
                  console.log('getting err',e); 
                  this.msg.msgbox('스마트폰 장애입니다. 다시 로그인 해주세요.');
                });                 

              }
            }
            /*
           "is_id_password_ok": true,
            "is_new_version_available": false,
            "seq_site": 1,
            "seq_member": 1,
            "is_main_member": true,
            "seq_member_main": 1,
            "seq_member_sub": 0,
            "time_ack_request": "",
            "time_ack_response": "",
            "ack_request_today_count": 0,
            "ack_response_code_latest": -1
            */
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
             // this.host.GetUniqueId().then((uniqueid)=>//phone serial
             // { 
                    //  this.animator.setDuration(1000).setType('flipOutX').show(this.logoani.nativeElement).then(() => 
                    //  {
                      /*
                            this.host.LoginRequest( this.userid, this.password, deviceid).subscribe(
                            data => 
                            {
                              //data.status
                              if(data.status=="4")//로그인성공
                              {
                                  this.host.setUser(this.userid, 
                                                    this.password,
                                                    data.name, 
                                                    data.nickname, 
                                                    data.school_name,
                                                    data.area, 
                                                    data.studentid, 
                                                    data.department, 
                                                    data.using_nickname, 
                                                    //uniqueid, 
                                                    deviceid).then(()=>
                                  {
                                      this.host.SetPushState(true);
                                      this.navCtrl.setRoot(TabsPage);   
                                      this.storage.set('islogin',true);    //로그인유무 true/false      
                                      this.events.publish('first_login');   //push 등록..과 register를 동시에 한다.
                                  },(e)=>
                                  { 
                                    console.log('getting err',e); 
                                    alert('unable to get local from native storage'); 
                                  }); 
                              }
                              else
                              {
                                  if(data=="1")
                                  {
                                  //  회원아이디나 비밀번호가 공백이면 안됩니다.
                                      this.msg.msgbox("회원아이디나 비밀번호가 공백이면 안됩니다.");//회원아이디나 비밀번호가 공백이면 안됩니다.");
                                  }
                                  else if(data=="2")
                                  {
                                    //가입된 회원아이디가 아니거나 비밀번호가 틀립니다.\\n비밀번호는 대소문자를 구분합니다.
                                    this.msg.msgbox("가입된 회원아이디가 아니거나 비밀번호가 틀립니다. 비밀번호는 대소문자를 구분합니다.");//가입된 회원아이디가 아니거나 비밀번호가 틀립니다.\r\n비밀번호는 대소문자를 구분합니다.");
                                  }
                                  else if(data=="3")
                                  {
                                    //회원님의 아이디는 접근이 금지되어 있습니다
                                      this.msg.msgbox("회원님의 아이디는 접근이 금지되어 있습니다.");//회원님의 아이디는 접근이 금지되어 있습니다.");
                                  }              
                                  else if(data=="4")
                                  {
                                    //탈퇴한 아이디이므로 접근하실 수 없습니다
                                      this.msg.msgbox("탈퇴한 아이디이므로 접근하실 수 없습니다.");//탈퇴한 아이디이므로 접근하실 수 없습니다.");
                                  }             
                                  else if(data=="5")
                                  {
                                    //메일로 메일인증을 받으셔야 로그인 가능합니다.
                                    this.msg.msgbox("메일로 메일인증을 받으셔야 로그인 가능합니다.");//메일로 메일인증을 받으셔야 로그인 가능합니다.");
                                  }              
                                  else
                                  {
                                        //오류
                                    this.msg.msgbox("네트워크에 연결할 수 없습니다.");//네트워크에 연결할 수 없습니다.");
                                  }
                              }
                            },
                            err => 
                            {
                                    console.log(err);
                                    //this.loader.dismiss();
                                    this.msg.msgbox(err);
                            },
                            () => console.log('Complete')
                          );                     
                          */
                   //   });
                                         
      },(e)=>
      { //reject함수가 실행된경우
        console.log('getting err',e); 
        alert('unable to get local from native storage2'); 
      })                  
  }
    

  public yourCustomFunctionName() {
    this.barChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
        datasets: [{
          label: '# of Votes',
          data: [200, 50, 30, 15, 20, 34],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
}  

doughnutChartMethod() {
  this.doughnutCanvas = new Chart(this.doughnutCanvas.nativeElement, {
    type: 'doughnut',
    data: {
      labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
      datasets: [{
        label: '# of Votes',
        data: [50, 29, 15, 10, 7],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        hoverBackgroundColor: [
          '#FFCE56',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6384'
        ]
      }]
    }
  });
}

lineChartMethod() {
  this.lineCanvas = new Chart(this.lineCanvas.nativeElement, {
    type: 'line',
      data: {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [
        {
          label: '요일별 평균 사용량 (kWh)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255,0,0,0.4)',
          borderColor: 'rgba(255,0,0,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderWidth: 1, //선굵기
          borderDashOffset: 0.0,
          hoverBackgroundColor:'#f00',
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#333',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          //datasetFill : true,//Boolean - 차트에서 선만 노출 여부 설정
          //scaleShowGridLines : false,//Boolean - 차트 눈금 표시 여부 설정
          data: [65, 59, 80, 81, 56, 55, 40],
          spanGaps: false,
        }
      ]
    },
    options: {
      animation:{
        onComplete : function(){

          var chartInstance = this.chart,
          ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];                            
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                
            });
        });
           // alert('test');
        }
    },        
    tooltips: { enabled: false },
      /*
      tooltips: {
        enabled: true
      },*/
      /*
      scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
          ticks: {
            beginAtZero:true
          },
          stacked: true,
        }],
      },*/
      responsive: true,      
      
      scales: {
        xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              display: true
              //,//축의 값 표시 여부
                //max: 1,
                //min: 0
            }
          }],
        yAxes: [{
          gridLines: {
              drawBorder: false//축과 데이터의 경계선 표시 여부
            },
            ticks: {
              display: true
              //,//축의 값 표시 여부
                //max: 1,
                //min: 0
            }
          }]
      },
/*
      scales: {
        xAxes: [{
          categoryPercentage:1.0,
          barPercentage: 0.2,
          barThickness: 10,
          maxBarThickness: 10,
          minBarLength: 5,
          gridLines: {
              drawOnChartArea: true,
              offsetGridLines: true
          }
      }],
          yAxes: [{
            gridLines: {
              offsetGridLines: false
            },
              ticks: {
                  beginAtZero:true,
                  max:30
              }
          }]
      },*/

      legend: {
        display: false
      },
      
      
      showValue:{
        fontStyle: 'Helvetica', //Default Arial
        fontSize: 20
},

plugins: {
  datalabels: {
          align: 'start',
          anchor: 'start',
          color: '#f00',
          font: {
              weight: 'bold',
              size: 14,
          },
          formatter: function(value, context) {
              return value + '%1';
          },
  },
},/*Plugins ende*/     
      /*
      legends:{
        display:false
      },   */   
      layout: {
        
          padding: {
              left: 10,
              right: 0,
              top: 20,
              bottom: 0
          }
      }
   },
   plugins: {
    datalabels: {
            align: 'end',
            anchor: 'end',
            color: '#000',
            font: {
                weight: 'bold',
                size: 14,
            },
            formatter: function(value, context) {
                return value + '%';
            },
    },
},/*Plugins ende*/   
   /*
   plugins: {
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: Math.round,
      font: {
        weight: 'bold'
      }
    }
  }*/
  });
}

//https://touchsoul.tistory.com/86
createHrzBarChart() {
 
  this.horizontalbar = new Chart(this.horizontalbar.nativeElement, {
    type: 'horizontalBar',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월','9월', '10월', '11월', '12월'],
      datasets: [{
        label: 'Online viewers in millions',
        data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17,1.1, 2.3, 5, 1.9],
        backgroundColor: '#ddee44', // array should have same number of elements as number of dataset
        borderColor: '#ddee44',// array should have same number of elements as number of dataset
        borderWidth: 1
      },
      {
        label: 'Offline viewers in millions',
        data: [1.5, 2.8, 4, 4.9, 3.9, 4.5, 7, 12,1.1, 2.3, 5, 1.9],
        backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
        borderColor: '#dd1144',// array should have same number of elements as number of dataset
        borderWidth: 1
      },
      {
        label: 'Offline viewers in millions',
        data: [1.1, 2.3, 5, 1.9, 9, 6.5, 1, 15,1.1, 2.3, 5, 1.9],
        backgroundColor: '#2233444', // array should have same number of elements as number of dataset
        borderColor: '#334455',// array should have same number of elements as number of dataset
        borderWidth: 1
      }
    ]
    },

    options: {
      animation:{
        onComplete : function(){

          var chartInstance = this.chart,
          ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];                            
                ctx.fillText(data, bar._model.x+10, bar._model.y +8);
            });
        });
           // alert('test');
        }
    },    
      /*
      tooltips: {
        enabled: true
      },*/
      /*
      scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
          ticks: {
            beginAtZero:true
          },
          stacked: true,
        }],
      },*/
      legend: {
        display: false
      },
      tooltips: { enabled: false },
      responsive: true,      
      maintainAspectRatio: false,
      /*
      legends:{
        display:false
      },   */   
      scales: {
        xAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
              display: true
              /*,//축의 값 표시 여부
                max: 1,
                min: 0*/
            }
          }],
        yAxes: [{
          gridLines: {
            display:false//,
           //   drawBorder: false//축과 데이터의 경계선 표시 여부
            },
            ticks: {
              display: true
              /*,//축의 값 표시 여부
                max: 1,
                min: 0*/
            }
          }]
      },      
      plugins: {
        datalabels: {
                align: 'end',
                anchor: 'end',
                color: '#f00',
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: function(value, context) {
                    return value + '%1';
                },
        },
    },/*Plugins ende*/      
      layout: {
        
          padding: {
              left: 10,
              right: 0,
              top: 20,
              bottom: 0
          }
      }
  }
   });
}


}

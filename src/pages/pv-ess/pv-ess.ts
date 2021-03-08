import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, MenuController, Nav, Platform, Loading } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ServerComm } from "../../providers/server_comm";
import { ServiceAlert } from '../../providers/service_message';
import * as moment from 'moment';
import {sprintf} from "sprintf-js";
import { DailySearchPage } from '../daily-search/daily-search';

/**
 * Generated class for the PvEssPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pv-ess',
  templateUrl: 'pv-ess.html',
})
export class PvEssPage {

  @ViewChild('horizontalcanvas') horizontalbar;
  @ViewChild('horizontalcanvas2') horizontalbar2;
  @ViewChild('horizontalcanvas3') horizontalbar3;

  horizontalcanvas:any;
  horizontalcanvas2:any;
  horizontalcanvas3:any;

  public show_menu1:any=true;
  public show_menu2:any=false;
  public show_menu3:any=false;
  public selectedSegment:any;

  chartData :any;

  date: any;  
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;  

  member_id:string="";
  seq_member:any;
  seq_apt_ho:any;

  usage_generated: any="";
  usage_discharged: any="";
  usage_charged: any="";
  total_usage_generated: any="";
  total_usage_discharged: any="";
  total_usage_charged: any="";

  public usage_generated_list:any;
  public usage_discharged_list:any;
  public usage_charged_list:any;

  constructor(public host:ServerComm, public msg:ServiceAlert, public navCtrl: NavController, public navParams: NavParams, private events: Events)
  {
    this.date = new Date();
    this.monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();   

    //달력에서 선택된 이벤트가 날라온다.
    events.subscribe('calender_reload2', (data)=>
    {
    //달력의 날짜로 변경한다.
      var datedata:string = data.date;      
    /*
      var datearray = datedata.split("-");
      this.date.setDate(datearray[0]);
      this.date.setMonth(datearray[1]);      
      this.date.setDay(datearray[2]);      */
      
      this.date = moment(datedata).toDate();

      this.currentMonth = this.monthNames[this.date.getMonth()];
      this.currentYear = this.date.getFullYear();
      this.currentDate = sprintf("%02d",this.date.getDate());
      
      this.updateGraphData();
    });        

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PvEssPage');

    //일별 발전량을 기본으로 표시
    this.selectedSegment = "menu1"; 
    this.show_menu1 = true;
    this.show_menu2 = false;
    this.show_menu3 = false;
    
    this.loadLocalData();
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
 
             //회원정보얻기
             this.host.GetMemberInfo(myjson.seq_member).subscribe(
               data => 
               {
                 this.seq_apt_ho = data.member_info.seq_apt_ho;

                 this.updateGraphData();//서버에서 그래프데이터 받아옴
                 
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

  //현재탭에 있는 기준으로 데이터를 받아온다.
  updateGraphData()
  {

    if(this.selectedSegment=="menu1")
    {
      setTimeout( () => {
       // this.createHrzBarChart(); 
       this.GetPvEssStateRequest(0);
      }, 100);
    }

    if(this.selectedSegment=="menu2")
    {
      setTimeout( () => {
        //this.createHrzBarChart2();      
        this.GetPvEssStateRequest(1);
      }, 100);
    }

    if(this.selectedSegment=="menu3")
    {
      setTimeout( () => {
        //this.createHrzBarChart3();      
        this.GetPvEssStateRequest(2);
      }, 100);
    }
  }

  GetPvEssStateRequest(searchtype)
  {
    console.log('GetPvEssStateRequest Starts');

    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());


    this.host.GetPvEssState(this.seq_apt_ho, this.currentYear,this.currentMonth,this.currentDate).subscribe(
      graph => 
      { 
        this.usage_generated_list=[];
        this.usage_discharged_list=[];
        this.usage_charged_list=[];

        this.total_usage_generated = graph.total_usage_generated.toFixed(2);
        this.total_usage_discharged = graph.total_usage_discharged.toFixed(2);
        this.total_usage_charged = graph.total_usage_charged.toFixed(2);

        for(let data of graph.list_value) //현재 갯수만큼 추가..
        {               
          //서버에서 값받기
          this.usage_generated = data.usage_generated>=0 ? data.usage_generated.toFixed(2) : 0;
          this.usage_discharged = data.usage_discharged>=0 ? data.usage_discharged.toFixed(2) : 0;
          this.usage_charged = data.usage_charged>=0 ? data.usage_charged.toFixed(2) : 0;
          
          this.usage_generated_list.push(this.usage_generated);//발전량
          this.usage_discharged_list.push(this.usage_discharged);//방전량
          this.usage_charged_list.push(this.usage_charged);//충전량
        }
        //this.year_graph_list = graph.list_usage;
        if(searchtype==0) this.createHrzBarChart();//발전량
        if(searchtype==1) this.createHrzBarChart2();//방전량
        if(searchtype==2) this.createHrzBarChart3();//충전량
      },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );
  }

  goToLastday() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()-1);
  //  this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = this.date.getDate();      
    //this.date.setDate(this.currentDate.getDate()+1);
    this.updateGraphData();
    
  }    
  
  goToNextday() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()+1);
    //this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = this.date.getDate();           
    //this.date.setDate(this.currentDate.getDate()-1);
    this.updateGraphData();
  }   


  calender()
  {
    var date2 = sprintf("%s-%02d", this.currentYear ,this.currentMonth);
    this.navCtrl.push(DailySearchPage,{"history_back_type":1, "currentdate": date2});//home으로 리턴
  }

  createHrzBarChart() {

    console.log('createHrzBarChart Starts');
 
    //var day: Array<any>;
    var day=[];
    for(var i=0; i<24;i++)
   {
     for(var j=0; j<4;j++){
      day[i*4+j] = sprintf("%02d:%02d", j==3 ? i+1 : i , j==3 ? 0 : 15*j + 15);
     }
   }

   console.log('day value inputed');

   if(this.horizontalcanvas) this.horizontalcanvas.destroy();  

    this.horizontalcanvas = new Chart(this.horizontalbar.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: day,
        datasets: [{
          label: 'Online viewers in millions',
           data: this.usage_generated_list,// [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17,1.1, 2.3, 5, 1.9],
          backgroundColor: '#16da94', // array should have same number of elements as number of dataset
          borderColor: '#16da94',// array should have same number of elements as number of dataset
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

  createHrzBarChart2() {
 
    //var day: Array<any>;
    var day=[];
    for(var i=0; i<24;i++)
   {
     for(var j=0; j<4; j++){
      day[i*4+j] = sprintf("%02d:%02d", j==3 ? i+1 : i , j==3 ? 0 : 15*j + 15);
     }
   }

   if(this.horizontalcanvas2) this.horizontalcanvas2.destroy();  

    this.horizontalcanvas2 = new Chart(this.horizontalbar2.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: day,
        datasets: [{
          label: 'Online viewers in millions',
           data: this.usage_discharged_list,// [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17,1.1, 2.3, 5, 1.9],
          backgroundColor: '#16da94', // array should have same number of elements as number of dataset
          borderColor: '#16da94',// array should have same number of elements as number of dataset
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

  createHrzBarChart3() {
 
    //var day: Array<any>;
    var day=[];
    for(var i=0; i<24;i++)
   {
     for(var j=0; j<4; j++){
      day[i*4+j] = sprintf("%02d:%02d", j==3 ? i+1 : i , j==3 ? 0 : 15*j + 15);
     }
   }

   if(this.horizontalcanvas3) this.horizontalcanvas3.destroy();  

    this.horizontalcanvas3 = new Chart(this.horizontalbar3.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: day,
        datasets: [{
          label: 'Online viewers in millions',
           data: this.usage_charged_list,// [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17,1.1, 2.3, 5, 1.9],
          backgroundColor: '#16da94', // array should have same number of elements as number of dataset
          borderColor: '#16da94',// array should have same number of elements as number of dataset
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

  //탭클릭시 이벤트
  onSegmentChanged(segmentButton: any) 
  {

    if(segmentButton.value=="menu1")
    {
      this.selectedSegment = "menu1"; 
      this.show_menu1 = true;
      this.show_menu2 = false;
      this.show_menu3 = false;
      
      setTimeout( () => {
       // this.createHrzBarChart(); 
       this.GetPvEssStateRequest(0);
    }, 100);
    }

    if(segmentButton.value=="menu2")
    {
      this.selectedSegment = "menu2"; 
      this.show_menu1 = false;
      this.show_menu2 = true;
      this.show_menu3 = false;
      setTimeout( () => {
        //this.createHrzBarChart2();      
        this.GetPvEssStateRequest(1);
    }, 100);
      
    }

    if(segmentButton.value=="menu3")
    {
      this.selectedSegment = "menu3"; 
      this.show_menu1 = false;
      this.show_menu2 = false;
      this.show_menu3 = true;
      setTimeout( () => {
        //this.createHrzBarChart2();      
        this.GetPvEssStateRequest(2);
    }, 100);
      
    }

    //this.loadLocalData();
  }  

}

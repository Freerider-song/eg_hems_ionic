import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HTTP } from '@ionic-native/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Chart } from 'chart.js';
import { IonicStorageModule } from '@ionic/storage';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { Toast } from '@ionic-native/toast';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { FCM } from '@ionic-native/fcm';
import { ServerComm } from '../providers/server_comm';
import { ServiceAlert } from '../providers/service_message';
import { DatePicker } from '@ionic-native/date-picker';
import { ElecSearchDailyPage } from '../pages/elec-search-daily/elec-search-daily';
import { ElecSearchMonthPage } from '../pages/elec-search-month/elec-search-month';
import { ElecSearchWeekPage } from '../pages/elec-search-week/elec-search-week';
import { ElecSearchYearPage } from '../pages/elec-search-year/elec-search-year';

//enernet 이승호 작업 페이지
import { PvEssPage } from '../pages/pv-ess/pv-ess';
import { EvPage } from '../pages/ev/ev'

//import { FixedBottomContentPage } from '../pages/fixed-bottom-content/fixed-bottom-content';
import { PrivacyPage } from '../pages/privacy/privacy';
import { ProvisionPage } from '../pages/provision/provision';
import { DailySearchPage } from '../pages/daily-search/daily-search';
import { NoticeListPage } from '../pages/notice-list/notice-list';
import { NoticeViewPage } from '../pages/notice-view/notice-view';
import { NotifyListPage } from '../pages/notify-list/notify-list';
import { NotifySetPage } from '../pages/notify-set/notify-set';
import { PriceSetPage } from '../pages/price-set/price-set';
import { CustomerCenterPage } from '../pages/customer-center/customer-center';
import { SettingPage } from '../pages/setting/setting';
import { PwchangePage } from '../pages/pwchange/pwchange';
import { RegisterPage } from '../pages/register/register';
import { ForgotPassword } from '../pages/forgot-password/forgot-password';
import { MyContactListPage } from '../pages/my-contact-list/my-contact-list';
import { Sim } from '@ionic-native/sim';
import { WaitingPage } from '../pages/waiting/waiting';
import { BottomContentFixedPage } from '../pages/bottom-content_fixed/bottom-content-fixed';
import { BottomContentPage } from '../pages/bottom-content/bottom-content';
import { Autosize } from '../component/elastic';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { AppVersion} from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';






@NgModule({
  declarations: [
    MyApp,
    Autosize,
    LoginPage,
    ElecSearchDailyPage,
    ElecSearchMonthPage,
    ElecSearchWeekPage,
    ElecSearchYearPage,
    BottomContentPage,
    BottomContentFixedPage,
    //FixedBottomContentPage,    
    PrivacyPage,
    ProvisionPage,
    DailySearchPage,
    NoticeListPage,
    NoticeViewPage,    
    NotifyListPage,
    NotifySetPage,
    PriceSetPage,
    CustomerCenterPage,
    SettingPage,
    PwchangePage,
    RegisterPage,
    ForgotPassword,
    MyContactListPage,
    WaitingPage,    
    HomePage,

    PvEssPage,
    EvPage
  ],
  imports: [
    BrowserModule,
    //BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    //StarRatingModule,
    //ZoomAreaModule.forRoot(),
    IonicModule.forRoot(MyApp,
    {
      backButtonText: ''//,//, // ios 에서 백버튼 글자가 나오지만 이걸로 안나오게해야함
      //scrollPadding: false
    }),  
    IonicStorageModule.forRoot({//Storage Configuration 데이타베이스 종류와 이름을 설정
      name: '__dddd_', driverOrder: ['sqlite', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ElecSearchDailyPage,
    ElecSearchMonthPage,
    ElecSearchWeekPage,
    ElecSearchYearPage,  
    BottomContentPage,  
    BottomContentFixedPage,
   // FixedBottomContentPage,    
    PrivacyPage,
    ProvisionPage,
    DailySearchPage,
    NoticeListPage,
    NoticeViewPage,
    NotifyListPage,
    NotifySetPage,
    PriceSetPage,
    CustomerCenterPage,
    SettingPage,
    PwchangePage,
    RegisterPage,
    ForgotPassword,
    MyContactListPage,
    WaitingPage,
    HomePage,

    PvEssPage,
    EvPage
  ],
  providers: [
    StatusBar,
  //  Chart,
    Toast,
    FCM,
    MobileAccessibility,
    HTTP,
    Device,
    Sim,
    ServiceAlert,
    ServerComm,
    DatePicker,
    SplashScreen,
    LocalNotifications,
    PhonegapLocalNotification,
    AppVersion,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

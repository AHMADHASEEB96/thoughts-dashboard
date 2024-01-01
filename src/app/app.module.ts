
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// Reactive forms 
import { ReactiveFormsModule } from '@angular/forms';
// Import the firebase related components
import { AngularFireModule } from '@angular/fire/compat'; // do not forget that the AngularFireModule class is now starting form AngularFire v6 inside the compat folder and not the fire folder
// for firebase storage 
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
//import the environment object 
import { environment } from '../environments/environment';
// import the angular firestore to deal with firestore database
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
// Dynamically generated imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { CategoriesComponent } from './categories/categories.component'
// Import the class FormsModule to deal with the Angular forms 
import { FormsModule } from '@angular/forms';

// Import the toastr
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { NewPostComponent } from './posts/new-post/new-post.component';
//Kolkov editor 
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
//
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CategoriesComponent,
    AllPostsComponent,
    NewPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // initialize the angular fire app using the api configuration code that you received when registered the app on the firebase website
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,

    // all of the comign code is imported directly by sitting up the @angular/fire library with the whole set of firebase features or services
    provideFirebaseApp(() => initializeApp({ "projectId": "thoughts-posts-blog", "appId": "1:1026322748067:web:5777813b5b05c692e66516", "storageBucket": "thoughts-posts-blog.appspot.com", "apiKey": "AIzaSyA4QQpGjIi8-3VHjPD0BDObKWh5b4BV2eg", "authDomain": "thoughts-posts-blog.firebaseapp.com", "messagingSenderId": "1026322748067", "measurementId": "G-MNC386RX87" })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),

    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),

    FormsModule,
    // toastr
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // now go and inject the toastrService in the component you want to use it there
    //Kolkov editor 
    HttpClientModule, AngularEditorModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';

// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './shared/material.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
// import { AddPartnerComponent } from './dashboard/contents/program-management/add-partner/add-partner.component'

@NgModule({
  declarations: [
    // AddPartnerComponent,
    AppComponent,
    LoginComponent,
  ],
  imports: [
    // BrowserModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    MaterialModule,

    ScrollingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

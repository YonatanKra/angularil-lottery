import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TextComponent } from './text.component';
import {DataService} from './data.service';
import { ButtonsComponent } from './buttons.component';
import {DrumsService} from './drums.service';
import {MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { WinnersListComponent } from './winners-list/winners-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    ButtonsComponent,
    WinnersListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [DataService, DrumsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

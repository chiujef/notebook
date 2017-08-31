import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
  NoteComponent,
  NoteEditComponent,
  NoteListComponent,
  NotebookListComponent
} from '../components/index';

import {
  MockService,
  NotebookService,
  NotebookStoreService,
  NoteService,
  NoteStoreService
} from '../components/shared/index';

import {
  NOTE_API_URL,
  NOTEBOOK_API_URL
} from '../components/shared/config';


@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NoteEditComponent,
    NoteListComponent,
    NotebookListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: 'Window', useValue: window },
    NotebookStoreService,
    { provide: NotebookService, useClass: MockService },
    NoteStoreService,
    { provide: NoteService, useClass: MockService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

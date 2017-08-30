import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
  NoteComponent,
  NoteListComponent,
  NotebookListComponent
} from '../components/index';

import {
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
    NoteListComponent,
    NotebookListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    { provide: 'Window', useValue: window },
    NotebookService,
    { provide: NOTEBOOK_API_URL, useValue: NOTEBOOK_API_URL },
    NotebookStoreService,
    NoteService,
    { provide: NOTE_API_URL, useValue: NOTE_API_URL },
    NoteStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

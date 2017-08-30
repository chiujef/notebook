import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  NotebookListComponent,
  NoteListComponent
} from '../components/index';

const routes: Routes = [
  { path: '', redirectTo: 'notebooks', pathMatch: 'full' },
  { path: 'notebooks',  component: NoteListComponent },
  { path: 'notebooks/:notebookId',  component: NoteListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

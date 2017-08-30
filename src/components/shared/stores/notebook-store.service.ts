import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { Notebook } from '../models/notebook';
import { NotebookSelectedMessage } from '../messages/notebook-selected.message';
import { NotebookStoreMessage, NotebookStoreOperation } from '../messages/notebook-store.message';
import { NotebookService } from '../services/notebook.service';


/* Client storage for the notebook objects */
@Injectable()
export class NotebookStoreService {
    private notebookSelectedStoreSubject: BehaviorSubject<NotebookSelectedMessage> =
        new BehaviorSubject(new NotebookSelectedMessage(false, 0));

    private notebookStoreSubject: BehaviorSubject<NotebookStoreMessage> =
        new BehaviorSubject(new NotebookStoreMessage(NotebookStoreOperation.None, new Array<Notebook>()));
    private notebookStorage: Array<Notebook> = new Array<Notebook>();

    constructor(private notebookService: NotebookService) { }

    getNotebookSelectedStore(): Observable<NotebookSelectedMessage> {
        return this.notebookSelectedStoreSubject.asObservable();
    }

    setNotebookSelected(notebookId: number): void {
        this.notebookSelectedStoreSubject.next(new NotebookSelectedMessage(true, notebookId));
    }

    getNotebookStore(): Observable<NotebookStoreMessage> {
        return this.notebookStoreSubject.asObservable();
    }

    addNotebook(newNotebook: Notebook): void {
        this.notebookService.addNotebook(newNotebook).subscribe((notebook) => {
            let notebookStoreMessage = null;

            this.notebookStorage.push(notebook);
            notebookStoreMessage = new NotebookStoreMessage(NotebookStoreOperation.Added, this.notebookStorage);
            this.notebookStoreSubject.next(notebookStoreMessage);
        });
    }

    getAllNotebook(): void {
        this.notebookService.getAllNotebook().subscribe((notebooks) => {
            let notebookStoreMessage = null;

            this.notebookStorage = notebooks;
            notebookStoreMessage = new NotebookStoreMessage(NotebookStoreOperation.Retrieved, this.notebookStorage);
            this.notebookStoreSubject.next(notebookStoreMessage);
        });
    }

    updateNotebook(updatedNotebook: Notebook): void {
        this.notebookService.updateNotebook(updatedNotebook).subscribe((notebook) => {
           this.notebookStorage.forEach((item, index) => {
               if (this.notebookStorage[index].id === notebook.id) {
                   this.notebookStorage[index] = notebook;
               }
           });

           let notebookStoreMessage = null;
           notebookStoreMessage = new NotebookStoreMessage(NotebookStoreOperation.Updated, this.notebookStorage);
           this.notebookStoreSubject.next(notebookStoreMessage);
       });
   }

   deleteNotebook(notebookId: number): void {
         this.notebookService.deleteNotebook(notebookId).subscribe(() => {
            this.notebookStorage.forEach((item, index) => {
                if (this.notebookStorage[index].id === notebookId) {
                    this.notebookStorage.splice(index, 1);
                }
            });

            let notebookStoreMessage = null;
            notebookStoreMessage = new NotebookStoreMessage(NotebookStoreOperation.Deleted, this.notebookStorage);
            this.notebookStoreSubject.next(notebookStoreMessage);
        });
    }
}

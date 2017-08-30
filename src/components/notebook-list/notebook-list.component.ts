import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Notebook, NotebookStoreService } from '../shared/index';

@Component({
    selector: 'nb-notebook-list',
    templateUrl: './notebook-list.component.html',
    styleUrls: ['./notebook-list.component.css']
})
export class NotebookListComponent implements OnInit {
    isNotebookSelected: boolean;
    selectedNotebookId: number;
    notebooks: Notebook[];
    createMode: boolean;

    constructor(private router: Router,
        private notebookStoreService: NotebookStoreService
    ) {
        this.notebooks = new Array<Notebook>();
        this.createMode = false;
        this.isNotebookSelected = false;
    }

    ngOnInit(): void {
        this.notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
            this.isNotebookSelected = notebookSelectedMessage.isSelected;
            if (this.isNotebookSelected) {
                this.selectedNotebookId = notebookSelectedMessage.notebook.id;
            }
        });

        this.notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
            this.notebooks = notebookStoreMessage.notebooks;
        });

        this.notebookStoreService.getAllNotebook();
    }

    notebookClick(notebookId: number) {
        this.notebookStoreService.getNotebook(notebookId);
    }

    addNewNotebookClick() {
        this.createMode = true;
    }

    createNotebookClick(notebookTitle: string) {
        this.notebookStoreService.addNotebook(new Notebook(notebookTitle));
        this.createMode = false;
    }

    cancelCreateNotebookClick() {
        this.createMode = false;
    }

    deleteNotebookClick() {
        if (this.isNotebookSelected) {
            this.notebookStoreService.deleteNotebook(this.selectedNotebookId);
        }
        this.router.navigateByUrl('/');
    }
}

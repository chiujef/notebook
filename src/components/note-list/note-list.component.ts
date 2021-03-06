import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Note, NotebookStoreService, NoteStoreService } from '../shared/index';

@Component({
    selector: 'nb-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
    notes: Note[];
    isNotebookSelected: boolean;

    constructor(private route: ActivatedRoute,
        private notebookStoreService: NotebookStoreService,
        private noteStoreService: NoteStoreService
    ) {
        this.notes = new Array<Note>();
        this.isNotebookSelected = false;
    }

    ngOnInit(): void {
        this.notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
            this.isNotebookSelected = notebookSelectedMessage.isSelected;
        });

        this.noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
            this.notes = noteStoreMessage.notes;
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            const notebookId = +params.get('notebookId');
            this.notebookStoreService.getNotebook(notebookId);
            this.noteStoreService.getAllNoteByNotebookId(notebookId);
        });
    }
}

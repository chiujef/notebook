import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import {
    Note,
    NotebookStoreService,
    NoteStoreService
} from '../shared/index';

@Component({
    selector: 'nb-note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit {
    note: Note;
    isNotebookSelected: boolean;
    isNoteSelected: boolean;
    selectedNotebookId: number;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private notebookStoreService: NotebookStoreService,
        private noteStoreService: NoteStoreService
    ) {
        this.note = new Note();
    }

    ngOnInit(): void {
        this.notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
            this.isNotebookSelected = notebookSelectedMessage.isSelected;
            if (this.isNotebookSelected) {
                this.selectedNotebookId = notebookSelectedMessage.notebook.id;
            }
        });

        this.noteStoreService.getNoteSelectedStore().subscribe((noteSelectedMessage) => {
            this.note = noteSelectedMessage.note;
            this.isNoteSelected = noteSelectedMessage.isSelected;
            if (this.isNoteSelected) {
                this.notebookStoreService.getNotebook(this.note.notebookId);
            }
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            const noteId = +params.get('noteId');
            this.noteStoreService.getNote(noteId);
        });
    }

    saveNoteClick(): void {
        if (this.isNotebookSelected) {
            this.note.notebookId = this.selectedNotebookId;
            if (this.isNoteSelected) {
                this.noteStoreService.updateNote(this.note);
            } else {
                this.noteStoreService.addNote(this.note);
            }
            this.goBack();
        } else {
            console.log('No Notebook to associate the Note to.');
            this.router.navigateByUrl('/');
        }
    }

    cancelNoteClick(): void {
        this.goBack();
    }

    private goBack(): void {
        this.location.back();
    }
}

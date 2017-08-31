import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Note } from '../models/note';
import { Notebook } from '../models/notebook';


@Injectable()
export class MockService {
    private notebooks: Notebook[];
    private notes: Note[];

    constructor() {
        this.notebooks = new Array<Notebook>();
        this.notes = new Array<Note>();

        this.initNotebooks();
        this.initNotes();
    }

    addNotebook(notebook: Notebook): Observable<Notebook> {
        const id = this.notebooks.length + 1;
        notebook.id = id;
        this.notebooks.push(notebook);

        return Observable.of(notebook);
    }

    getNotebook(notebookId: number): Observable<Notebook> {
        const notebook = this.notebooks.find(nb => nb.id === notebookId);

        return Observable.of(notebook);
    }

    getAllNotebook(): Observable<Notebook[]> {
        return Observable.of(Array.from(this.notebooks));
    }

    updateNotebook(notebook: Notebook): Observable<Notebook> {
        this.notebooks.forEach((item, index) => {
            if (this.notebooks[index].id === notebook.id) {
                this.notebooks[index] = notebook;
            }
        });

        return Observable.of(notebook);
    }

    deleteNotebook(notebookId: number): Observable<any> {
        this.notebooks.forEach((item, index) => {
            if (this.notebooks[index].id === notebookId) {
                this.notebooks.splice(index, 1);
            }
        });

        this.notes.forEach((item, index) => {
            if (this.notes[index].notebookId === notebookId) {
                this.notes.splice(index, 1);
            }
        });

        return Observable.of(null);
    }

    addNote(note: Note): Observable<Note> {
        const id = this.notes.length + 1;
        note.id = id;
        this.notes.push(note);

        return Observable.of(note);
    }

    getNote(noteId: number): Observable<Note> {
        const note = this.notes.find(n => n.id === noteId);

        return Observable.of(note);
    }

    getAllNoteByNotebookId(notebookId: number): Observable<Note[]> {
        const notesFiltered = this.notes.filter(n => n.notebookId === notebookId);

        return Observable.of(notesFiltered);
    }

    updateNote(note: Note): Observable<Note> {
        this.notes.forEach((item, index) => {
            if (this.notes[index].id === note.id) {
                this.notes[index] = note;
            }
        });

        return Observable.of(note);
    }

    deleteNote(noteId: number): Observable<any> {
        this.notes.forEach((item, index) => {
            if (this.notes[index].id === noteId) {
                this.notes.splice(index, 1);
            }
        });

        return Observable.of(null);
    }

    private initNotebooks(): void {
        this.notebooks.push({ id: 1, title: 'Notebook 1' });
    }

    private initNotes(): void {
        this.notes.push({ id: 1, notebookId: 1, text: 'Notes 1-1' });
        this.notes.push({ id: 2, notebookId: 1, text: 'Notebook Text 1' });
        this.notes.push({ id: 3, notebookId: 1, text: 'Notebook Text 2' });
        this.notes.push({ id: 4, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' });
        this.notes.push({ id: 5, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' });
        this.notes.push({ id: 6, notebookId: 1, text: 'Basic panel example' });
        this.notes.push({ id: 7, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' });
        this.notes.push({ id: 8, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' });
        this.notes.push({ id: 9, notebookId: 1, text: 'Basic panel example' });
        this.notes.push({ id: 10, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' });
        this.notes.push({ id: 11, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' });
    }
}

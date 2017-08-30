import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { Note } from '../models/note';
import { NoteSelectedMessage } from '../messages/note-selected.message';
import { NoteStoreMessage, NoteStoreOperation } from '../messages/note-store.message';
import { NoteService } from '../services/note.service';


/* Client storage for the note objects */
@Injectable()
export class NoteStoreService {
    private noteSelectedStoreSubject: BehaviorSubject<NoteSelectedMessage> =
        new BehaviorSubject(new NoteSelectedMessage(false, null));

    private noteStoreSubject: BehaviorSubject<NoteStoreMessage> =
        new BehaviorSubject(new NoteStoreMessage(NoteStoreOperation.None, null));
    private noteStorage: Note[] = new Array<Note>();

    constructor(private noteService: NoteService) { }

    getNoteSelectedStore(): Observable<NoteSelectedMessage> {
        return this.noteSelectedStoreSubject.asObservable();
    }

    getNoteStore(): Observable<NoteStoreMessage> {
        return this.noteStoreSubject.asObservable();
    }

    addNote(newNote: Note): void {
        this.noteService.addNote(newNote).subscribe((note) => {
            let noteStoreMessage = null;
            this.noteStorage.push(note);
            noteStoreMessage = new NoteStoreMessage(NoteStoreOperation.Added, this.noteStorage);
            this.noteStoreSubject.next(noteStoreMessage);
        });
    }

    getNote(noteId: number): void {
        let noteSelectedMessage: NoteSelectedMessage = null;
        let selectedNote = this.noteStorage.find(note => note.id === noteId);
        if (!selectedNote) {
            this.noteService.getNote(noteId).subscribe((note) => {
                if (!note) {
                    noteSelectedMessage = new NoteSelectedMessage(false, new Note());
                } else {
                    noteSelectedMessage = new NoteSelectedMessage(true, note);
                }

                this.noteSelectedStoreSubject.next(noteSelectedMessage);
            });
        } else {
            noteSelectedMessage = new NoteSelectedMessage(true, selectedNote);
            this.noteSelectedStoreSubject.next(noteSelectedMessage);
        }
    }

    getAllNoteByNotebookId(notebookId: number): void {
        this.noteService.getAllNoteByNotebookId(notebookId).subscribe((notes) => {
            let noteStoreMessage = null;

            this.noteStorage = notes;
            noteStoreMessage = new NoteStoreMessage(NoteStoreOperation.Retrieved, this.noteStorage);
            this.noteStoreSubject.next(noteStoreMessage);
        });
    }

    updateNote(updatedNote: Note): void {
        this.noteService.updateNote(updatedNote).subscribe((note) => {
           this.noteStorage.forEach((item, index) => {
               if (this.noteStorage[index].id === note.id) {
                   this.noteStorage[index] = note;
               }
           });

           let noteStoreMessage = null;

            noteStoreMessage = new NoteStoreMessage(NoteStoreOperation.Updated, this.noteStorage);
            this.noteStoreSubject.next(noteStoreMessage);
       });
   }

   deleteNote(noteId: number): void {
    this.noteService.deleteNote(noteId).subscribe(() => {
       this.noteStorage.forEach((item, index) => {
           if (this.noteStorage[index].id === noteId) {
               this.noteStorage.splice(index, 1);
           }
       });

       let noteStoreMessage = null;

        noteStoreMessage = new NoteStoreMessage(NoteStoreOperation.Deleted, this.noteStorage);
        this.noteStoreSubject.next(noteStoreMessage);
   });
}
}

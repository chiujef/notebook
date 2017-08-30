import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import {
    Note,
    NoteService,
    NoteStoreMessage,
    NoteStoreOperation
} from '../index';
import { NoteStoreService } from './note-store.service';


describe('Note Store Service tests', () => {

    class MockNoteService {
        addNote: (note: Note) => Observable<Note>;
        getNote: (noteId: number) => Observable<Note>;
        getAllNoteByNotebookId: (notebookId: number) => Observable<Note[]>;
        updateNote: (note: Note) => Observable<Note>;
        deleteNote: (noteId: number) => Observable<any>;
    }

    /* test data - start */
    let NOTE_DATA_1: Note = null;
    let NOTE_DATA_1_UPD: Note = null;
    let NOTE_DATA_2: Note = null;
    /* test data - end */

    let noteStoreService: NoteStoreService = null;
    let mockNoteService: MockNoteService = null;

    beforeEach(async(() => {
        /* test data - start */
        NOTE_DATA_1 = { id: 1, notebookId: 1, text: 'Note 1' };
        NOTE_DATA_1_UPD = { id: 1, notebookId: 1, text: 'Note 1 UPD' };
        NOTE_DATA_2 = { id: 3, notebookId: 2, text: 'Note 2' };
        /* test data - end */

        TestBed.configureTestingModule({
            providers: [
                MockNoteService,
                { provide: NoteService, useClass: MockNoteService },
                NoteStoreService
            ]
        })
        .compileComponents()
        .then(() => {
            noteStoreService = TestBed.get(NoteStoreService);
            mockNoteService = TestBed.get(NoteService);
        });
    }));

    describe('getNoteSelectedStore tests', () => {
        it('should be available', async() => {
            expect(noteStoreService.getNoteSelectedStore).toBeTruthy();
        });
    });

    describe('getNoteStore tests', () => {
        it('should be available', async() => {
            expect(noteStoreService.getNoteStore).toBeTruthy();
        });
    });

    describe('addNote tests', () => {
        it('should add the note to the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.addNote(NOTE_DATA_1);

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(mockNoteService.addNote).toHaveBeenCalledTimes(1);
                expect(noteStoreMessage.operation).toBe(NoteStoreOperation.Added);
                expect(noteStoreMessage.notes.length).toBe(1);
                expect(noteStoreMessage.notes[0].id).toBe(NOTE_DATA_1.id);
                expect(noteStoreMessage.notes[0].notebookId).toBe(NOTE_DATA_1.notebookId);
                expect(noteStoreMessage.notes[0].text).toBe(NOTE_DATA_1.text);
            });
        });

        it('should return the note as immutable', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.addNote(NOTE_DATA_1);
            NOTE_DATA_1.text = 'UPDATE';

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(noteStoreMessage.notes[0].text).not.toBe(NOTE_DATA_1.text);
            });
        });
    });

    describe('getNote tests', () => {
        it('should get the note to the note store', async() => {
            const expectedNoteId = 1;
            mockNoteService.getNote = jasmine.createSpy('getNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.getNote(expectedNoteId);

            noteStoreService.getNoteSelectedStore().subscribe((noteSelectedMessage) => {
                expect(mockNoteService.getNote).toHaveBeenCalledWith(expectedNoteId);
                expect(noteSelectedMessage.note.id).toBe(NOTE_DATA_1.id);
                expect(noteSelectedMessage.note.text).toBe(NOTE_DATA_1.text);
            });
        });

        it('should set the note as selected when a valid note is found', async() => {
            mockNoteService.getNote = jasmine.createSpy('getNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.getNote(1);

            noteStoreService.getNoteSelectedStore().subscribe((noteSelectedMessage) => {
                expect(noteSelectedMessage.isSelected).toBe(true);
            });
        });

        it('should set the note as not selected when the note is not found', async() => {
            mockNoteService.getNote = jasmine.createSpy('getNote')
                .and.returnValue(Observable.of(null));

            noteStoreService.getNote(1);

            noteStoreService.getNoteSelectedStore().subscribe((noteSelectedMessage) => {
                expect(noteSelectedMessage.isSelected).toBe(false);
            });
        });

        it('should return the note as immutable', async() => {
            mockNoteService.getNote = jasmine.createSpy('getNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.getNote(1);
            NOTE_DATA_1.text = 'UPDATE';

            noteStoreService.getNoteSelectedStore().subscribe((noteSelectedMessage) => {
                expect(noteSelectedMessage.note.text).not.toBe(NOTE_DATA_1.text);
            });
        });
    });

    describe('getAllNoteByNotebookId tests', () => {
        it('should get all note by notebook id to the note store', async() => {
            mockNoteService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId')
                .and.returnValue(Observable.of([NOTE_DATA_1, NOTE_DATA_2]));

            noteStoreService.getAllNoteByNotebookId(1);

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(mockNoteService.getAllNoteByNotebookId).toHaveBeenCalledTimes(1);
                expect(noteStoreMessage.operation).toBe(NoteStoreOperation.Retrieved);
                expect(noteStoreMessage.notes.length).toBe(2);
                expect(noteStoreMessage.notes[0].id).toBe(NOTE_DATA_1.id);
                expect(noteStoreMessage.notes[0].notebookId).toBe(NOTE_DATA_1.notebookId);
                expect(noteStoreMessage.notes[0].text).toBe(NOTE_DATA_1.text);
                expect(noteStoreMessage.notes[1].id).toBe(NOTE_DATA_2.id);
                expect(noteStoreMessage.notes[1].notebookId).toBe(NOTE_DATA_2.notebookId);
                expect(noteStoreMessage.notes[1].text).toBe(NOTE_DATA_2.text);
            });
        });

        it('should return the notes as immutable', async() => {
            mockNoteService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId')
                .and.returnValue(Observable.of([NOTE_DATA_1, NOTE_DATA_2]));

            noteStoreService.getAllNoteByNotebookId(1);
            NOTE_DATA_1.text = 'UPDATE';

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(noteStoreMessage.notes[0].text).not.toBe(NOTE_DATA_1.text);
            });
        });
    });

    describe('updateNote tests', () => {
        it('should update note on the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));
            mockNoteService.updateNote = jasmine.createSpy('updateNote')
                .and.returnValue(Observable.of(NOTE_DATA_1_UPD));

            noteStoreService.addNote(NOTE_DATA_1);
            noteStoreService.updateNote(NOTE_DATA_1_UPD);

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(mockNoteService.updateNote).toHaveBeenCalledTimes(1);
                expect(noteStoreMessage.operation).toBe(NoteStoreOperation.Updated);
                expect(noteStoreMessage.notes.length).toBe(1);
                expect(noteStoreMessage.notes[0].text).toBe(NOTE_DATA_1_UPD.text);
            });
        });

        it('should return the notes as immutable', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));
            mockNoteService.updateNote = jasmine.createSpy('updateNote')
                .and.returnValue(Observable.of(NOTE_DATA_1_UPD));

            noteStoreService.addNote(NOTE_DATA_1);
            noteStoreService.updateNote(NOTE_DATA_1_UPD);
            NOTE_DATA_1_UPD.text = 'UPDATE';

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(noteStoreMessage.notes[0].text).not.toBe(NOTE_DATA_1_UPD.text);
            });
        });
    });

    describe('deleteNote tests', () => {
        it('should delete note on the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                .and.returnValue(Observable.of(NOTE_DATA_1));
            mockNoteService.deleteNote = jasmine.createSpy('deleteNote')
                .and.returnValue(Observable.of(null));

            noteStoreService.addNote(NOTE_DATA_1);
            noteStoreService.deleteNote(NOTE_DATA_1.id);

            noteStoreService.getNoteStore().subscribe((noteStoreMessage) => {
                expect(mockNoteService.deleteNote).toHaveBeenCalledTimes(1);
                expect(noteStoreMessage.operation).toBe(NoteStoreOperation.Deleted);
                expect(noteStoreMessage.notes.length).toBe(0);
            });
        });
    });
});

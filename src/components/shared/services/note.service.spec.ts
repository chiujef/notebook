import { async, inject, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions,
    Http,
    HttpModule,
    RequestMethod,
    ResponseOptions,
    XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Note } from '../index';
import { NoteService } from './note.service';

import { NOTE_API_URL } from '../config';


describe('Note Service tests', () => {
    let noteService: NoteService;
    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                NoteService,
                { provide: NOTE_API_URL, useValue: 'http://test.com' },
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        })
        .compileComponents()
        .then(() => {
            noteService = TestBed.get(NoteService);
            mockBackend = TestBed.get(MockBackend);
        });
    }));

    describe('addNote tests', () => {
        it('should \'post\' the new notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Post);
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new Note())
                })));
            });

            noteService.addNote(new Note()).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return the new note', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new Note())
                })));
            });

            noteService.addNote(new Note()).subscribe(note => {
                expect(note).not.toBeNull();
            });
        });
    });

    describe('getNote test', () => {
        it('should \'get\' notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Get);
            });

            noteService.getNote(1).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should retrieve notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new Note())
                })));
            });

            noteService.getNote(1).subscribe((note) => {
                expect(note).not.toBeNull();
            });
        });
    });

    describe('getAllNoteByNotebookId tests', () => {
        it('should \'get\' all the notes by notebook id', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Get);
            });

            noteService.getAllNoteByNotebookId(1).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return all notes', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify([new Note()])
                })));
            });

            noteService.getAllNoteByNotebookId(1).subscribe((notes) => {
                expect(notes.length).toBe(1);
            });
        });
    });

    describe('updateNote tests', () => {
        it('should \'put\' the note', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Put);
            });

            noteService.updateNote(new Note()).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return updated note', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: new Note()
                })));
            });

            noteService.updateNote(new Note()).subscribe((note) => {
                expect(note).not.toBeNull();
            });
        });
    });

    describe('deleteNote tests', () => {
        it('should \'delete\' the note', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Delete);
            });

            noteService.deleteNote(1).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return status 204 for successful deletion', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    status: 204
                })));
            });

            noteService.deleteNote(1).subscribe((result) => {
                expect(result.status).toBe(204);
            });
        });
    });
});

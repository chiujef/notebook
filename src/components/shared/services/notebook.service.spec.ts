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


import { Note, Notebook } from '../index';
import { NotebookService } from './notebook.service';

import { NOTEBOOK_API_URL } from '../config';


describe('Notebook Service tests', () => {
    let notebookService: NotebookService;
    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                NotebookService,
                { provide: NOTEBOOK_API_URL, useValue: 'http://test.com' },
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
            notebookService = TestBed.get(NotebookService);
            mockBackend = TestBed.get(MockBackend);
        });
    }));

    describe('addNotebook tests', () => {
        it('should \'post\' the new notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Post);
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new Notebook(''))
                })));
            });

            notebookService.addNotebook(new Notebook('')).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return the new notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new Notebook(''))
                })));
            });

            notebookService.addNotebook(new Notebook('')).subscribe(notebook => {
                expect(notebook).not.toBeNull();
            });
        });
    });

    describe('getAllNotebook tests', () => {
        it('should \'get\' all the notebooks', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Get);
            });

            notebookService.getAllNotebook().subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return all notebooks', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify([new Notebook('')])
                })));
            });

            notebookService.getAllNotebook().subscribe((notebooks) => {
                expect(notebooks.length).toBe(1);
            });
        });
    });

    describe('updateNotebook tests', () => {
        it('should \'put\' the notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Put);
            });

            notebookService.updateNotebook(new Notebook('')).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return updated notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: new Notebook('')
                })));
            });

            notebookService.updateNotebook(new Notebook('')).subscribe((notebook) => {
                expect(notebook).not.toBeNull();
            });
        });
    });

    describe('deleteNotebook tests', () => {
        it('should \'delete\' the notebook', async() => {
            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.method).toBe(RequestMethod.Delete);
            });

            notebookService.deleteNotebook(1).subscribe(() => {
                expect(true).toBe(true);
            });
        });

        it('should return status 204 for successful deletion', async() => {
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    status: 204
                })));
            });

            notebookService.deleteNotebook(1).subscribe((result) => {
                expect(result.status).toBe(204);
            });
        });
    });
});

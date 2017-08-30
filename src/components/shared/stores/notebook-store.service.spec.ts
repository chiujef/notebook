import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import {
    Notebook,
    NotebookSelectedMessage,
    NotebookService,
    NotebookStoreMessage,
    NotebookStoreOperation
} from '../index';
import { NotebookStoreService } from './notebook-store.service';


describe('Notebook Store Service tests', () => {
    class MockNotebookService {
        addNotebook: (notebook: Notebook) => Observable<Notebook>;
        getNotebook: (notebookId: number) => Observable<Notebook>;
        getAllNotebook: () => Observable<Notebook[]>;
        updateNotebook: (notebook: Notebook) => Observable<Notebook>;
        deleteNotebook: (notebookId: number) => Observable<any>;
    }

    /* test data - start */
    let NOTEBOOK_DATA_1: Notebook;
    let NOTEBOOK_DATA_1_UPD: Notebook;
    let NOTEBOOK_DATA_2: Notebook;
    /* test data - end */

    let notebookStoreService: NotebookStoreService = null;
    let mockNotebookService: MockNotebookService = null;

    beforeEach(async(() => {
        /* test data - start */
        NOTEBOOK_DATA_1 = { id: 1, title: 'Title 1' };
        NOTEBOOK_DATA_1_UPD = { id: 1, title: 'Title 1 - Update' };
        NOTEBOOK_DATA_2 = { id: 2, title: 'Title 2' };
        /* test data - end */

        TestBed.configureTestingModule({
            providers: [
                MockNotebookService,
                { provide: NotebookService, useClass: MockNotebookService },
                NotebookStoreService
            ]
        })
        .compileComponents()
        .then(() => {
            notebookStoreService = TestBed.get(NotebookStoreService);
            mockNotebookService = TestBed.get(NotebookService);
        });
    }));

    describe('getNotebookSelectedStore tests', () => {
        it('should be available', async() => {
            expect(notebookStoreService.getNotebookSelectedStore).toBeTruthy();
        });
    });

    describe('getNotebookStore tests', () => {
        it('should be available', async() => {
            expect(notebookStoreService.getNotebookStore).toBeTruthy();
        });
    });

    describe('addNotebook tests', () => {
        it('should add the notebook to the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(mockNotebookService.addNotebook).toHaveBeenCalledTimes(1);
                expect(notebookStoreMessage.operation).toBe(NotebookStoreOperation.Added);
                expect(notebookStoreMessage.notebooks.length).toBe(1);
                expect(notebookStoreMessage.notebooks[0].id).toBe(NOTEBOOK_DATA_1.id);
                expect(notebookStoreMessage.notebooks[0].title).toBe(NOTEBOOK_DATA_1.title);
            });
        });

        it('should return the notebook as immutable', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            NOTEBOOK_DATA_1.title = 'UPDATE';

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(notebookStoreMessage.notebooks[0].title).not.toBe(NOTEBOOK_DATA_1.title);
            });
        });
    });

    describe('getNotebook tests', () => {
        it('should get the notebook to the notebook store', async() => {
            const expectedNotebookId = 1;
            mockNotebookService.getNotebook = jasmine.createSpy('getNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.getNotebook(expectedNotebookId);

            notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
                expect(mockNotebookService.getNotebook).toHaveBeenCalledWith(expectedNotebookId);
                expect(notebookSelectedMessage.notebook.id).toBe(NOTEBOOK_DATA_1.id);
                expect(notebookSelectedMessage.notebook.title).toBe(NOTEBOOK_DATA_1.title);
            });
        });

        it('should set the notebook as selected when a valid notebook is found', async() => {
            mockNotebookService.getNotebook = jasmine.createSpy('getNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.getNotebook(1);

            notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
                expect(notebookSelectedMessage.isSelected).toBe(true);
            });
        });

        it('should set the notebook as not selected when the notebook is not found', async() => {
            const expectedNotebookId = 1;
            mockNotebookService.getNotebook = jasmine.createSpy('getNotebook')
                .and.returnValue(null);

            notebookStoreService.getNotebook(expectedNotebookId);

            notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
                expect(notebookSelectedMessage.isSelected).toBe(false);
            });
        });

        it('should return the notebook as immutable', async() => {
            mockNotebookService.getNotebook = jasmine.createSpy('getNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.getNotebook(1);
            NOTEBOOK_DATA_1.title = 'UPDATE';

            notebookStoreService.getNotebookSelectedStore().subscribe((notebookSelectedMessage) => {
                expect(notebookSelectedMessage.notebook.title).not.toBe(NOTEBOOK_DATA_1.title);
            });
        });
    });

    describe('getAllNotebook tests', () => {
        it('should get all notebook to the notebook store', async() => {
            mockNotebookService.getAllNotebook = jasmine.createSpy('getAllNotebook')
                .and.returnValue(Observable.of([NOTEBOOK_DATA_1, NOTEBOOK_DATA_2]));

            notebookStoreService.getAllNotebook();

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(mockNotebookService.getAllNotebook).toHaveBeenCalledTimes(1);
                expect(notebookStoreMessage.operation).toBe(NotebookStoreOperation.Retrieved);
                expect(notebookStoreMessage.notebooks.length).toBe(2);
                expect(notebookStoreMessage.notebooks[0].id).toBe(NOTEBOOK_DATA_1.id);
                expect(notebookStoreMessage.notebooks[0].title).toBe(NOTEBOOK_DATA_1.title);
                expect(notebookStoreMessage.notebooks[1].id).toBe(NOTEBOOK_DATA_2.id);
                expect(notebookStoreMessage.notebooks[1].title).toBe(NOTEBOOK_DATA_2.title);
            });
        });

        it('should return the notebooks as immutable', async() => {
            mockNotebookService.getAllNotebook = jasmine.createSpy('getAllNotebook')
                .and.returnValue(Observable.of([NOTEBOOK_DATA_1, NOTEBOOK_DATA_2]));

            notebookStoreService.getAllNotebook();
            NOTEBOOK_DATA_1.title = 'UPDATE';

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(notebookStoreMessage.notebooks[0].title).not.toBe(NOTEBOOK_DATA_1.title);
            });
        });
    });

    describe('updateNotebook tests', () => {
        it('should update notebook on the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));
            mockNotebookService.updateNotebook = jasmine.createSpy('updateNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1_UPD));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            notebookStoreService.updateNotebook(NOTEBOOK_DATA_1_UPD);

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(mockNotebookService.updateNotebook).toHaveBeenCalledTimes(1);
                expect(notebookStoreMessage.notebooks.length).toBe(1);
                expect(notebookStoreMessage.notebooks[0].id).toBe(NOTEBOOK_DATA_1_UPD.id);
                expect(notebookStoreMessage.notebooks[0].title).toBe(NOTEBOOK_DATA_1_UPD.title);
            });
        });

        it('should return the notebooks as immutable', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));
            mockNotebookService.updateNotebook = jasmine.createSpy('updateNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1_UPD));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            notebookStoreService.updateNotebook(NOTEBOOK_DATA_1_UPD);
            NOTEBOOK_DATA_1_UPD.title = 'UPDATE';

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(notebookStoreMessage.notebooks[0].title).not.toBe(NOTEBOOK_DATA_1_UPD.title);
            });
        });
    });

    describe('deleteNotebook tests', () => {
        it('should delete notebook on the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));
            mockNotebookService.deleteNotebook = jasmine.createSpy('deleteNotebook')
                .and.returnValue(Observable.of(null));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            notebookStoreService.deleteNotebook(NOTEBOOK_DATA_1.id);

            notebookStoreService.getNotebookStore().subscribe((notebookStoreMessage) => {
                expect(mockNotebookService.deleteNotebook).toHaveBeenCalledTimes(1);
                expect(notebookStoreMessage.notebooks.length).toBe(0);
            });
        });
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { NotebookListComponent } from './notebook-list.component';

import {
    Notebook,
    NotebookSelectedMessage,
    NotebookStoreMessage,
    NotebookStoreOperation,
    NotebookStoreService
} from '../shared/index';


describe('Notebook List Component tests', () => {
    let router = null;

    class MockNotebookStoreService {
        getNotebookSelectedStore: () => Observable<NotebookSelectedMessage>;
        getNotebookStore: () => Observable<NotebookStoreMessage>;
        addNotebook: (newNotebook: Notebook) => void;
        getNotebook: (notebookId: number) => void;
        getAllNotebook: () => void;
        deleteNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let notebookListComponent: NotebookListComponent;
    let fixture: ComponentFixture<NotebookListComponent>;

    beforeEach(async(() => {
        router = {
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            declarations: [ NotebookListComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                MockNotebookStoreService,
                { provide: NotebookStoreService, useClass: MockNotebookStoreService },
                { provide: Router, useValue: router }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NotebookListComponent);
            notebookListComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);

            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(false, new Notebook(''))));
            mockNotebookStoreService.getNotebookStore = jasmine.createSpy('getNotebookStore')
                .and.returnValue(Observable.of(new NotebookStoreMessage(NotebookStoreOperation.Retrieved, new Array<Notebook>())));
            mockNotebookStoreService.getAllNotebook = jasmine.createSpy('getAllNotebook');
        });
    }));

    it('should initialize notebooks', async() => {
        fixture.detectChanges();

        expect(notebookListComponent.notebooks).toBeTruthy();
    });

    it('should subscribe to the notebook selected store', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getNotebookSelectedStore).toHaveBeenCalled();
    });

    it('should set the selected notebook id if a valid selected notebook was retrieved', async() => {
        const expectedNotebookId = 1;
        const notebook: Notebook = new Notebook('Test');
        notebook.id = expectedNotebookId;
        mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
            .and.returnValue(Observable.of(new NotebookSelectedMessage(true, notebook)));

        fixture.detectChanges();

        expect(notebookListComponent.selectedNotebookId).toBe(expectedNotebookId);
    });

    it('should subscribe to the notebook store', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getNotebookStore).toHaveBeenCalled();
    });

    it('should retrieve all the notebook', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getAllNotebook).toHaveBeenCalled();
    });

    describe('notebookClick tests', () => {
        it('should request for the notebook', async() => {
            const expectedNotebookId = 1;
            mockNotebookStoreService.getNotebook = jasmine.createSpy('getNotebook');

            notebookListComponent.notebookClick(expectedNotebookId);

            expect(mockNotebookStoreService.getNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    describe('addNewNotebookClick tests', () => {
        it('should set createMode flag to true', () => {
            notebookListComponent.addNewNotebookClick();

            expect(notebookListComponent.createMode).toBe(true);
        });
    });

    describe('createNotebookClick tests', () => {
        it('should call notebook store service to add the notebook', async() => {
            mockNotebookStoreService.addNotebook = jasmine.createSpy('addNotebook');

            notebookListComponent.createNotebookClick('test');

            expect(mockNotebookStoreService.addNotebook).toHaveBeenCalled();
        });

        it('should set createMode flag to false', async() => {
            notebookListComponent.createNotebookClick('test');

            expect(notebookListComponent.createMode).toBe(false);
        });
    });

    describe('cancelCreateNotebookClick tests', () => {
        it('should set createMode flag to false', () => {
            notebookListComponent.cancelCreateNotebookClick();

            expect(notebookListComponent.createMode).toBe(false);
        });
    });

    describe('deleteNotebookClick tests', async() => {
        it('should call notebook store service to delete the notebook', async() => {
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            notebookListComponent.deleteNotebookClick();

            expect(mockNotebookStoreService.deleteNotebook).toHaveBeenCalled();
        });

        it('should redirect to main page after deletion', async() => {
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            notebookListComponent.deleteNotebookClick();

            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should not delete the notebook if there are no notebook selected', async() => {
            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(false, null)));
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            fixture.detectChanges();
            notebookListComponent.deleteNotebookClick();

            expect(mockNotebookStoreService.deleteNotebook).not.toHaveBeenCalled();
        });
    });
});

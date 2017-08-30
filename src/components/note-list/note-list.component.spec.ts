import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Rx';

import { NoteListComponent } from './note-list.component';

import { NoteComponent } from '../index';
import {
    Note,
    Notebook,
    NotebookStoreService,
    NoteStoreMessage,
    NoteStoreOperation,
    NoteStoreService
} from '../shared/index';


describe('Note List Component tests', () => {
    const expectedNotebookId = 1;

    class MockNoteStoreService {
        getNoteStore: () => Observable<NoteStoreMessage>;
        getAllNoteByNotebookId: (notebookId: number) => void;
    }

    class MockNotebookStoreService {
        getNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let mockNoteStoreService: MockNoteStoreService;
    let noteListComponent: NoteListComponent;
    let fixture: ComponentFixture<NoteListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NoteComponent, NoteListComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: Observable.of(convertToParamMap({notebookId: expectedNotebookId}))
                    }
                },
                MockNotebookStoreService,
                { provide: NotebookStoreService, useClass: MockNotebookStoreService },
                MockNoteStoreService,
                { provide: NoteStoreService, useClass: MockNoteStoreService }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NoteListComponent);
            noteListComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);
            mockNoteStoreService = TestBed.get(NoteStoreService);

            mockNotebookStoreService.getNotebook = jasmine.createSpy('getNotebook');

            mockNoteStoreService.getNoteStore = jasmine.createSpy('getNoteStore')
                .and.returnValue(Observable.of(new NoteStoreMessage(NoteStoreOperation.Retrieved, new Array<Note>())));
            mockNoteStoreService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId');
        });
    }));

    it('should initialize notes', () => {
        mockNoteStoreService.getNoteStore = jasmine.createSpy('getNoteStore')
            .and.returnValue(Observable.of(new NoteStoreMessage(NoteStoreOperation.Retrieved, new Array<Note>())));

        fixture.detectChanges();

        expect(noteListComponent.notes).toBeTruthy();
    });

    it('should request for the notebook from the notebookId passed from the URL', () => {
        mockNotebookStoreService.getNotebook = jasmine.createSpy('getNotebook');
        mockNoteStoreService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNotebookStoreService.getNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    it('should get all notebook with the notebookId passed from the URL', () => {
        mockNotebookStoreService.getNotebook = jasmine.createSpy('getNotebook');
        mockNoteStoreService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNoteStoreService.getAllNoteByNotebookId).toHaveBeenCalledWith(expectedNotebookId);
        });
    });
});

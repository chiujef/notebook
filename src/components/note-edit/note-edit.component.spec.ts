import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Rx';

import { NoteEditComponent } from './note-edit.component';

import { NoteComponent } from '../index';
import {
    Note,
    Notebook,
    NotebookSelectedMessage,
    NotebookStoreService,
    NoteSelectedMessage,
    NoteStoreService
} from '../shared/index';


describe('Note Edit Component tests', () => {
    const expectedNoteId = 1;
    let mockRouter = null;
    let mockLocation = null;

    class MockNoteStoreService {
        getNoteSelectedStore: () => Observable<NoteSelectedMessage>;
        addNote: (newNote: Note) => void;
        getNote: (notebookId: number) => void;
        updateNote: (updatedNote: Note) => void;
    }

    class MockNotebookStoreService {
        getNotebookSelectedStore: () => Observable<NotebookSelectedMessage>;
        getNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let mockNoteStoreService: MockNoteStoreService;
    let noteEditComponent: NoteEditComponent;
    let fixture: ComponentFixture<NoteEditComponent>;

    beforeEach(async(() => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };
        mockLocation = {
            back: jasmine.createSpy('back')
        };

        TestBed.configureTestingModule({
            declarations: [ NoteComponent, NoteEditComponent ],
            imports: [ RouterTestingModule, FormsModule ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: Observable.of(convertToParamMap({noteId: expectedNoteId}))
                    }
                },
                { provide: Router, useValue: mockRouter },
                { provide: Location, useValue: mockLocation },
                MockNotebookStoreService,
                { provide: NotebookStoreService, useClass: MockNotebookStoreService },
                MockNoteStoreService,
                { provide: NoteStoreService, useClass: MockNoteStoreService }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NoteEditComponent);
            noteEditComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);
            mockNoteStoreService = TestBed.get(NoteStoreService);

            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(true, new Notebook(''))));
            mockNotebookStoreService.getNotebook = jasmine.createSpy('getNotebook');

            mockNoteStoreService.getNoteSelectedStore = jasmine.createSpy('getNoteSelectedStore')
                .and.returnValue(Observable.of(new NoteSelectedMessage(true, new Note())));
            mockNoteStoreService.addNote = jasmine.createSpy('addNote');
            mockNoteStoreService.getNote = jasmine.createSpy('getNote');
            mockNoteStoreService.updateNote = jasmine.createSpy('updateNote');
        });
    }));

    it('should initialize note', () => {
        fixture.detectChanges();

        expect(noteEditComponent.note).toBeTruthy();
    });

    it('should get the note from the note store with the noteId passed from the URL', async() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNoteStoreService.getNote).toHaveBeenCalledWith(expectedNoteId);
        });
    });

    it('should set the notebook selected flag if there is a valid notebook selected', async() => {
        mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
            .and.returnValue(Observable.of(new NotebookSelectedMessage(true, new Notebook(''))));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(noteEditComponent.isNotebookSelected).toBe(true);
        });
    });

    it('should get the notebook id if there is a valid notebook selected', async() => {
        const expectedNotebookId = 1;
        const notebook = { id: expectedNotebookId, title: 'Test' };
        mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
            .and.returnValue(Observable.of(new NotebookSelectedMessage(true, notebook)));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(noteEditComponent.selectedNotebookId).toBe(expectedNotebookId);
        });
    });

    it('should set selected notebook Id in notebook store based on a valid note\'s notebookId', async() => {
        const expectedNotebookId = 1;
        const note: Note = { id: 1, notebookId: expectedNotebookId, text: 'test' };
        mockNoteStoreService.getNoteSelectedStore = jasmine.createSpy('getNoteSelectedStore')
            .and.returnValue(Observable.of(new NoteSelectedMessage(true, note)));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNotebookStoreService.getNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    describe('saveNoteClick tests', () => {
        it('should go back to previous page after a valid save/update', async() => {
            const notebook = { id: 1, title: 'Test' };
            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(true, notebook)));
            mockNoteStoreService.getNoteSelectedStore = jasmine.createSpy('getNoteSelectedStore')
                .and.returnValue(Observable.of(new NoteSelectedMessage(false, new Note())));
            mockNoteStoreService.addNote = jasmine.createSpy('addNote');

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockLocation.back).toHaveBeenCalled();
            });
        });

        it('should save a valid new note', async() => {
            const notebook = { id: 1, title: 'Test' };
            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(true, notebook)));
            mockNoteStoreService.getNoteSelectedStore = jasmine.createSpy('getNoteSelectedStore')
                .and.returnValue(Observable.of(new NoteSelectedMessage(false, new Note())));
            mockNoteStoreService.addNote = jasmine.createSpy('addNote');

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockNoteStoreService.addNote).toHaveBeenCalled();
            });
        });

        it('should update a valid note', async() => {
            const notebook = { id: 1, title: 'Test' };
            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(true, notebook)));
            mockNoteStoreService.getNoteSelectedStore = jasmine.createSpy('getNoteSelectedStore')
                .and.returnValue(Observable.of(new NoteSelectedMessage(true, new Note())));
            mockNoteStoreService.updateNote = jasmine.createSpy('updateNote');

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockNoteStoreService.updateNote).toHaveBeenCalled();
            });
        });

        it('should redirect user to main page after invalid save', async() => {
            mockNotebookStoreService.getNotebookSelectedStore = jasmine.createSpy('getNotebookSelectedStore')
                .and.returnValue(Observable.of(new NotebookSelectedMessage(false, new Notebook(''))));

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
            });
        });
    });

    describe('cancelNoteClick tests', () => {
        it('should redirect the user back to previous page', () => {
            noteEditComponent.cancelNoteClick();

            expect(mockLocation.back).toHaveBeenCalled();
        });
    });
});

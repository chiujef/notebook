import { TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

import {
  NoteComponent,
  NoteListComponent,
  NotebookListComponent
} from '../components/index';

import {
  NotebookService,
  NotebookStoreService,
  NoteService,
  NoteStoreService
} from '../components/shared/index';

import {
  NOTE_API_URL,
  NOTEBOOK_API_URL
} from '../components/shared/config';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NoteComponent,
        NoteListComponent,
        NotebookListComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      providers: [
        { provide: 'Window', useValue: window },
        NotebookService,
        { provide: NOTEBOOK_API_URL, useValue: NOTEBOOK_API_URL },
        NotebookStoreService,
        NoteService,
        { provide: NOTE_API_URL, useValue: NOTE_API_URL },
        NoteStoreService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Notebook App'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Notebook App');
  }));

  describe('onResize tests', () => {
    it('should add the offset (-150) to the event\'s innerHeight and save to height', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      const expectedHeight = 100;
      const event = {
        target: {
          innerHeight: 250
        }
      };

      app.onResize(event);

      expect(app.height).toBe(expectedHeight);
    });
  });

  describe('computeHeight tests', () => {
    it('should add the offset (-150) to the height', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      const expectedHeight = 100;

      const actual = app.computeHeight(250);

      expect(actual).toBe(expectedHeight);
    });
  });
});

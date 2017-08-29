import { Inject, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Note } from '../models/note';

import { NOTE_API_URL, NOTEBOOK_API_URL } from '../config';


@Injectable()
export class NoteService {
    constructor(private http: Http,
        @Inject(NOTE_API_URL) private apiUrl: string
    ) { }

    addNote(note: Note): Observable<Note> {
        return this.http
                .post(`${this.apiUrl}`, JSON.stringify(note))
                .map(
                    res => res.json().data as Note
                )
                .catch(this.handleError);
    }

    getNote(noteId: number): Observable<Note> {
        return this.http
                .get(`${this.apiUrl}/${noteId}`)
                .map(
                    res => res.json().data as Note
                )
                .catch(this.handleError);
    }

    getAllNoteByNotebookId(notebookId: number): Observable<Note[]> {
        return this.http
                .get(`${this.apiUrl}/?notebookId=${notebookId}`)
                .map(
                    res => res.json().data as Note[]
                )
                .catch(this.handleError);
    }

    updateNote(note: Note): Observable<Note> {
        return this.http
                .put(`${this.apiUrl}/${note.id}`, JSON.stringify(note))
                .map(
                    res => res.json().data as Note
                )
                .catch(this.handleError);
    }

    deleteNote(noteId: number): Observable<any> {
        return this.http
                .delete(`${this.apiUrl}/${noteId}`)
                .map(
                    res => res.json().data
                )
                .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

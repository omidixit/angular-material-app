import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ISection } from '../models/section';


@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private sectionUrl = "api/sections"; 

    constructor(private httpClient: HttpClient) {}

    getSections(): Observable<ISection[]> {
        return this.httpClient.get<ISection[]>(this.sectionUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError('getSections', []))
        );
    }

    /** GET Section by id. Will 404 if id not found */
    getSection(id: number): Observable<ISection> {
        const url = `${this.sectionUrl}/${id}`;
        return this.httpClient.get<ISection>(url).pipe(
        tap(data => console.log(`fetched Section id=${id}`)),
        catchError(this.handleError<ISection>(`getSection id=${id}`))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { IProduct } from '../models/product';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productUrl = "api/products"; //"api/products.json";
    private _products: BehaviorSubject<IProduct[]>;

    dataStore: {
        products: IProduct[]
    }

    constructor(private httpClient: HttpClient) {
        this.dataStore = { products: [] };
        this._products = new BehaviorSubject<IProduct[]>([]);
    }

    get products(): Observable<IProduct[]> {
        return this._products.asObservable();
    };

    getProducts(): Observable<IProduct[]> {
        return this.httpClient.get<IProduct[]>(this.productUrl).pipe(
            tap(data => {
                this.dataStore.products = data;
                this._products.next(Object.assign({}, this.dataStore).products);
                console.log('All: ' + JSON.stringify(data))
            }),
            catchError(this.handleError('getProducts', []))
        );
    };

    addProduct(product: IProduct): Promise<IProduct> {
        return new Promise((resolver, reject) => {
          product.id = this.dataStore.products.length + 1;
          this.dataStore.products.push(product);
          this._products.next(Object.assign({}, this.dataStore).products);
          resolver(product);
        });
    };

    deleteProduct(product: IProduct): Promise<IProduct> {
        return new Promise((resolver, reject) => {
          this.dataStore.products = this.dataStore.products.filter(p => p !== product);
          this._products.next(Object.assign({}, this.dataStore).products);
          resolver(product);
        });
    };

    productById(id: number) {
        return this.dataStore.products.find(x => x.id == id);
    };

    loadAll() {
    
        return this.httpClient.get<IProduct[]>(this.productUrl)
          .subscribe(data => {
            this.dataStore.products = data;
            this._products.next(Object.assign({}, this.dataStore).products);
          }, error => {
            console.log("Failed to fetch products");
          });
    };

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
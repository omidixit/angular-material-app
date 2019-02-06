import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/product';
import { IFloor } from '../models/floor';
import { ISection } from '../models/section';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const floors: IFloor[] = [
      { id: 1, name: 'Floor 1' },
      { id: 2, name: 'Floor 2' },
      { id: 3, name: 'Floor 3' }
    ];

    const sections: ISection[] = [
      { id: 1, name: 'Section 1' },
      { id: 2, name: 'Section 2' },
      { id: 3, name: 'Section 3' }
    ];

    const products = [];
    
    /* Init default product list*/
    products.push(this.generateProduct(1, 100, 1, 1));
    products.push(this.generateProduct(2, 12, 1, 2));
    products.push(this.generateProduct(3, 1 , 2, 2));
    products.push(this.generateProduct(4, 55, 2, 3));
    products.push(this.generateProduct(5, 24, 3, 3));
    products.push(this.generateProduct(6, 5, 3, 1));

    return { floors, products, sections};
  }

  // Overrides the genId method to ensure that a product always has an id.
  // If the products array is empty,
  // the method below returns the initial number (11).
  // if the products array is not empty, the method below returns the highest
  // product id + 1.
  genProductId(products: IProduct[]): number {
    return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 11;
  }

  //Private methods
  generateProduct(id: number = 0, quantity: number = 0, floor: number = 1, section: number = 1): IProduct { 
    return {id: id, code: this.generateProductCode(), quantity: quantity, floor: floor, section: section};
  }

  generateProductCode(): string {
    return this.generateRandomText() + " " + this.generateRandomNumber();
  }

  generateRandomText(): string {
    var text = "";
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var textLength = this.getNumberLength(2, 5);
    
    for(var i = 0; i < textLength; i++) {
        text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
    }
    
    return text;
  }

  generateRandomNumber(): number {
    var numberLength = this.getNumberLength(4, 7);
    return this.randomFixedInteger(numberLength);
  }

  randomFixedInteger(length: number): number { 
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
  }

  getNumberLength(min: number, max: number): number { 
    let random_number = Math.random() * (max-min) + min; 
    return Math.floor(random_number);
  }
}

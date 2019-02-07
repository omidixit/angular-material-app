import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { IProduct } from '../models/product';
import { IFloor } from '../models/floor';
import { ISection } from '../models/section';
import { ProductService } from '../services/product.service';
import { FloorService } from '../services/floor.service';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  errorMessage: string
  productForm = this.fb.group({
    code: [null, Validators.required],
    quantity: [null, Validators.required],
    floor: [null, Validators.required],
    section: [null, Validators.required]
  });

  floors: IFloor[] = [];
  sections: ISection[] = [];

  constructor(private fb: FormBuilder,
    private floorService: FloorService,
    private sectionService: SectionService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProductComponent>) {}

  ngOnInit(): void {        
    this.floorService.getFloors().subscribe(
        floors => {
            this.floors = floors;
        },
        error => this.errorMessage = <any>error
    );

    this.sectionService.getSections().subscribe(
        sections => {
            this.sections = sections;
        },
        error => this.errorMessage = <any>error
    );
  }
  onSubmit() {
    let product: IProduct = { 
      id: 7, 
      code: this.productForm.value.code,
      quantity: this.productForm.value.quantity,
      floor: this.productForm.value.floor,
      section: this.productForm.value.section 
    };

    this.productService.addProduct(product).then(
      product => {
        console.log(' Product saved! ');
        this.dialogRef.close(product);
      },
      error => this.errorMessage = <any>error
    );
  }

  dismiss() {
    this.dialogRef.close(null);
  }
}

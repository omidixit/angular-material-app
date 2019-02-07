import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';

import { ProductService } from '../services/product.service';
import { FloorService } from '../services/floor.service';
import { SectionService } from '../services/section.service';
import { IProduct } from '../models/product';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNode } from '@angular/material/tree';
import { ITreeNode, ITreeFlatNode } from '../models/treeNode';
import { AddProductComponent } from '../add-product/add-product.component';
import { Observable } from 'rxjs';

const TREE_DATA: ITreeNode[] = [
  { id: 1, name: 'Floors', 
    children: [ 
      { id: 1, name: 'Floor 1'}, 
      { id: 2, name: 'Floor 2'}, 
      { id: 3, name: 'Floor 3'}
    ]
  },
  { id: 2, name: 'Sections', 
    children: [ 
      { id: 1, name: 'Section 1'}, 
      { id: 2, name: 'Section 2'}, 
      { id: 3, name: 'Section 3'}
    ]
  }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  errorMessage: string;
  displayedColumns: string[] = ['select', 'id', 'code', 'quantity', 'floor', 'section'];
  dataSource = new MatTableDataSource<IProduct>();
  selection = new SelectionModel<IProduct>(true, []);

  private transformer = (node: ITreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      id: node.id,
      name: node.name,
      level: level,
    };
  }
    
  treeControl = new FlatTreeControl<ITreeFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private dialog: MatDialog,
    private productService: ProductService) { 
      this.treeDataSource.data = TREE_DATA;
    }

  hasChild = (_: number, node: ITreeFlatNode) => node.expandable;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  ngOnInit(): void {
    console.log(' In OnInit ');
    this.loadProducts();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  performFilter(filterValue: any, filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    if(filterBy == 'code') {
      this.dataSource.filterPredicate = (data: IProduct, filter: string) => 
        (data.code.toLocaleLowerCase().indexOf(filter) !== -1);
    } else if(filterBy.startsWith('floor')) {
      this.dataSource.filterPredicate = (data: IProduct, filter: string) => 
        (data.floor.toString() == filter);
    } else if(filterBy.startsWith('section')) {
      this.dataSource.filterPredicate = (data: IProduct, filter: string) => 
        (data.section.toString() == filter);
    }

    this.applyFilter(filterValue.toString());
}
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }

    setDataSource() {
      //this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.data = this.productService.dataStore.products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    loadProducts() {
      this.productService.getProducts().subscribe(
        products => {
          this.setDataSource();
        },
        error => this.errorMessage = <any>error
      );
    }

    openAddProductDialog() {
      let dialogRef = this.dialog.open(AddProductComponent, {
        width: '450px'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        //this.products.push(result);
        this.setDataSource();
      });
    }

    deleteSelectedProducts() {
      this.selection.selected.forEach(selectedProduct => {
        this.productService.deleteProduct(selectedProduct).then(
          product => {
            console.log(' Product deleted! ');
            this.setDataSource();
          },
          error => this.errorMessage = <any>error
        );
      });
    }
}

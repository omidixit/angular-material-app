import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { ProductService } from '../services/product.service';
import { FloorService } from '../services/floor.service';
import { SectionService } from '../services/section.service';
import { IProduct } from '../models/product';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNode } from '@angular/material/tree';
import { ITreeNode, ITreeFlatNode } from '../models/treeNode';

const ELEMENT_DATA: IProduct[] = [
  {  "id": 1, "code": "MYTZ 123456", "quantity": 100, "floor": 1, "section": 1 },
  {  "id": 2, "code": "UK 13462", "quantity": 12, "floor": 1, "section": 2 },
  {  "id": 3, "code": "KOB 8472", "quantity": 1, "floor": 1, "section": 3 },
  {  "id": 4, "code": "MYTZ 123456", "quantity": 100, "floor": 2, "section": 1 },
  {  "id": 5, "code": "UK 13462", "quantity": 12, "floor": 2, "section": 2 },
  {  "id": 6, "code": "KOB 8472", "quantity": 1, "floor": 2, "section": 3 },
  {  "id": 7, "code": "MYTZ 123456", "quantity": 100, "floor": 3, "section": 1 },
  {  "id": 8, "code": "UK 13462", "quantity": 12, "floor": 3, "section": 2 },
  {  "id": 9, "code": "KOB 8472", "quantity": 1, "floor": 3, "section": 3 },
  {  "id": 10, "code": "MYTZ 123456", "quantity": 100, "floor": 1, "section": 4 },
  {  "id": 11, "code": "UK 13462", "quantity": 12, "floor": 1, "section": 5 },
  {  "id": 12, "code": "KOB 8472", "quantity": 1, "floor": 1, "section": 6 },
  {  "id": 13, "code": "MYTZ 123456", "quantity": 100, "floor": 1, "section": 5 },
  {  "id": 14, "code": "UK 13462", "quantity": 12, "floor": 2, "section": 6 },
  {  "id": 15, "code": "KOB 8472", "quantity": 1, "floor": 3, "section": 4 }
];

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
      { id: 3, name: 'Section 3'}, 
      { id: 4, name: 'Section 4'}, 
      { id: 5, name: 'Section 5'}, 
      { id: 6, name: 'Section 6'}
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
  dataSource = new MatTableDataSource(ELEMENT_DATA);
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

  constructor(private productService: ProductService,
    private floorService: FloorService,
    private sectionService: SectionService) { 
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
}

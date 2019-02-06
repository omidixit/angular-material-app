export interface ITreeNode {
    id: number;
    name: string;
    children?: ITreeNode[];
  }

/** Flat node with expandable and level information */
export interface ITreeFlatNode {
    expandable: boolean;
    id: number;
    name: string;
    level: number;
  }
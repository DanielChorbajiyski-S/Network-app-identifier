export interface ChartData {
  name: string;
  sortTotal: number;
  [key: string]: any; 
}

export interface QueryResult {
  data: ChartData[];
  protocols: string[];
}
interface WorkspaceObj {
  [routerUri: string]: { [endpoint: string]: EndPointMethods };
}
interface EndPointMethods {
  [method: string]: EndPoint;
}
interface EndPoint {
  range: number[];
  config: options;
}
interface options {
  url: string;
  headers: Record<any, never>;
  data: Record<any, never>;
  method: any;
}

interface ExpressionRanges {
  [startLine: number]: number;
}

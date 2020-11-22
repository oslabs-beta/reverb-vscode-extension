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
  method: string;
  url: string;
  headers: Record<any, never>;
  data: Record<any, never>;
}

interface ExpressionRanges {
  [startLine: number]: number;
}

interface node {
  type: string;
  property: {
    name: string;
    loc: {
      start: {
        line: any;
      };
    };
  };
}

interface parent {
  loc: {
    end: {
      line: any;
    };
  };
}

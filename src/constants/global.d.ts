interface WorkspaceObj {
  [routerUri: string]: { [endpoint: string]: EndPoint };
}
interface EndPoint {
  port: number;
  range: number[];
  endPoint: string;
  config: options;
}
interface options {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | undefined;
  url: string;
  headers: Record<any, never>;
  data: Record<any, never>;
}

interface expressionRanges {
  startNum: number;
  endNum: number;
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

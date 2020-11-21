interface WorkspaceObj {
  [routerUri: string]: EndPoint[];
}
interface EndPoint {
  port: number;
  range: number[];
  endPoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  config: Partial<EndpointConfig>;
}
interface EndpointConfig {
  header: {
    key: string;
    value: string;
  }[];
  body: Record<any, never>;
  params: {
    key: string;
    value: string;
  }[];
  query: {
    key: string;
    value: string;
  }[];
  auth: Record<any, never>;
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

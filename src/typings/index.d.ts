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
    params: Record<string, string>;
    method: any;
}

interface ExpressionRanges {
    [startLine: number]: number;
}

interface ExpressionRanges {
    [startLine: number]: number;
}

interface UserConfigObject {
    [path: string]: FullPath[];
}
interface FullPath {
    serverFile: string;
    port: number;
    range: number[];
    config: Config;
}
interface Config {
    url: string;
    headers: Record<any, never>;
    data: Record<any, never>;
    method: any;
}

interface PresetsObject {
    [url: string]: PresetConfig[];
}

interface PresetConfig extends Config {
    name: string;
    default?: boolean;
}

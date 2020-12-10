// Used to store information about the express import statement
interface ExpressData {
    filePath: string;
    importName: string;
    serverName: string;
}

interface RouterData {
    path: string; // Absolute path to the file that contains the router
    baseRoute: string; // The base root of all the routes handled by the router
    importName: string; // The name applied to the router import statement
}

interface Route {
    path: string;
    route: string;
    method: string;
    startLine: number;
    endLine: number;
}

// Used to store information about imported files
interface File {
    path: string; // Absolute path to the server file
    fileName: string; // Name of the server file
    contents: string; // Contents of the server file
}

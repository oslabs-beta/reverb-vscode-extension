import * as patterns from '../constants/expressPatterns';
import * as fileOps from './utils/genericFileOps';
import * as expressOps from './utils/expressFileOps';

// Used to store information about the express import statement
interface ExpressData {
  filePath: string;
  importName: string;
  serverName: string;
}

class ExpressParser {
  serverPort: number;
  serverFile: fileOps.File;
  supportFiles: Map<string, fileOps.File>;
  expressData: Array<ExpressData>;
  routerData: Array<expressOps.RouterData>;
  routes: Array<expressOps.Route>;

  constructor(serverPath: string, portNum: number) {
    this.serverPort = portNum;
    this.serverFile = this.initializeServerFile(serverPath);
    this.supportFiles = new Map();
    this.expressData = [];
    this.routerData = [];
    this.routes = [];
  }

  // Creates a File object containing info about the server file
  initializeServerFile(serverPath: string) {
    // Split the server name and server path
    const MATCH = serverPath.match(patterns.FILENAME_AND_PATH);
    // Return a File object containing the file name and path
    if (MATCH !== null)
      return { path: MATCH[1], fileName: MATCH[2], contents: '' };
    // Return a File object with no values for the file name and path
    return { path: '', fileName: '', contents: '' };
  }

  // Parse all endpoints from the express server
  parse() {
    this.serverFile.contents = fileOps.readFile(this.serverFile);
    this.findSupportFiles();
    this.findExpressImports();
    this.findServerName();
    this.findRouters();
    this.findAllRoutes();
    // Console log data for testing purposes
    console.log(this.routes);
  }

  // Read the contents of all imported files, and all files that they import
  findSupportFiles() {
    // Enqueue all local files that are imported by the top-level server file
    let queue = this.addSupportFiles(
      fileOps.findImportedFiles(this.serverFile),
    );
    // Read and store the contents of each file in the queue
    while (queue.length > 0) {
      const FILE_NAME = queue.shift();
      if (FILE_NAME !== undefined) {
        // Enqueue all local files imported that are imported by the current file
        queue = queue.concat(this.readSupportFile(FILE_NAME));
      }
    }
  }

  // Read the file specified by the key, and identify the files it imports
  readSupportFile(fileName: string) {
    const FILE = this.supportFiles.get(fileName);
    if (FILE !== undefined) {
      // Read the file contents and enqueue any imported files that need to be read
      FILE.contents = fileOps.readFile(FILE);
      return this.addSupportFiles(fileOps.findImportedFiles(FILE));
    }
    // Return an empty array if the provided key does not exist
    return [];
  }

  // Add any imported files to the list of support files, if they haven't already been added
  addSupportFiles(importedFiles: Array<fileOps.File>) {
    const queue = [];
    for (let i = 0; i < importedFiles.length; i += 1) {
      // Check the list of support files to ensure the current file has not alread been read
      const FILE_NAME = importedFiles[i].path.concat(importedFiles[i].fileName);
      if (this.supportFiles.get(FILE_NAME) === undefined) {
        // Queue up the file for parsing
        queue.push(FILE_NAME);
        // Add the file to the list of support files
        this.supportFiles.set(FILE_NAME, importedFiles[i]);
      }
    }
    // Return the list of files that need to be read
    return queue;
  }

  // Searches the code base, starting at the server file, for an express import statement
  findExpressImports() {
    // Check the server file to see if it imports express
    const IMPORT_NAME = expressOps.checkFileForExpress(this.serverFile);
    // If found, store the details of the import
    if (IMPORT_NAME) this.storeExpressImport(this.serverFile, IMPORT_NAME);
    // Search the support files for any express import statements
    this.searchSupportFilesForExpress();
  }

  // Search through the support files for any express import statements
  searchSupportFilesForExpress() {
    const FILE_LIST = this.supportFiles.entries();
    let currentFile = FILE_LIST.next().value;
    while (currentFile !== undefined) {
      // Check the current file to see if it imports express
      const IMPORT_NAME = expressOps.checkFileForExpress(currentFile[1]);
      if (IMPORT_NAME) {
        // If found, store the details of the import
        this.storeExpressImport(currentFile[1], IMPORT_NAME);
      }
      currentFile = FILE_LIST.next().value;
    }
  }

  // Store the filename and variable name associated with the express import
  storeExpressImport(file: fileOps.File, importName: string) {
    const filePath = file.path.concat(file.fileName);
    this.expressData.push({ filePath, importName, serverName: '' });
  }

  // Find the name of the variable associated with each invocation of express
  findServerName() {
    for (let i = 0; i < this.expressData.length; i += 1) {
      // Get the file that contains the express import
      const EXPRESS_FILE =
        this.supportFiles.get(this.expressData[i].filePath) || this.serverFile;
      const EXPRESS_NAME = this.expressData[i].importName;
      // Check the server file to see if it calls express
      const SERVER_NAME = expressOps.checkFileForServer(
        EXPRESS_FILE,
        EXPRESS_NAME,
      );
      // If an express call was found, store the name of the associated variable
      if (SERVER_NAME) this.expressData[i].serverName = SERVER_NAME;
    }
  }

  // Find all routers used by the express server
  findRouters() {
    this.supportFiles.forEach((file, path) => {
      const ROUTERS = expressOps.checkFileForRouters(file, this.serverPort);
      ROUTERS.forEach((router) => {
        const PATH_FOUND = router.importName.match(patterns.REQUIRE_PATH);
        if (PATH_FOUND !== null) {
          const BASE_PATH = fileOps.removeFilenameFromPath(path);
          router.path = fileOps.resolvePath(
            fileOps.mergePaths(BASE_PATH, PATH_FOUND[1]),
          )[0];
        }
        // TO DO: find file associated with router
        else
          expressOps.findPath(file.contents, path, router, this.supportFiles);
      });
      this.routerData = this.routerData.concat(ROUTERS);
    });
  }

  // Finds all routes in the express file and router files
  findAllRoutes() {
    const BASE_ROUTE = 'http//localhost:' + this.serverPort;
    const PATH = this.serverFile.path.concat(this.serverFile.fileName);
    expressOps.findRoutes(this.serverFile.contents, PATH, BASE_ROUTE);
    for (let i = 0; i < this.routerData.length; i += 1) {
      const FILE = this.supportFiles.get(this.routerData[i].path);
      if (FILE !== undefined) {
        this.routes = this.routes.concat(
          expressOps.findRoutes(
            FILE.contents,
            this.routerData[i].path,
            this.routerData[i].baseRoute,
          ),
        );
      }
    }
  }
}

export default ExpressParser;

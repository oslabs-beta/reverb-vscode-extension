/**
 * @fileoverview ExpressParser class for parsing and modeling express server information
 */

const pathUtil = require('path');
import { getRanges } from './utils/ast';
// Regex patterns used for file parsing
import {
  FILENAME_AND_PATH,
  REQUIRE_PATH,
  REQUIRED_PATH_JOIN,
} from '../constants/expressPatterns';
// File and path manipulation functions
import {
  readFile,
  findImportedFiles,
  resolvePath,
  getLocalPath,
  getLocalRoute,
} from './utils/genericFileOps';
// Express specific file operations
import {
  findExpressImport,
  findExpressServer,
  findRouters,
  findPath,
  findRoutes,
  findRouterPath,
} from './utils/expressFileOps';

/** Class representing parsed express server data */
class ExpressParser {
  serverPort: number;
  serverFile: File;
  supportFiles: Map<string, File>;
  expressData: ExpressData[];
  routerData: Map<string, RouterData>;
  routes: Route[];

  /**
   * Creates a new ExpressParser object
   * @param {string} serverPath The path of the top-level server file
   * @param {number} portNum The port number on which the server is running
   */
  constructor(serverPath: string, portNum: number) {
    this.serverPort = portNum;
    this.serverFile = this.initializeServerFile(serverPath);
    this.supportFiles = new Map();
    this.expressData = [];
    this.routerData = new Map();
    this.routes = [];
  }

  /**
   * Creates a File object containing info about the server file
   * @param {string} serverPath The path of the top-level server file
   * @return {File} A File object containing info about the server file
   */
  initializeServerFile(serverPath: string): File {
    const SPLIT_PATH = serverPath.match(FILENAME_AND_PATH);
    if (SPLIT_PATH !== null)
      return { path: SPLIT_PATH[1], fileName: SPLIT_PATH[2], contents: '' };
    // Return a File object with no values for the file name and path
    return { path: '', fileName: '', contents: '' };
  }

  /**
   * Parses all endpoints from the express server
   * @return {WorkspaceObj} A WorkspaceObj object containing info for all endpoints in the server
   */
  parse(): WorkspaceObj {
    this.serverFile.contents = readFile(this.serverFile);
    this.findSupportFiles();
    this.findExpressImports();
    this.findServerName();
    this.findRouterFiles(this.serverFile);
    this.supportFiles.forEach((file) => this.findRouterFiles(file));
    this.findAllRoutes();
    this.findRouteEndLines();
    return this.buildWorkspaceObject();
  }

  /**
   * Finds all files imported by the top-level server file, and all files that they import
   */
  findSupportFiles() {
    // Enqueue all local files that are imported by the top-level server file
    let queue = this.addSupportFiles(findImportedFiles(this.serverFile));
    let currentFile = queue.shift();
    while (currentFile !== undefined) {
      // Read and store the contents of each file and enqueue all files they import
      queue = queue.concat(this.readSupportFile(currentFile));
      currentFile = queue.shift();
    }
  }

  /**
   * Adds any imported files to the list of support files, if they haven't already been added
   * @param {File[]} importedFiles The files to add to the list of support files
   * @return {string[]} An array containing the names of the files that were successfully added
   */
  addSupportFiles(importedFiles: File[]): string[] {
    const addedFiles = [];
    for (let i = 0; i < importedFiles.length; i += 1) {
      const FILE_NAME = importedFiles[i].path.concat(importedFiles[i].fileName);
      // Only add files that haven't already been added to the list of support files
      if (this.supportFiles.get(FILE_NAME) === undefined) {
        this.supportFiles.set(FILE_NAME, importedFiles[i]);
        addedFiles.push(FILE_NAME);
      }
    }
    return addedFiles;
  }

  /**
   * Reads the contents of the specified file into memory and
   * adds any files it imports to the list of support files
   * @param {string} fileName The file to read
   * @return {string[]} An array containing the names of the imported files that were added
   */
  readSupportFile(fileName: string): string[] {
    let addedFiles: string[] = [];
    const FILE = this.supportFiles.get(fileName);
    if (FILE !== undefined) {
      // Read the file contents and enqueue any imported files that need to be read
      FILE.contents = readFile(FILE);
      addedFiles = this.addSupportFiles(findImportedFiles(FILE));
    }
    return addedFiles;
  }

  /**
   * Finds and stores any express import statements in the code base,
   * starting at the top-level server file
   */
  findExpressImports() {
    // Search the top-level serverfile for any express importes
    const IMPORT_NAME = findExpressImport(this.serverFile);
    if (IMPORT_NAME !== undefined) {
      this.storeExpressImport(this.serverFile, IMPORT_NAME);
    }
    // Search the support files for any express import statements
    this.searchSupportFilesForExpress();
  }

  /**
   * Finds and stores any express import statements in the support files
   */
  searchSupportFilesForExpress() {
    const FILE_LIST = this.supportFiles.entries();
    let currentFile = FILE_LIST.next().value;
    while (currentFile !== undefined) {
      const IMPORT_NAME = findExpressImport(currentFile[1]);
      if (IMPORT_NAME !== undefined) {
        // If the file imports express, store the details of the express import
        this.storeExpressImport(currentFile[1], IMPORT_NAME);
      }
      currentFile = FILE_LIST.next().value;
    }
  }

  /**
   * Stores the filename and variable name associated with the express import
   * @param file The file containing the express import statement
   * @param importName The name of the variable assigned to the express import
   */
  storeExpressImport(file: File, importName: string) {
    const filePath = file.path.concat(file.fileName);
    this.expressData.push({ filePath, importName, serverName: '' });
  }

  /**
   * Find the name of the variable used to store each invocation of express
   */
  findServerName() {
    for (let i = 0; i < this.expressData.length; i += 1) {
      // Use the server file if an error occurs in obtaining the correct support file
      const EXPRESS_FILE =
        this.supportFiles.get(this.expressData[i].filePath) || this.serverFile;
      const EXPRESS_NAME = this.expressData[i].importName;
      // If an express call was found, store the name of the associated variable
      const SERVER_NAME = findExpressServer(EXPRESS_FILE, EXPRESS_NAME);
      if (SERVER_NAME) this.expressData[i].serverName = SERVER_NAME;
    }
  }

  /**
   * Identifies all router files used by the express server
   */
  findRouterFiles(file: File) {
    const ROUTERS = findRouters(file, this.serverPort);
    ROUTERS.forEach((router) => {
      // Determine the absolute file path for each router identified
      router.path = findRouterPath(router, file, this.supportFiles);
      this.routerData.set(router.path, router);
    });
  }
  /**
   * Finds all routes in the top-level server file and all support files
   */
  findAllRoutes() {
    const BASE_ROUTE = 'http://localhost:' + this.serverPort;
    const PATH = this.serverFile.path.concat(this.serverFile.fileName);
    // Find all routes in the top-level server file
    this.routes = findRoutes(this.serverFile.contents, PATH, BASE_ROUTE);
    // Find all routes in each support file
    this.supportFiles.forEach((file) => {
      let route = BASE_ROUTE;
      // If the support file is a router file, get the base route for all routes in the file
      const ROUTER_DATA = this.routerData.get(file.path + file.fileName);
      if (ROUTER_DATA !== undefined) route = ROUTER_DATA.baseRoute;
      this.routes = this.routes.concat(
        findRoutes(file.contents, file.path + file.fileName, route),
      );
    });
  }

  /**
   * Find the ending line of any route functions
   */
  findRouteEndLines() {
    this.routes.forEach((route) => {
      const ROUTER_FILE = this.supportFiles.get(route.path) || this.serverFile;
      const FILE_RANGES = getRanges(ROUTER_FILE.contents);
      route.endLine = FILE_RANGES[route.startLine];
    });
  }

  /**
   * Builds the Workspace object used to model all routes in the express server
   * @return {WorkspaceObj} The Workspace object
   */
  buildWorkspaceObject(): WorkspaceObj {
    const output: WorkspaceObj = {};
    this.routes.forEach((route) => {
      // Trim unnecessary info from the path and route for improved readability
      const LOCAL_PATH = getLocalPath(route.path);
      const LOCAL_ROUTE = getLocalRoute(route.route);
      // Add new path/route objects if no routes have been added for the current path/route
      if (output[LOCAL_PATH] === undefined) output[LOCAL_PATH] = {};
      if (output[LOCAL_PATH][LOCAL_ROUTE] === undefined) {
        output[LOCAL_PATH][LOCAL_ROUTE] = {};
      }
      // Store the route information for the current route/method
      output[LOCAL_PATH][LOCAL_ROUTE][route.method.toUpperCase()] = {
        range: [route.startLine, route.endLine],
        config: {
          method: route.method.toUpperCase(),
          url: route.route,
          headers: {},
          data: {},
        },
      };
    });
    return output;
  }
}

export default ExpressParser;

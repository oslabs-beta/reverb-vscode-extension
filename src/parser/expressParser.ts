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
  serverFile: fileOps.File;

  supportFiles: Map<string, fileOps.File>;

  expressData: ExpressData;

  constructor(serverPath: string) {
    this.serverFile = this.initializeServerFile(serverPath);
    this.supportFiles = new Map();
    this.expressData = { filePath: '', importName: '', serverName: '' };
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
    this.findExpressImport();
    this.findServerName();
    // Console log data for testing purposes
    console.log('SERVER FILE: ', this.serverFile);
    console.log('EXPRESS DATA: ', this.expressData);
    console.log('SUPPORT FILES:');
    this.supportFiles.forEach((el, key) => console.log('FILE: ', key, el));
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
  findExpressImport() {
    // Check the server file to see if it imports express
    const IMPORT_NAME = expressOps.checkFileForExpress(this.serverFile);
    // If found, store the details of the import
    if (IMPORT_NAME) this.storeExpressImport(this.serverFile, IMPORT_NAME);
    // Otherwise, search the support files until an express import statement is found
    else this.searchSupportFilesForExpress();
  }

  // Search through the support files until an express import statement is found
  searchSupportFilesForExpress() {
    const FILE_LIST = this.supportFiles.entries();
    let currentFile = FILE_LIST.next().value;
    while (currentFile !== undefined) {
      // Check the current file to see if it imports express
      const IMPORT_NAME = expressOps.checkFileForExpress(currentFile[1]);
      if (IMPORT_NAME) {
        // If found, store the details of the import
        this.storeExpressImport(currentFile[1], IMPORT_NAME);
        break;
      }
      currentFile = FILE_LIST.next().value;
    }
  }

  // Store the filename and variable name associated with the express import
  storeExpressImport(file: fileOps.File, importName: string) {
    const filePath = file.path.concat(file.fileName);
    this.expressData = { filePath, importName, serverName: '' };
  }

  // Find the name of the variable associated with the invocation of express
  findServerName() {
    // Get the file that contains the express import
    const EXPRESS_FILE =
      this.supportFiles.get(this.expressData.filePath) || this.serverFile;
    const EXPRESS_NAME = this.expressData.importName;
    // Check the server file to see if it calls express
    const SERVER_NAME = expressOps.checkFileForServer(
      EXPRESS_FILE,
      EXPRESS_NAME,
    );
    // If an express call was found, store the name of the associated variable
    if (SERVER_NAME) this.expressData.serverName = SERVER_NAME;
  }
}

export default ExpressParser;

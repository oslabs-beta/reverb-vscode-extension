import * as patterns from '../constants/expressPatterns';
import * as fileOps from './utils/genericFileOps';
import * as expressOps from './utils/expressFileOps';

// Used to store information about the express import statement
interface ExpressImport {
  filePath: string;
  importName: string;
}

class ExpressParser {
  serverFile: fileOps.File;

  supportingFiles: Map<string, fileOps.File>;

  parsingQueue: Array<string>;

  expressImport: ExpressImport;

  constructor(serverPath: string){
    let path = ''; 
    let fileName = '';
    // Split the server name and server path
    const MATCH = serverPath.match(patterns.FILENAME_AND_PATH);
    if( MATCH ) {
      path += MATCH[1];
      fileName += MATCH[2];
    }
    this.serverFile = { path, fileName, contents: '' };
    this.parsingQueue = [];
    this.supportingFiles = new Map();
    this.expressImport = {filePath: '', importName: ''};
  }

  // Parse all endpoints from the express server
  parse() {
    // Read the top level server file into memory and identify all files it imports
    this.serverFile.contents = fileOps.readFile(this.serverFile);
    this.addSupportingFiles(fileOps.findImportedFiles(this.serverFile));
    this.findRemainingServerFiles();
    // Locate the location of the Express import statement 
    this.findExpressImport();
    console.log("SERVER FILE: ", this.serverFile);
    console.log("EXPRESS IMPORT: ", this.expressImport);
    console.log("SUPPORTING FILES:");
    this.supportingFiles.forEach((el, key) => console.log("FILE: ", key, el));
  }

  // Add any imported files to the list of supporting files, if they haven't already been added
  addSupportingFiles(importedFiles: Array<fileOps.File>) {
    for(let i = 0; i < importedFiles.length; i += 1) {
      const FILE = importedFiles[i].path.concat(importedFiles[i].fileName);
      if (this.supportingFiles.get(FILE) === undefined) {
        // Queue up the file for parsing
        this.parsingQueue.push(FILE);
        // Add the file to the list of supporting files
        this.supportingFiles.set(FILE, importedFiles[i]);
      }
    }
  }

   // Read the contents of all imported files, and identify all files that they import
  findRemainingServerFiles() {
    while(this.parsingQueue.length > 0) {
      // Shift the first file out of the queue to be parsed
      const CURRENT_KEY = this.parsingQueue.shift();
      if (CURRENT_KEY === undefined) return; // Check required by typescript
      const CURRENT_FILE = this.supportingFiles.get(CURRENT_KEY);
      if(CURRENT_FILE === undefined) return; // Check required by typescript

      // Read the file contents and store check for any file imports
      CURRENT_FILE.contents = fileOps.readFile(CURRENT_FILE);
      this.addSupportingFiles(fileOps.findImportedFiles(CURRENT_FILE));
    }
  }

  // Searches the code base, starting at the server file, for an express import statement
  findExpressImport() {
    // Check the server file for the express import statement
    let importName = expressOps.checkFileForExpress(this.serverFile);
    if ( importName !== undefined ) {
      // If found, store the import statement, and associated file
      const filePath = this.serverFile.path.concat(this.serverFile.fileName);
      this.expressImport = {filePath, importName};
      return;
    }
    // Otherwise, search the other files until an express import statement is found
    const FILE_LIST = this.supportingFiles.entries();
    let currentFile = FILE_LIST.next().value;
    while (currentFile !== undefined) {
      importName = expressOps.checkFileForExpress(currentFile[1]);
      if ( importName !== undefined ) {
        // If found, store the import statement, and associated file
        const filePath = currentFile[0];
        this.expressImport = {filePath, importName};
        return;
      }
      currentFile = FILE_LIST.next().value;
    }
  }
};

export default ExpressParser;
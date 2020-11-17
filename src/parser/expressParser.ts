import * as patterns from '../constants/expressPatterns';

const fs = require('fs');

// Used to store information about imported files
interface File {
  path: string; // Absolute path to the server file
  fileName: string; // Name of the server file
  importedFiles: Array<string>; // All local files that are imported into the server file
  contents: string; // Contents of the server file
};

// Used to store information about the server file
interface ExpressFile extends File {
  importName: string; // Name applied to the express import statement
  name: string; // Name applied to the express server
};

class ExpressParser {
  serverFile: ExpressFile;

  importedFiles: Array<File>;

  constructor(serverPath: string){
    let path = ''; 
    let fileName = '';
    // Split the server name and server path
    const MATCH = serverPath.match(patterns.FILENAME_AND_PATH);
    if( MATCH ) {
      path += MATCH[1];
      fileName += MATCH[2];
    }
    this.serverFile = { path, fileName, importedFiles: [], importName: '', name: '', contents: '' };
    this.importedFiles = [];
  }

  // Parse all endpoints from the express server
  parse() {
    this.readServerFile();
    this.findImportedFiles();
    this.findExpressImport();
  }

  // Read the contents of the server file into memory for parsing
  readServerFile(){
    const { path, fileName } = this.serverFile;
    const FILE_CONTENTS = fs.readFileSync(path + fileName, { encoding:'utf8', flag:'r' });
    this.serverFile.contents = FILE_CONTENTS;
  }

  // Find all imported/required local files in the server file
  findImportedFiles() {
    const LINES = this.serverFile.contents.split('\n');
    for( let i = 0; i < LINES.length; i += 1 ) {
      // Check the line for an import or require statement
      let importedPackage = LINES[i].match(patterns.IMPORTED_FILES);
      if( importedPackage === null ) importedPackage = LINES[i].match(patterns.REQUIRED_FILES);
      // Store the imported package if one was found
      if( importedPackage ) {
        // TO DO: determine file path of imported package
        // this.serverFile.importedFiles.push(importedPackage[1]);
      }
    }
  }

  // Attempt to parse the name applied to the express import statement from the server file
  findExpressImport() {
    const LINES = this.serverFile.contents.split('\n');
    for( let i = 0; i < LINES.length; i += 1 ) {
      // Check the current line for all possible variations of an express import statement
      if( this.checkForExpressImport(LINES[i]) ) return true;
      if( this.checkForRequireExpress(LINES[i]) ) return true;
    }
    return false;
  }

  // Check each line in the server file for an express import statement
  checkForExpressImport(line: string) {
    let importFound = false;  
    const MATCH = line.match(patterns.IMPORT_EXPRESS);
    // If a match is found, store the name applied to the express import statement
    if( MATCH !== null ) {
      const importName = MATCH[1];
      this.serverFile.importName = importName;
      importFound = true;
    }
    return importFound;
  }

  // Check each line in the server file for a require express statement
  checkForRequireExpress(line: string) {
    let importFound = false;   
    const MATCH = line.match(patterns.REQUIRE_EXPRESS);
    // If a match is found, store the name applied to the express import statement
    if( MATCH !== null ) {
      const importName = MATCH[1];
      this.serverFile.importName = importName;
      importFound = true;
    }
    return importFound;
  }
};

export default ExpressParser;
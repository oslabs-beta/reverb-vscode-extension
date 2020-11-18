import * as patterns from '../../constants/expressPatterns';

const fs = require('fs');
const pathUtil = require('path');

// Used to store information about imported files
export interface File {
  path: string; // Absolute path to the server file
  fileName: string; // Name of the server file
  contents: string; // Contents of the server file
};

// Read the contents of the specified file
export const readFile = (file: File) => {
  const { path, fileName } = file;
  const FILE_CONTENTS = fs.readFileSync(path + fileName, { encoding:'utf8', flag:'r' });
  return FILE_CONTENTS;
};

// Create a File object for each path in the file list
const createFileObjects = (fileList: Array<string>) => {
  const OUTPUT: Array<File> = [];
  for(let i = 0; i < fileList.length; i += 1 ) {
    const PATH = fileList[i];
    // Split the extract the file name from the merged path
    const MATCH = PATH.match(patterns.FILENAME_AND_PATH);
    // Create a file object using the file name and path
    if( MATCH ) OUTPUT.push({ path: MATCH[1], fileName: MATCH[2], contents: ''});
  }
  // If there was en error, return null
  return OUTPUT;
};

// Merges a file's relative path with the path of the file into which it is being imported
const mergePaths = (parentPath: string, importPath: string) => {
  // Repeatedly check the imported file's path for "../" at the beginning
  while (importPath[0] === '.' && importPath[1] === '.') {
    // If found, go up one level in the root directory
    const PARENT_DIR = parentPath.match(patterns.PARENT_DIRECTORY);
    if( PARENT_DIR !== null) {
      const NEW_ROOT = PARENT_DIR[1];
      parentPath = NEW_ROOT;
    }
    // Remove the "../"from the beginning of the file path
    importPath = importPath.substring(3);
  }
  // Remove any remaining "./" from the path
  if (importPath[0] === '.' && importPath[1] === '/') importPath = importPath.substring(2);
  // The root path and relative path are now ready to combine
  return parentPath + importPath;
};

// Returns the path to the imported/required file in the specified line, if one exists
const parseLineForImport = (filePath: string, line: string) => {
  let mergedPath = '';
  // Check line for an import or require statement
  let importedFile = line.match(patterns.IMPORTED_FILES);
  if( importedFile === null ) importedFile = line.match(patterns.REQUIRED_FILES);
  // If found, merge the parent path and import path into a single path
  if( importedFile ) mergedPath = mergePaths(filePath, importedFile[1]);
  return mergedPath;
};

// Recursively searches a directory to find all .js and .ts files
const findCodeFiles = (path: string) => {
  const codeFiles : Array<string> = [];
  // Read all files/folders in the specified directory
  const dirContents: any = fs.readdirSync(path);
  // Loop through each item in the current dir
  let files = dirContents.map((content: string) => {
    const resource = pathUtil.resolve(path, content);
    // If a folder, find the files within, otherwise store the file name
    return fs.statSync(resource).isDirectory() ? findCodeFiles(resource) : resource;
  });
  // Flatten the array of files
  files = files.flat(Infinity);
  // Reduce the list down to only javascript/typescript files
  files.forEach((file: string) => {
    if(file.match(patterns.CODE_FILE)) codeFiles.push(file);
  });
  return codeFiles;
};

// Returns an array of File objects for each file in the specified path
const resolvePath = (path: string) => {
  // If the path exists, check if it is a directory or file
  if(fs.existsSync(path)) {
    return fs.statSync(path).isDirectory() ? findCodeFiles(path) : [ path ];
  }
  // If the path does not exist, check if it is missing a .js file extension
  const JS_PATH = path.concat(".js");
  if(fs.existsSync(JS_PATH)){
    return fs.statSync(JS_PATH).isDirectory() ? findCodeFiles(JS_PATH) : [ JS_PATH ];
  }
  // If the path does not exist, check if it is missing a .ts file extension
  const TS_PATH = path.concat(".ts");
  if(fs.existsSync(TS_PATH)){
    return fs.statSync(TS_PATH).isDirectory() ? findCodeFiles(TS_PATH) : [ TS_PATH ];
  }
  // The file does not exist
  return [];
};

// Find all imported/required local files in the specified file
export const findImportedFiles = (file: File) => {
  let output: Array<File>  = [];
  const LINES = file.contents.split('\n');
  // Check each line in the file for an import/require statement
  for( let i = 0; i < LINES.length; i += 1 ) {
    const filePath = parseLineForImport(file.path, LINES[i]);
    if (filePath !== '') {
      // Get all file paths for the specified path
      const FILE_LIST = resolvePath(filePath);
      output = output.concat(createFileObjects(FILE_LIST));
    }
  }
  // Return all imported files found in the file
  return output;
};

/**
 * @fileoverview Functions for finding/reading files within a workspace
 */

import { workspace } from 'vscode';
// Regex patterns used for file parsing
import {
  FILENAME_AND_PATH,
  IMPORTED_FILES,
  REQUIRED_FILES,
  REQUIRED_PATH_JOIN,
  CODE_FILE,
  NEW_LINE,
} from '../../constants/expressPatterns';

const fs = require('fs');
const pathUtil = require('path');

/**
 * Reads the contents of the specified file
 * @param {File} file The file to read
 * @return {string} The contents of the specified file
 */
export const readFile = (file: File): string => {
  const { path, fileName } = file;
  return fs.readFileSync(path + fileName, { encoding: 'utf8', flag: 'r' });
};

/**
 * Creates a File object for each path in the specified file list
 * @param {string[]} fileList The list of files for which to create objects
 * @return {File[]} An array containing all of the generated File objects
 */
const createFileObjects = (fileList: string[]): File[] => {
  const output: File[] = [];
  fileList.forEach((path) => {
    // Split the extract the file name from the merged path
    const PATH_SPLIT = path.match(FILENAME_AND_PATH);
    if (PATH_SPLIT)
      // Create a file object using the file name and path
      output.push({
        path: PATH_SPLIT[1],
        fileName: PATH_SPLIT[2],
        contents: '',
      });
  });
  return output;
};

/**
 * Searches the specified line for any imported/required files
 * @param {string} filePath The absolute path of the file being searched
 * @param {string} line The line to search
 * @return {string} Either the absolute path of the imported/required file,
 *   or an empty string if no imported/required file was found
 */
const parseLineForImport = (filePath: string, line: string): string => {
  const FILE_IMPORTED = line.match(IMPORTED_FILES);
  if (FILE_IMPORTED) return pathUtil.join(filePath, FILE_IMPORTED[1]).replace(/\\/g, '/');

  const FILE_REQUIRED = line.match(REQUIRED_FILES);
  if (FILE_REQUIRED) return pathUtil.join(filePath, FILE_REQUIRED[1]).replace(/\\/g, '/');

  const JOIN_FILE_REQUIRED = line.match(REQUIRED_PATH_JOIN);
  if (JOIN_FILE_REQUIRED) return pathUtil.join(filePath, JOIN_FILE_REQUIRED[1]).replace(/\\/g, '/');
  return '';
};

/**
 * Recursively searches a directory for all .js and .ts files
 * @param {string} path The path to search
 * @return {string[]} An array containing all .js and .ts files found in the specified path
 */
const findCodeFiles = (path: string): string[] => {
  const codeFiles: string[] = [];
  const DIR_CONTENTS = fs.readdirSync(path);
  // Loop through each file/folder in the specified directory
  let files = DIR_CONTENTS.map((content: string) => {
    // Replace any backslashes in the path with forward slashes (for Windows users)
    const resource = pathUtil.resolve(path, content).replace(/\\/g, '/');
    // If item is a folder find the files within, otherwise store the file name
    return fs.statSync(resource).isDirectory()
      ? findCodeFiles(resource)
      : resource;
  });
  files = files.flat(Infinity);
  // Reduce the list down to only javascript/typescript files
  files.forEach((file: string) => {
    if (file.match(CODE_FILE)) codeFiles.push(file);
  });
  return codeFiles;
};

/**
 * Generates an array of all .js/ts files located at the specified path
 * @param {string} path The path to search
 * @return {string[]} An array containing all .js and .ts files found in the specified path
 */
export const resolvePath = (path: string): string[] => {
  if (fs.existsSync(path)) {
    return fs.statSync(path).isDirectory() ? findCodeFiles(path) : [path];
  }
  // If the path does not exist, check if it is missing a .js file extension
  const JS_PATH = path.concat('.js');
  if (fs.existsSync(JS_PATH)) {
    return fs.statSync(JS_PATH).isDirectory()
      ? findCodeFiles(JS_PATH)
      : [JS_PATH];
  }
  // If the path does not exist, check if it is missing a .ts file extension
  const TS_PATH = path.concat('.ts');
  if (fs.existsSync(TS_PATH)) {
    return fs.statSync(TS_PATH).isDirectory()
      ? findCodeFiles(TS_PATH)
      : [TS_PATH];
  }
  // The path is invalid
  return [];
};

/**
 * Finds all imported/required local files in the specified file
 * @param {File} file The file to search
 * @return {File[]} An array containing File objects for all files
 *   imported/required by the specified file
 */
export const findImportedFiles = (file: File): File[] => {
  let output: File[] = [];
  // Check each line in the file's contents for an import/require statement
  file.contents.split(NEW_LINE).forEach((line) => {
    const IMPORT_PATH = parseLineForImport(file.path, line);
    if (IMPORT_PATH !== '') {
      // Create File objects for all files located at the import path
      const FILE_LIST = resolvePath(IMPORT_PATH);
      output = output.concat(createFileObjects(FILE_LIST));
    }
  });
  return output;
};

/**
 * Returns the relative path from the user's workspace to the absolute path provided
 * @param {string} fullPath The absolute path to trim
 * @return {string} The relative path
 */
export const getLocalPath = (fullPath: string) => {
  let basePath = workspace.rootPath;
  if (basePath) {
    // Replace any backslashes in the path with forward slashes (for Windows users)
    basePath = basePath.replace(/\\/g, '/');

    const PATH_FOUND = fullPath.match(new RegExp(basePath + '\\/(\\S*)'));
    if (PATH_FOUND) return PATH_FOUND[1];
  }
  // Return the original path if there was no match
  return fullPath;
};

/**
 * Strips the "http://" from the beginning of a route
 * @param {string} fullRoute The full route
 * @return {string} The stripped path
 */
export const getLocalRoute = (fullRoute: string) => {
  // Split ro remove the "http://" from the route
  const ROUTE_FOUND = fullRoute.match(/http:\/\/(\S*)/);
  if (ROUTE_FOUND) return ROUTE_FOUND[1];
  // Return the original route if there was no match
  return fullRoute;
};

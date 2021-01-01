import path from 'path';
import fs from 'fs';
import { workspace } from 'vscode';

interface File {
    path: string;
    contents: string;
}
// Search through the contents of the specified file for ".listen" and "port" (case insensitive)
const isPortFile = (file: File) => {
    let hasListen = false;
    let hasPort = false;
    const LINES = file.contents.split('\n');
    for (const LINE of LINES) {
        if (LINE.match(/\.listen/i)) {
            hasListen = true;
        }
        if (LINE.match(/port/i)) {
            hasPort = true;
        }
        if (hasListen && hasPort) {
            break;
        }
    }
    // Return true if it has both, false otherwise
    return hasListen && hasPort;
};
// Check the contents of each file to see if it is a port file
const findPortFiles = (codeFileContents: File[]) => {
    const portFiles: string[] = [];
    for (const codeFileContent of codeFileContents) {
        if (isPortFile(codeFileContent)) {
            portFiles.push(codeFileContent.path);
        }
    }
    return portFiles;
};
// Find the file in the user's workspace that contains their express server
const readCodeFiles = (codeFileNames: string[]) => {
    const fileContents: File[] = [];
    for (const file of codeFileNames) {
        // Read the contents of each code file
        const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
        fileContents.push({ path: file, contents: data });
    }
    // Return an array of file objects
    return fileContents;
};
// Find all javascript/typescript files in the workspace
const findCodeFiles = (dir: string | undefined) => {
    // Handle case where no workspace is open
    if (dir === undefined) {
        return [];
    }
    const codeFiles: Array<string> = [];
    // Read all files/folders in the specified directory
    const dirContents: any = fs.readdirSync(dir);
    // Loop through each item in the current directory
    let files = dirContents.map((content: string) => {
        // Ignore the node_modules folder
        if (['node_modules', 'dist', 'out', 'build'].includes(content)) {
            return '';
        }

        const resource = path.resolve(dir, content).replace(/\\/g, '/');

        // If a folder, find the files within, otherwise store the file name
        return fs.statSync(resource).isDirectory() ? findCodeFiles(resource) : resource;
    });
    // Flatten the array of files
    files = files.flat(Infinity);
    // Reduce the list down to only javascript/typescript files
    files.forEach((file: string) => {
        if (file.match(/.*\.(js|ts)$/)) {
            codeFiles.push(file);
        }
    });

    return codeFiles;
};

let pathStr = workspace.workspaceFolders![0].uri.path;
if (pathStr[2] === ':') pathStr = pathStr.slice(1);
const codeFileNames: string[] = findCodeFiles(pathStr);
const codeFileContents: File[] = readCodeFiles(codeFileNames);

export default function getServerPaths() {
    return findPortFiles(codeFileContents);
}

/**
 * @fileoverview Functions for parsing express-specific information from File objects
 */

const pathUtil = require('path');
import { resolvePath } from './genericFileOps';
// Regex patterns used for file parsing
import {
  NEW_LINE,
  IMPORT_EXPRESS,
  REQUIRE_EXPRESS,
  USE_ROUTER,
  EXPRESS_ROUTE,
  REQUIRE_PATH,
  MULTI_LINE_ROUTE,
  ROUTE_ENDPOINT,
} from '../../constants/expressPatterns';

/**
 * Searches the contents of specified file for an express import/require statement
 * @param {File} file The file to search
 * @return {string | undefined} Either the namespace assigned to express in the current file,
 *   or undefined if no import/require statement was found
 */
export const findExpressImport = (file: File): string | undefined => {
  const LINES = file.contents.split(NEW_LINE);
  // Check each line in the file for known ways to import express
  for (let i = 0; i < LINES.length; i += 1) {
    const IMPORT_FOUND = LINES[i].match(IMPORT_EXPRESS);
    if (IMPORT_FOUND) return IMPORT_FOUND[1];

    const REQUIRE_FOUND = LINES[i].match(REQUIRE_EXPRESS);
    if (REQUIRE_FOUND) return REQUIRE_FOUND[1];
  }
  return undefined;
};

/**
 * Searches the specified line for an express invocation
 * @param {string} line The line to search
 * @param {string} expressName The namespace assigned to express in the current file
 * @return {string | undefined} Either the variable name of the express server,
 *   or undefined if no import/require statement was found
 */
const findExpressInvocation = (
  line: string,
  expressName: string,
): string | undefined => {
  const SERVER_PATTERN = new RegExp('(\\S+)\\s*=\\s*' + expressName + '\\(\\)');
  const INVOCATION_FOUND = line.match(SERVER_PATTERN);
  return INVOCATION_FOUND ? INVOCATION_FOUND[1] : undefined;
};

/**
 * Searches the specified line for an for express.Application
 * @param {string} line The line to search
 * @param {string} expressName The namespace assigned to express in the current file
 * @return {string | undefined} Either the variable name of the express server,
 *   or undefined if no import/require statement was found
 */
const findExpressApplication = (
  line: string,
  expressName: string,
): string | undefined => {
  const SERVER_PATTERN = new RegExp(
    '\\(\\s*(\\S+)\\s*:\\s*' + expressName + '\\.Application\\)',
  );
  const APPLICATION_FOUND = line.match(SERVER_PATTERN);
  return APPLICATION_FOUND ? APPLICATION_FOUND[1] : undefined;
};

/**
 * Search the specified file for the declaration of an express server
 * @param {File} file The file to search
 * @param {string} expressName The namespace assigned to express in the current file
 * @return {string | undefined} Either the name of the variable assigned to the express
 *   server, or undefined if no import/require statement was found
 */
export const findExpressServer = (
  file: File,
  expressName: string,
): string | undefined => {
  const LINES = file.contents.split(NEW_LINE);
  // Check each line in the file for known variations of express server declaration
  for (let i = 0; i < LINES.length; i += 1) {
    const INVOCATION = findExpressInvocation(LINES[i], expressName);
    if (INVOCATION !== undefined) return INVOCATION;

    const APPLICATION = findExpressApplication(LINES[i], expressName);
    if (APPLICATION !== undefined) return APPLICATION;
  }
  return undefined;
};

/**
 * Search the specified line for an express router
 * @param {string} line The file to search
 * @param {number} portNum The port number being used by the server
 * @return {RouterData[]} An array containing a RouterData object if a router was found
 */
export const findRouter = (line: string, portNum: number): RouterData[] => {
  const ROUTER_FOUND = line.match(USE_ROUTER);
  if (ROUTER_FOUND) {
    const LOCAL_ROUTE = ROUTER_FOUND[1] === '/' ? '' : ROUTER_FOUND[1];
    const ROUTER_NAME = ROUTER_FOUND[2];
    return [
      {
        path: '',
        baseRoute: 'http://localhost:' + portNum + LOCAL_ROUTE,
        importName: ROUTER_NAME,
      },
    ];
  }
  return [];
};

/**
 * Search the contents of the specified file for any routers used by the express server
 * @param {File} file The file to search
 * @param {number} portNum The port number being used by the server
 * @return {RouterData[]} An array containing a RouterData object for
 *   each router used by express in the specified file
 */
export const findRouters = (file: File, portNum: number): RouterData[] => {
  let output: RouterData[] = [];
  const LINES = file.contents.split(NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    output = output.concat(findRouter(LINES[i], portNum));
  }
  return output;
};

/**
 * Searches each file in the file list for the path of the specified router
 * @param {RouterData} router All known data about the router
 * @param {string[]} fileList The list of support files to search
 * @param {Map<string, File>} supportFiles File objects for all server-related files
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
const findRouterFile = (
  router: RouterData,
  fileList: string[],
  supportFiles: Map<string, File>,
): string => {
  let routerPath = '';
  for (let i = 0; i < fileList.length; i += 1) {
    const FILE = supportFiles.get(fileList[i]);
    if (FILE !== undefined) routerPath = findPath(FILE, router, supportFiles);
    if (routerPath !== '') break;
  }
  return routerPath;
};

/**
 * Checks the specified line to see if the specified router references a path in a require statement
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @return {string[] | null} An array containing the path if one was required, otherwise null
 */
const findRequiredPath = (line: string, router: RouterData) => {
  // Don't bother searching if the path has already been set
  if (router.path !== '') return null;

  const REQUIRE_PATTERN = new RegExp(
    '{\\s*'
      + router.importName
      + '\\s*}\\s*=\\s*require\\(\\s*[\'"`](\\S+)[\'"`]\\)',
  );
  return line.match(REQUIRE_PATTERN);
};

/**
 * Search the specified line for a statement for the specified router that requires a path
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {string} path The directory containing the file whose line is being searched
 * @param {Map<string, File>} supportFiles File objects for all server-related files
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
export const findPathRequire = (
  line: string,
  router: RouterData,
  path: string,
  supportFiles: Map<string, File>,
): string => {
  let routerPath = '';
  const PATH_FOUND = findRequiredPath(line, router);
  if (PATH_FOUND) {
    // Get a list of the files that could be the associated router file
    const FILES = resolvePath(pathUtil.join(path, PATH_FOUND[1]).replace(/\\/g, '/'));
    routerPath = findRouterFile(router, FILES, supportFiles);
  }
  return routerPath;
};

/**
 * Search the specified line for the initialization of the specified router
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {string} path The directory containing the file whose line is being searched
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
const findRouterInit = (
  line: string,
  router: RouterData,
  path: string,
): string => {
  let routerPath = '';
  const INIT_PATTERN = new RegExp(
    router.importName + '\\s*=\\s*\\S*Router\\(.*\\);?',
  );
  if (line.match(INIT_PATTERN)) routerPath = path;
  return routerPath;
};

/**
 * Search the specified line to see if the specified router is imported
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {string} path  The directory containing the file whose line is being searched
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
const findRouterImport = (
  line: string,
  router: RouterData,
  path: string,
): string => {
  let routerPath = '';
  const IMPORT_PATTERN = new RegExp(
    'import\\s+' + router.importName + '\\s+from\\s+[\'"`](\\S+)[\'"`];?',
  );
  const IMPORT_FOUND = line.match(IMPORT_PATTERN);
  if (IMPORT_FOUND) {
    // Resolve the specified path to ensure it includes the correct file extension
    routerPath = resolvePath(pathUtil.join(path, IMPORT_FOUND[1]).replace(/\\/g, '/'))[0];
  }
  return routerPath;
};

/**
 * Search the specified line to see if the specified router is required using path.join
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {string} path The directory containing the file whose line is being searched
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
const findJoinRequire = (
  line: string,
  router: RouterData,
  path: string,
): string => {
  let routerPath = '';
  // Finds require statements that include path.join
  const REQUIRE_JOIN_PATTERN = new RegExp(
    router.importName
      + '\\s*=\\s*require\\(\\S*\\.join\\(__dirname, [\'"`](\\.*\\/*\\S+)[\'"`]\\)',
  );
  const REQUIRE_FOUND = line.match(REQUIRE_JOIN_PATTERN);
  if (REQUIRE_FOUND) {
    // Resolve the specified path to ensure it includes the correct file extension
    routerPath = resolvePath(pathUtil.join(path, REQUIRE_FOUND[1]).replace(/\\/g, '/'))[0];
  }
  return routerPath;
};

/**
 * Search the specified line to see if the specified router is required
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {string} path The directory containing the file whose line is being searched
 * @return {string} The file path for the specified router,
 *   or an empty string if no path was found
 */
const findRouterRequire = (
  line: string,
  router: RouterData,
  path: string,
): string => {
  let routerPath = '';
  const REQUIRE_PATTERN = new RegExp(
    router.importName + '\\s*=\\s*require\\(\\s*[\'"`](\\S+)[\'"`]\\)',
  );
  const REQUIRE_FOUND = line.match(REQUIRE_PATTERN);
  if (REQUIRE_FOUND) {
    // Resolve the specified path to ensure it includes the correct file extension
    routerPath = resolvePath(pathUtil.join(path, REQUIRE_FOUND[1]).replace(/\\/g, '/'))[0];
  }
  return routerPath;
};

/**
 * Searches the specified line for the file path of the specified router
 * @param {string} line The line to search
 * @param {RouterData} router All known data about the router
 * @param {File} file The file from which the line was read
 * @return {string} The file path for the specified router,
 *   or an empty string if the path could not be found
 */
const searchLineForPath = (
  line: string,
  router: RouterData,
  file: File,
  supportFiles: Map<string, File>,
): string => {
  // Check for all known ways a router could be utilized
  let routerPath = findRouterRequire(line, router, file.path);
  if (routerPath !== '') return routerPath;

  routerPath = findJoinRequire(line, router, file.path);
  if (routerPath !== '') return routerPath;

  routerPath = findRouterImport(line, router, file.path);
  if (routerPath !== '') return routerPath;

  routerPath = findRouterInit(line, router, file.path);
  if (routerPath !== '') return routerPath.concat(file.fileName);

  routerPath = findPathRequire(line, router, file.path, supportFiles);
  return routerPath;
};

/**
 * Searches the contents of the specified file to identify the file path of the specified router
 * @param {File} file The file to search
 * @param {RouterData} router All known data about the router
 * @param {Map<string, File>} supportFiles File objects for all server-related files
 * @return {string} The file path for the specified router,
 *   or an empty string if the path could not be found
 */
export const findPath = (
  file: File,
  router: RouterData,
  supportFiles: Map<string, File>,
): string => {
  let routerPath = '';
  const LINES = file.contents.split(NEW_LINE);
  // Search through each line of the file until a routerPath has been found
  for (let i = 0; i < LINES.length; i += 1) {
    routerPath = searchLineForPath(LINES[i], router, file, supportFiles);
    if (routerPath !== '') break;
  }
  return routerPath;
};

/**
 * Finds the file path for the specified router
 * @param router The router we're looking for
 * @param file The file that imports the router
 * @param supportFiles File objects for all server-related files
 * @return  The file path for the specified router,
 *   or an empty string if the path could not be found
 */
export const findRouterPath = (
  router: RouterData,
  file: File,
  supportFiles: Map<string, File>,
): string => {
  let routerPath = '';
  const PATH_FOUND = router.importName.match(REQUIRE_PATH);
  if (PATH_FOUND) {
    routerPath = resolvePath(
      pathUtil.join(file.path, PATH_FOUND[1]).replace(/\\/g, '/'),
    )[0];
  } else routerPath = findPath(file, router, supportFiles);
  return routerPath;
};

/**
 * Checks for routes that span multiple lines
 * @param {string} line The line to check
 * @param {string} nextLine The next line in the file
 * @param {number} lineNum The line number of the line in the router file
 * @param {string} path The path of the router file
 * @param {string} baseRoute The base route for all routes in the router file
 * @return {Route[]} An array containing a Route object if a route was found
 */
const findMultiLineRoutes = (
  line: string,
  nextLine: string,
  lineNum: number,
  path: string,
  baseRoute: string,
): Route[] => {
  const routes: Route[] = [];
  const HAS_ROUTE = line.match(MULTI_LINE_ROUTE);
  if (HAS_ROUTE) {
    const ROUTE_FOUND = nextLine.match(ROUTE_ENDPOINT);
    if (ROUTE_FOUND) {
      let route = baseRoute + ROUTE_FOUND[1];
      // Remove any trailing slashes from the route
      while (route.slice(-1) === '/') {
        route = route.substring(0, route.length - 1);
      }
      routes.push({
        path,
        route,
        method: HAS_ROUTE[1],
        startLine: lineNum + 1,
        endLine: lineNum + 1,
      });
    }
  }
  return routes;
};

/**
 * Checks the specified line to see if it contains a route
 * @param {string} line The line to check
 * @param {number} lineNum The line number of the line in the router file
 * @param {string} path The path of the router file
 * @param {string} baseRoute The base route for all routes in the router file
 * @return {Route[]} An array containing a Route object if a route was found
 */
const checkLineForRoute = (
  line: string,
  lineNum: number,
  path: string,
  baseRoute: string,
): Route[] => {
  const routes: Route[] = [];
  const HAS_ROUTE = line.match(EXPRESS_ROUTE);
  if (HAS_ROUTE) {
    let route = baseRoute + HAS_ROUTE[2];
    // Remove any trailing slashes from the route
    while (route.slice(-1) === '/') {
      route = route.substring(0, route.length - 1);
    }
    routes.push({
      path,
      route,
      method: HAS_ROUTE[1],
      startLine: lineNum + 1,
      endLine: lineNum + 1,
    });
  }
  return routes;
};

/**
 * Finds all routes in the specified router file
 * @param {string} contents The contents of the router file
 * @param {string} path The path of the router file
 * @param {string} baseRoute The base route for all routes in the router file
 * @return {Route[]} An array containing a Route object for each route in the router file
 */
export const findRoutes = (
  contents: string,
  path: string,
  baseRoute: string,
): Route[] => {
  let routes: Route[] = [];
  const LINES = contents.split(NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    routes = routes.concat(checkLineForRoute(LINES[i], i, path, baseRoute));
    routes = routes.concat(
      findMultiLineRoutes(LINES[i], LINES[i + 1], i, path, baseRoute),
    );
  }
  return routes;
};

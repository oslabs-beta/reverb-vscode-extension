import * as patterns from '../../constants/expressPatterns';
import * as fileOps from './genericFileOps';

// Check the specified line for an express import statement
const checkForExpressImport = (line: string) => {
  const MATCH = line.match(patterns.IMPORT_EXPRESS);
  // If a match is found, return the name applied to the express import
  if (MATCH !== null) return MATCH[1];
  // Otherwise return undefined
  return undefined;
};

// Check the specified line for a require express statement
const checkForRequireExpress = (line: string) => {
  const MATCH = line.match(patterns.REQUIRE_EXPRESS);
  // If a match is found, return the name applied to the express import
  if (MATCH !== null) return MATCH[1];
  // Otherwise return undefined
  return undefined;
};

// Attempt to parse the name applied to the express import statement from the specified file
export const checkFileForExpress = (file: File) => {
  const LINES = file.contents.split(patterns.NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    // Check the current line for an express import statement
    let expressImport = checkForExpressImport(LINES[i]);
    if (expressImport !== undefined) return expressImport;
    // Check the current line for a require express statement
    expressImport = checkForRequireExpress(LINES[i]);
    if (expressImport !== undefined) return expressImport;
  }
  // The file does not contain an express import/require statement
  return undefined;
};

// Check the specified line for an express invocation
const checkForExpressInvocation = (line: string, expressName: string) => {
  const SERVER_PATTERN = new RegExp('(\\S+)\\s*=\\s*' + expressName + '\\(\\)');
  // Check the current line for an invocation of express
  const SERVER_NAME = line.match(SERVER_PATTERN);
  // If a match is found, return the name applied to the express server
  if (SERVER_NAME !== null) return SERVER_NAME[1];
  // Otherwise return undefined
  return undefined;
};

// Check the specified line for express.Application
const checkForExpressApplication = (line: string, expressName: string) => {
  const SERVER_PATTERN = new RegExp(
    '\\(\\s*(\\S+)\\s*:\\s*' + expressName + '\\.Application\\)',
  );
  // Check the current line for a call to express.Application
  const SERVER_NAME = line.match(SERVER_PATTERN);
  // If a match is found, return the name applied to the express server
  if (SERVER_NAME !== null) return SERVER_NAME[1];
  // Otherwise return undefined
  return undefined;
};

// Attempt to parse the name applied to the express server from the specified file
export const checkFileForServer = (file: File, expressName: string) => {
  const LINES = file.contents.split(patterns.NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    // Check the current line for an express import statement
    let expressImport = checkForExpressInvocation(LINES[i], expressName);
    if (expressImport !== undefined) return expressImport;
    // Check the current line for a require express statement
    expressImport = checkForExpressApplication(LINES[i], expressName);
    if (expressImport !== undefined) return expressImport;
  }
  // The file does not contain an express import/require statement
  return undefined;
};

// Attempt to parse the route and import name of all routers from the specified file
export const checkFileForRouters = (file: File, portNum: number) => {
  const routerList = [];
  const LINES = file.contents.split(patterns.NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    // Check the current line for a router import statement
    const ROUTER_DATA = LINES[i].match(patterns.USE_ROUTER);
    // If found, add the route and import name to the router list
    if (ROUTER_DATA !== null) {
      const ROUTE = ROUTER_DATA[1] === '/' ? '' : ROUTER_DATA[1];
      routerList.push({
        path: '',
        baseRoute: 'http://localhost:' + portNum + ROUTE,
        importName: ROUTER_DATA[2],
      });
    }
  }
  // Return the list of routers
  return routerList;
};

// Check the specified line to see if it requires a router file
const checkForRouterRequire = (
  line: string,
  router: RouterData,
  path: string,
) => {
  // Don't bother searching if the path has already been set
  if (router.path !== '') return;
  const ROUTER_REQUIRE = new RegExp(
    router.importName + '\\s*=\\s*require\\(\\s*[\'"`](\\S+)[\'"`]\\)',
  );
  // If the router requires a different path, update the router information
  const REQUIRED_PATH = line.match(ROUTER_REQUIRE);
  if (REQUIRED_PATH !== null) {
    router.path = fileOps.resolvePath(
      fileOps.mergePaths(path, REQUIRED_PATH[1]),
    )[0];
  }
};

// Check the specified line to see if it imports a router file
const checkForRouterImport = (
  line: string,
  router: RouterData,
  path: string,
) => {
  // Don't bother searching if the path has already been set
  if (router.path !== '') return;
  const ROUTER_IMPORT = new RegExp(
    'import\\s+' + router.importName + '\\s+from\\s+[\'"`](\\S+)[\'"`];?',
  );
  // If the router imports a different path, update the router information
  const REQUIRED_PATH = line.match(ROUTER_IMPORT);
  if (REQUIRED_PATH !== null) {
    router.path = fileOps.resolvePath(
      fileOps.mergePaths(path, REQUIRED_PATH[1]),
    )[0];
  }
};

// Check the specified line to see if it initializes the router
const checkForRouterForInit = (
  line: string,
  router: RouterData,
  path: string,
) => {
  // Don't bother searching if the path has already been set
  if (router.path !== '') return;
  const ROUTER_INIT = new RegExp(
    router.importName + '\\s*=\\s*\\S*Router\\(.*\\);?',
  );
  // If the line initializes the router, update the router information
  if (line.match(ROUTER_INIT) !== null) {
    router.path = path;
  }
};

// Check the specified line to see if it requires a router file
const checkForRouterPathRequire = (
  line: string,
  router: RouterData,
  path: string,
  supportFiles: Map<string, File>,
) => {
  // Don't bother searching if the path has already been set
  if (router.path !== '') return;
  const ROUTER_REQUIRE = new RegExp(
    '{\\s*'
      + router.importName
      + '\\s*}\\s*=\\s*require\\(\\s*[\'"`](\\S+)[\'"`]\\)',
  );
  // If the router imports a different path, update the router information
  const REQUIRED_PATH = line.match(ROUTER_REQUIRE);
  if (REQUIRED_PATH !== null) {
    // Get a list of the files that could be the associated router file
    const FILES = fileOps.resolvePath(
      fileOps.mergePaths(path, REQUIRED_PATH[1]),
    );
    for (let i = 0; i < FILES.length; i += 1) {
      const CURRENT_FILE = supportFiles.get(FILES[i]);
      if (CURRENT_FILE !== undefined) {
        findPath(CURRENT_FILE.contents, FILES[i], router, supportFiles);
      }
      if (router.path !== '') return;
    }
  }
};

// Find the file path for the specified router
export const findPath = (
  fileContents: string,
  path: string,
  router: RouterData,
  supportFiles: Map<string, File>,
) => {
  const LINES = fileContents.split(patterns.NEW_LINE);
  const BASE_PATH = fileOps.removeFilenameFromPath(path);
  for (let i = 0; i < LINES.length; i += 1) {
    checkForRouterRequire(LINES[i], router, BASE_PATH);
    checkForRouterImport(LINES[i], router, BASE_PATH);
    checkForRouterForInit(LINES[i], router, path);
    checkForRouterPathRequire(LINES[i], router, BASE_PATH, supportFiles);
    if (router.path !== '') return;
  }
};

// Find all routes in the specified router file
export const findRoutes = (
  contents: string,
  path: string,
  baseRoute: string,
) => {
  const routes: Array<Route> = [];
  const LINES = contents.split(patterns.NEW_LINE);
  for (let i = 0; i < LINES.length; i += 1) {
    const HAS_ROUTE = LINES[i].match(patterns.EXPRESS_ROUTE);
    if (HAS_ROUTE !== null) {
      let route = baseRoute + HAS_ROUTE[2];
      while (route.slice(-1) === '/')
        route = route.substring(0, route.length - 1);
      const method = HAS_ROUTE[1];
      routes.push({ path, route, method, startLine: i + 1, endLine: i + 1 });
    }
  }
  return routes;
};

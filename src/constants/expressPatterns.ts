// Patterns used for parsing Express server files
export const NEW_LINE = new RegExp('\\r?\\n');
export const CODE_FILE = new RegExp('.*\\.(js|ts)$');
export const FILENAME_AND_PATH = new RegExp('(\\S+\\/)(\\S+)');
export const PARENT_DIRECTORY = new RegExp('(\\S+\\/)\\S+');
export const IMPORTED_FILES = new RegExp('import\\s*\\S+\\s*from\\s*[\'"`](\\.*\\/\\S+)[\'"`]');
export const REQUIRED_FILES = new RegExp('require\\([\'"`](\\.*\\/\\S+)[\'"`]\\)');
export const REQUIRED_PATH_JOIN = new RegExp(
    'require\\(\\S*\\.join\\(__dirname, [\'"`](\\.*\\/*\\S+)[\'"`]\\)',
);
export const REQUIRE_EXPRESS = new RegExp(
    '(\\S+)\\s*=\\s*require\\s*\\(\\s*[\'"`]express[\'"`]\\s*\\)',
);
export const IMPORT_EXPRESS = new RegExp('import\\s*(\\S+)\\s*from\\s*[\'"`]express[\'"`]');
export const USE_ROUTER = new RegExp('\\.use\\([\'"`](\\S+)[\'"`],\\s*(\\S+)\\)');
export const REQUIRE_PATH = new RegExp('require\\(\\s*[\'"`](\\S+)[\'"`]\\)');
export const EXPRESS_ROUTE = new RegExp('\\.(get|post|put|delete)\\([\'"`](\\/\\S*)[\'"`]');
export const MULTI_LINE_ROUTE = new RegExp('\\.(get|post|put|delete)\\(\\s*$');
export const ROUTE_ENDPOINT = new RegExp('[\'"`](\\/\\S*)[\'"`]');

export const ROUTE_PARAMS = new RegExp(':\\w*', 'g');

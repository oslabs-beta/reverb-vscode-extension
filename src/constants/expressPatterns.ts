// Patterns used for parsing Express server files
export const FILENAME_AND_PATH = new RegExp('(\\S+\\/)(\\S+)');
export const IMPORTED_FILES = new RegExp('import\\s*\\S+\\s*from\\s*[\'"`](\\.*\\/\\S+)[\'"`]');
export const REQUIRED_FILES = new RegExp('require\\([\'"`](\\.*\\/\\S+)[\'"`]\\)');
export const REQUIRE_EXPRESS = new RegExp('(\\S+)\\s*=\\s*require\\s*\\(\\s*[\'"`]express[\'"`]\\s*\\)');
export const IMPORT_EXPRESS = new RegExp('import\\s*(\\S+)\\s*from\\s*[\'"`]express[\'"`]');
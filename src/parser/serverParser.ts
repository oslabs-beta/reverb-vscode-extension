
// Used to store information about each file
interface File {
  path: string;
  contents: string;
};

class ServerParser {
  serverFile: File;

  constructor(serverFilePath: string){
    this.serverFile = { path: serverFilePath, contents: '' };
  }

  parse() {
    
  }
};

export default ServerParser;
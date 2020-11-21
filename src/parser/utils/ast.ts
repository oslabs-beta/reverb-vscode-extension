const parser = require('typescript-estree');
const walk = require('estree-walker').walk;

export function getRanges(FILETEXT: string) {
  const output: Array<expressionRanges> = [];
  const ast = parser.parse(FILETEXT, {
    loc: true,
  });
  walk(ast, {
    enter: function (node: node, parent: parent) {
      if (
        node.type === 'MemberExpression'
        && (node.property.name === 'get'
          || node.property.name === 'put'
          || node.property.name === 'delete'
          || node.property.name === 'post')
      ) {
        output.push({
          startNum: node.property.loc.start.line,
          endNum: parent.loc.end.line,
        });
      }
    },
  });
  return output;
}

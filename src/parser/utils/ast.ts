const parser = require('typescript-estree');
const walk = require('estree-walker').walk;

export function getRanges(FILETEXT: string) {
  const output: ExpressionRanges = {};
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
        const startNum = node.property.loc.start.line;
        const endNum = parent.loc.end.line;
        output[startNum] = endNum;
      }
    },
  });
  return output;
}

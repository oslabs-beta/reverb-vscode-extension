const parser = require('typescript-estree');
const walk = require('estree-walker').walk;
const fs = require('fs').promises;
import {
  parse,
  TSESTreeOptions,
  TSESTree,
} from '@typescript-eslint/typescript-estree';

export function getRanges(FILETEXT: string) {
  const output: ExpressionRanges = {};
  const ast = parser.parse(FILETEXT, {
    loc: true,
  });
  walk(ast, {
    enter: function (node: node, parent: parent) {
      if (
        node.type === 'MemberExpression'
        && [
          'get',
          'GET',
          'post',
          'POST',
          'put',
          'PUT',
          'delete',
          'DELETE',
        ].includes(node.property.name)
      ) {
        const startNum = node.property.loc.start.line;
        const endNum = parent.loc.end.line;
        output[startNum] = endNum;
      }
    },
  });
  return output;
}

const parser = require('typescript-estree');
const walk = require('estree-walker').walk;
const fs = require('fs').promises;
import {
  parse,
  TSESTreeOptions,
  TSESTree,
} from '@typescript-eslint/typescript-estree';

export function getRanges(FILETEXT: string) {
  const output: Array<expressionRanges> = [];
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
        output.push({
          startNum: node.property.loc.start.line,
          endNum: parent.loc.end.line,
        });
      }
    },
  });
  return output;
}

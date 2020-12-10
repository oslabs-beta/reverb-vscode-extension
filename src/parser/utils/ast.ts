/* eslint-disable consistent-return */
import { parse } from '@typescript-eslint/typescript-estree';

const { walk } = require('estree-walker');

/**
 * Finds start and end lines of express endpoints.
 * @param {string} FILETEXT output of readFileSync of file to be parsed.
 * @returns {ExpressionRanges} Ranges of lines.
 */
export function getRanges(FILETEXT: string) {
    const output: ExpressionRanges = {};
    const ast = parse(FILETEXT, {
        loc: true,
    });
    walk(ast, {
        enter(
            node: {
                type: string;
                property: { name: string; loc: { start: { line: any } } };
            },
            parent: { loc: { end: { line: any } } },
        ) {
            if (
                node.type === 'MemberExpression' &&
                ['get', 'GET', 'post', 'POST', 'put', 'PUT', 'delete', 'DELETE'].includes(
                    node.property.name,
                )
            ) {
                const startNum = node.property.loc.start.line;
                const endNum = parent.loc.end.line;
                output[startNum] = endNum;
            }
        },
    });
    return output;
}

/**
 * Finds Express import Identifier.
 * @param {string} FILETEXT output of readFileSync of file to be parsed.
 * @returns {ExpressId} Identifier of Express import.
 */
export function getExpressIdentifier(FILETEXT: string) {
    const ast = parse(FILETEXT, {
        loc: true,
    });
    walk(ast, {
        enter(node: any, parent: any) {
            if (
                node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                node.callee.name === 'require'
            ) {
                node.arguments.forEach((el: { type: string; value: string }) => {
                    if (el.type === 'Literal' && el.value === 'express') {
                        if (
                            parent.type === 'VariableDeclarator' &&
                            parent.id.type === 'Identifier'
                        ) {
                            const expressId = parent.id.name;
                            return expressId;
                        }
                    }
                });
            }
        },
    });
}

// const FILETEXT = fs.readFileSync(
//   'C:/Users/itsme/Documents/test-server-express/server1/index.js',
//   'utf8',
// );
// getExpressIdentifier(FILETEXT);

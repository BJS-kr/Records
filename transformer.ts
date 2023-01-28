import { readFileSync } from 'fs';
import * as ts from 'typescript';

const sourceFile = ts.createSourceFile("file.ts", readFileSync('./test.ts').toString(), ts.ScriptTarget.Latest, true);
const sourceFileFullText = sourceFile.getFullText();
const comments: Map<string, string> = new Map();

function extractComments(node: ts.Node) {
    ts.forEachLeadingCommentRange(sourceFile.getFullText(), node.pos, (pos, end) => {
        const commentPosition = `${String(pos)}:${String(end)}`;
        comments.get(commentPosition) || comments.set(commentPosition, sourceFileFullText.substring(pos, end));
    });
    // ts.forEachTrailingCommentRange(sourceFile.getFullText(), node.pos, (pos, end) => {
    //     comments.push(sourceFile.getFullText().substring(pos, end));
    // });
    ts.forEachChild(node, extractComments);
}

extractComments(sourceFile);
console.log(comments);
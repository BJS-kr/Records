import { readFileSync } from 'fs';
import * as ts from 'typescript';

const sourceFile = ts.createSourceFile("file.ts", readFileSync('./test.ts').toString(), ts.ScriptTarget.Latest, true);
const sourceFileFullText = sourceFile.getFullText();
const kinds = ts.SyntaxKind;
const propertyDeclarations = [];
const propertySignatures = [];
const typeLiterals = [];
const typeReferences = [];
const propertyComments = new Map();

function printNode(node: ts.Node) {

  node.kind === kinds.PropertyDeclaration && propertyDeclarations.push(node.getText());
  node.kind === kinds.PropertySignature && propertySignatures.push(node.getText());
  node.kind === kinds.TypeReference && typeReferences.push(node.getText());
  node.kind === kinds.TypeLiteral && typeLiterals.push(node.getText());
  node.kind === kinds.Identifier && node.parent.kind !== kinds.ClassDeclaration && propertyComments.set(node.getText(), null);
  // identifier의 parent가 propertyDeclaration일 경우 parent의 3번째 child는 타입이다
  // 그 이유는 propertyName(0) :(1) type(2) ;(3) 순서로 child가 존재하기 때문이다.
  node.kind === kinds.Identifier && node.parent.kind === kinds.PropertyDeclaration && console.log('!!!!!!!!!',node.parent.getChildren()[2].kind)
  ts.forEachLeadingCommentRange(sourceFile.getFullText(), node.pos, (pos, end) => {
    node.kind === kinds.Identifier && propertyComments.set(node.getText(), sourceFileFullText.substring(pos, end))
  });

  // decorator expression만드는 함수
  ts.factory.createDecorator
  console.log(node.getText(), node.kind, kinds[node.kind]);
  ts.forEachChild(node, printNode);
}


printNode(sourceFile)
console.log({ propertyDeclarations,  propertyComments});


/**
 * 1. 소스파일 상단에 import { ApiProperty } from '@nest/swagger'가 붙게 하기
 * 2. 각 프로퍼티 위에 @ApiProperty()가 붙게하기(factory 사용해서)
 * 3. string, number, boolean을 판단해 ApiProperty의 type옵션 넣기(참조형 타입 skip)
 * 4. leadingCommentRange를 활용해 ApiProperty에 description옵션 넣기
 * 5. typeLiteral타입을 type에 추가할 수 있게하기
 * 6. typeReference 타입을 추적해 type에 추가할 수 있게하기(한 파일에서)
 * 7. 6번을 다른 파일에서 가능하게 하기
 * 8. class, interface, type, type literal에 대한 동일한 동작 구현하기
 * 9. 1~8을 소스코드 전체에서 가능하게 하기
 */
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
  node.kind === kinds.Identifier && node.parent.kind === kinds.PropertyDeclaration && console.log('!!',node.parent.getChildren().map(c => kinds[c.kind]))
  node.kind === kinds.Identifier && node.parent.kind === kinds.PropertyDeclaration && console.dir(node.parent.getChildren().filter(c => kinds[c.kind] === 'TypeReference'), {depth:null})
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


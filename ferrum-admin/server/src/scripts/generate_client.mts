import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import ts, { TypeNode, TypeReference } from 'typescript';

const __filename = new URL(import.meta.url).pathname;
const __dirname = join(__filename, '..');

const controllerPath = join(__dirname, '../../src/controllers');
const outputDir = join(__dirname, '../../../client/src/endpoints');

const files = readdirRecursive(controllerPath).filter((e) => e.endsWith('.mts'));

mkdirSync(outputDir, { recursive: true });

// Clear the output directory
for (const file of readdirSync(outputDir)) {
    if (file.endsWith('.ts')) {
        unlinkSync(join(outputDir, file));
    }
}

const payload: ControllerMetaData[] = [];
console.log(`Found ${files.length} files...`);

for (const controllerDefinition of files) {
    // Turn file to AST
    const ast = ts.createSourceFile(controllerDefinition, readFileSync(controllerDefinition, 'utf8'), ts.ScriptTarget.ES2022, true);

    // Find the class declaration
    const classDeclaration = ast.statements.find((e) => e.kind === ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration;

    if (!classDeclaration) {
        continue;
    } else {
        const extendingClass = getExtendingClass(classDeclaration);

        if (extendingClass === 'Controller') {
            // get class annotations
            const classAnnotations = getAnnotations(classDeclaration);
            const route = classAnnotations.find((e) => e.name === 'route');
            if (!route) {
                throw new Error('Controller must have a route annotation');
            }

            // get methods
            const methods = classDeclaration.members.filter((e) => e.kind === ts.SyntaxKind.MethodDeclaration) as ts.MethodDeclaration[];

            if (classDeclaration.name === undefined) {
                throw new Error('Controller must have a name');
            }

            const controllerMetadata: ControllerMetaData = {
                name: classDeclaration.name.text.replace('Controller', 'Client'),
                methods: [],
                route: route.args[0].toString(),
            };

            for (const method of methods) {
                // get method annotations
                const methodAnnotations = getAnnotations(method);
                const getMethod = methodAnnotations.find((e) => e.name === 'get');
                const postMethod = methodAnnotations.find((e) => e.name === 'post');

                if (!getMethod && !postMethod) {
                    continue;
                }

                if (method.parameters.length !== 2) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(method.getSourceFile(), method.getStart());
                    throw new Error(
                        `The annotation for method ${method.name.getText()} in controller ${classDeclaration.name.getText()} must have 2 parameters
${method.getSourceFile().fileName}:${line + 1}:${character + 1}`,
                    );
                }

                if (method.parameters[0].type === undefined || method.parameters[1].type === undefined) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(method.getSourceFile(), method.getStart());
                    throw new Error(
                        `The method ${method.name.getText()} in controller ${classDeclaration.name.getText()} must have a type for both parameters
${method.getSourceFile().fileName}:${line + 1}:${character + 1}`,
                    );
                }

                if (
                    (!getMethod && (method.parameters[0].type as any).typeArguments === undefined) ||
                    (method.parameters[1].type as any).typeArguments === undefined
                ) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(method.getSourceFile(), method.getStart());
                    throw new Error(
                        `The method ${method.name.getText()} in controller ${classDeclaration.name.getText()} must have a generic type for the relevant parameters
${method.getSourceFile().fileName}:${line + 1}:${character + 1}`,
                    );
                }

                if (getMethod && (method.parameters[0].type as any as TypeReference)?.typeArguments?.[0] !== undefined) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(method.getSourceFile(), method.getStart());
                    throw new Error(
                        `The first argument in method ${method.name.getText()} in controller ${classDeclaration.name.getText()} must not have a type argument because it is a get method
${method.getSourceFile().fileName}:${line + 1}:${character + 1}`,
                    );
                }

                if (method.parameters[1].type === undefined) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(method.getSourceFile(), method.getStart());
                    throw new Error(
                        `The second argument of method ${method.name.getText()} in controller ${classDeclaration.name.getText()} must have a type
${method.getSourceFile().fileName}:${line + 1}:${character + 1}`,
                    );
                }

                if (getMethod) {
                    controllerMetadata.methods.push({
                        name: method.name.getText(),
                        method: 'get',
                        route: getMethod.args[0]?.toString() ?? method.name.getText(),
                        outputType: (method.parameters[1].type as any).typeArguments[0].getText(),
                        requiredImports: Array.from(extractRequiredImports(new Set(), (method.parameters[1].type as any).typeArguments[0])),
                    });
                } else if (postMethod) {
                    controllerMetadata.methods.push({
                        name: method.name.getText(),
                        method: 'post',
                        route: postMethod.args[0]?.toString() ?? method.name.getText(),
                        inputType: (method.parameters[0].type as any).typeArguments[0].getText(),
                        outputType: (method.parameters[1].type as any).typeArguments[0].getText(),
                        requiredImports: Array.from(
                            extractRequiredImports(
                                new Set(),
                                (method.parameters[0].type as any).typeArguments[0],
                                (method.parameters[1].type as any).typeArguments[0],
                            ),
                        ),
                    });
                } else {
                    throw new Error('Method must have either a get or post annotation');
                }
            }
            payload.push(controllerMetadata);
        } else {
            continue;
        }
    }

    for (const endpoint of payload) {
        const imports = Array.from(new Set(endpoint.methods.map((e) => e.requiredImports).flat()));
        const output = `// This file was automatically generated by generate_client.ts. Want to regenerate it? Run \`npm run create:client\`
${imports.length > 0 ? `import { ${imports.join(', ')} } from 'shared';` : ''}

export class ${endpoint.name} {
${endpoint.methods
    .map((e) => {
        if (e.method === 'get') {
            return `    public static async ${e.name}(): Promise<${e.outputType}> {
        const request = await fetch('/api${endpoint.route}/${e.route}');
        if (!request.ok) {
            throw new Error('Request failed');
        }

        return request.json();
    }`;
        } else {
            return `    public static async ${e.name}(body: ${e.inputType}): Promise<${e.outputType}> {
        const request = await fetch('/api${endpoint.route}/${e.route}', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Request failed');
        }
        return request.json();
    }`;
        }
    })
    .join('\n')}
}
`;
        console.log(`Writing ${pascalCaseToSnakeCase(endpoint.name)}.ts...`);
        writeFileSync(join(outputDir, `${pascalCaseToSnakeCase(endpoint.name)}.ts`), output);
    }
}

function getExtendingClass(classDeclaration: ts.ClassDeclaration): string {
    const heritageClauses = classDeclaration.heritageClauses;
    if (!heritageClauses) {
        return '';
    }
    const extendsClause = heritageClauses.find((e) => e.token === ts.SyntaxKind.ExtendsKeyword);
    if (!extendsClause) {
        return '';
    }
    const extendsType = extendsClause.types[0];
    if (!extendsType) {
        return '';
    }
    return extendsType.expression.getText();
}

function getAnnotations(classDeclaration: ts.ClassDeclaration | ts.MethodDeclaration): {
    name: string;
    typeArguments: Array<ts.TypeNode>;
    args: (string | ts.Expression)[];
}[] {
    return classDeclaration.modifiers.filter(ts.isDecorator).map((e) => {
        const expression = e.expression as ts.CallExpression;
        const args = expression.arguments.map((e) => {
            if (ts.isStringLiteral(e)) {
                return e.text;
            } else {
                return e;
            }
        });
        return {
            name: expression.expression.getText(),
            args,
            typeArguments: Array.from(expression.typeArguments ?? []),
        };
    });
}

function readdirRecursive(path: string): string[] {
    const files: string[] = [];
    const dirents = readdirSync(path, { withFileTypes: true });
    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            files.push(...readdirRecursive(join(path, dirent.name)));
        } else {
            files.push(join(path, dirent.name));
        }
    }
    return files;
}

interface ControllerMetaData {
    name: string;
    route: string;
    methods: MethodMetaData[];
}

interface MethodMetaData {
    name: string;
    route: string;
    method: 'get' | 'post';
    inputType?: string;
    outputType: string;
    requiredImports: string[];
}
function extractRequiredImports(result: Set<string>, ...typeNodes: TypeNode[]): Set<string> {
    for (let typeNode of typeNodes) {
        // Unwrap array types
        while (ts.isArrayTypeNode(typeNode)) {
            typeNode = typeNode.elementType;
        }

        // Unwrap union types
        if (ts.isUnionTypeNode(typeNode)) {
            for (const type of typeNode.types) {
                extractRequiredImports(result, type);
            }
            continue;
        }

        // Search generic types
        if (ts.isTypeReferenceNode(typeNode) && typeNode.typeArguments) {
            for (const type of typeNode.typeArguments) {
                extractRequiredImports(result, type);
            }
        }

        if (ts.isTypeReferenceNode(typeNode)) {
            result.add(typeNode.typeName.getText());
        } else if (ts.isTypeLiteralNode(typeNode)) {
            for (const member of typeNode.members) {
                if (ts.isPropertySignature(member)) {
                    extractRequiredImports(result, member.type);
                }
            }
        }
    }
    return result;
}
function pascalCaseToSnakeCase(name: string): string {
    return name.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).substring(1);
}

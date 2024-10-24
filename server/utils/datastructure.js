import jsep from 'jsep';

// Function to convert AST nodes to BSON-style representation
const astToBson = (node) => {
    if (node.type === "BinaryExpression") {
        const operatorMap = {
            'AND': '$and',
            'OR': '$or',
            '==': '$eq',    // Adjusted to use strict equality
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte'
        };

        const operator = operatorMap[node.operator] || node.operator;

        // Handle logical operators ($and, $or)
        if (operator === '$and' || operator === '$or') {
            return {
                [operator]: [
                    astToBson(node.left),
                    astToBson(node.right)
                ]
            };
        } else {
            // Handle comparison operators
            const left = node.left.type === "Identifier" ? node.left.name : null;
            const right = node.right.type === "Literal" ? node.right.value : null;

            if (!left || right === null) {
                throw new Error(`Invalid AST: Cannot process binary expression with missing left or right node.`);
            }

            return {
                [left]: { [operator]: right }
            };
        }
    }

    if (node.type === "Literal") {
        return node.value;
    }
    
    if (node.type === "Identifier") {
        return node.name;
    }
    // If we encounter an unsupported node type, throw an error
    throw new Error(`Unsupported AST node type: ${node.type}`);
};

// Function to create AST from rule string
const createAstFromRule = (ruleString) => {
    // Parse the rule string using jsep
    jsep.addBinaryOp("AND", 1);
    jsep.addBinaryOp("OR", 2);
    const parsedAst = jsep(ruleString);
    // Convert the parsed AST into BSON-style representation
    console.log(astToBson(parsedAst))
    return astToBson(parsedAst);
};

export default createAstFromRule;

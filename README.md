# Rule Engine Backend API
This backend application is a 3-tier rule engine that enables the dynamic creation, evaluation, and combination of rules based on user attributes like age, department, income, and spend. The system uses Abstract Syntax Tree (AST) to represent conditional rules and MongoDB to store them.

Features
Create Rule: Dynamically define rules using AST and store them in MongoDB.
Evaluate Rule: Assess user eligibility based on attributes and stored rules.
Combine Rules: Combine multiple rules to create complex conditions.
MongoDB: Store the rules persistently for later evaluation and modification.

# Project Structure:
.
├── controllers
│   └── ruleController.js     # Handles rule creation, evaluation, and combination
├── models
│   └── model.js          # MongoDB schema for storing AST-based rules
├── routes
│   └── api.js         # API routes for rule operations
|
│ 
├── utils
│   └── datastructure.js          # Utility functions to parse rule expressions into AST
├── index.js                    # Main Express server
└── README.md                 # Project documentation

Sample Schema:
{
  "_id": "643fd56ab2e8b344f4f3c4df",
  "name": "Age and Income Rule",
  "expression": "age > 18 && income > 50000",
  "ast": {
    "type": "LogicalExpression",
    "operator": "&&",
    "left": {
      "type": "BinaryExpression",
      "operator": ">",
      "left": {
        "type": "Identifier",
        "name": "age"
      },
      "right": {
        "type": "Literal",
        "value": 18
      }
    },
    "right": {
      "type": "BinaryExpression",
      "operator": ">",
      "left": {
        "type": "Identifier",
        "name": "income"
      },
      "right": {
        "type": "Literal",
        "value": 50000
      }
    }
  }
}





import Rule from "../models/rules.js";
import createAstFromRule from '../utils/datastructure.js';


const combineRule=(rules)=>{

    const operatorCount ={
        $and:0,
        $or:0
    }

    rules.forEach(rule=>{
        const traverseAst = (node)=>{
            if(node.$and){
                operatorCount.$and++;
                node.$and.forEach(traverseAst)
            }
            else if(node.$or){
                operatorCount.$or++;
                node.$or.forEach(traverseAst)
            }
        }
        traverseAst(rule);
    })

    const dominent = operatorCount.$and >= operatorCount.$or ? '$and':'$or'

    const combineAst = {
        [dominent]:rules
    }
    return combineAst;

}

class RuleController {
    static async createRule(req, res) {
        try {
            const { rule_string } = req.body; 

            console.log("Received rule string:", rule_string);
            if (!rule_string) {
                return res.status(400).json({ msg: "Invalid rule format" });
            }

            const bsonAst = createAstFromRule(rule_string);
            console.log(JSON.stringify(bsonAst,null,2));
            const rule = new Rule({
                rule_string,
                bson_ast: bsonAst
            });
            await rule.save();
            res.status(201).json({ msg: "Rule created successfully", rule });
        } catch (error) {
            res.status(400).json({ msg: "Error creating rule: " + error.message });
        }
    }

    static async evaluateRule(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ msg: "No data provided for rule evaluation" });
            }
            const rule = await Rule.findOne().sort({ createdAt: -1 });
            if (!rule) {
                return res.status(404).json({ msg: "No rules found" });
            }

            const bson_ast = rule.bson_ast;

            const evaluateBsonAst = (ast, data) => {
    
                if (ast.$and) {
                    return ast.$and.every(child => evaluateBsonAst(child, data));
                } else if (ast.$or) {
                    return ast.$or.some(child => evaluateBsonAst(child, data));
                } else {
                    const field = Object.keys(ast)[0];
                    console.log(field)

                    if (!data.hasOwnProperty(field)) {
                        return false;
                    }

                    const operator = Object.keys(ast[field])[0];
                    const value = ast[field][operator];
                    switch (operator) {
                        case '$eq':
                            return data[field] === value;
                        case '$gt':
                            return data[field] > value;
                        case '$lt':
                            return data[field] < value;
                        case '$gte':
                            return data[field] >= value;
                        case '$lte':
                            return data[field] <= value;
                        default:
                            return false;
                    }
                }
            };
            const isEligible = evaluateBsonAst(bson_ast, data);

            console.log("BSON AST:", JSON.stringify(bson_ast, null, 2));
            console.log("Evaluation Data:", data);
            console.log("Evaluation Result:", isEligible);

            res.status(200).json({ isEligible });
        } catch (error) {
            res.status(400).json({ msg: "Error evaluating rule: " + error.message });
        }
    }
    static async combine_rule(req,res){
        try{
            const {rules} = req.body;

        if(!rules || !Array.isArray(rules) || rules.length==0){
            res.status(400).json({msg:'No rules Provided'})
        }

        const ruleArt = rules.map((ruleString) => createAstFromRule(ruleString));

        const combine_rule = combineRule(ruleArt)

        res.status(200).json({msg:"Rule Combine Sucessfully"
            ,rule:combine_rule
        })

        }catch(errors){
            res.status(400).json({err:"Error Combine rule" + error})
        }
        
        
    }
}

export default RuleController;

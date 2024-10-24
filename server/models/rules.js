import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
    rule_string: {
        type: String,
        required: true, 
    },
    bson_ast: {
        type: Object,
        required: true, 
    }
}, { timestamps: true });

const Rule = mongoose.model('Rule', ruleSchema);
export default Rule;

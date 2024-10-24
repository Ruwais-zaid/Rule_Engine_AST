import {Router} from 'express'
import RuleController from '../controller/ruleController.js';

const routes = Router();

routes.post('/create/rule',RuleController.createRule);
routes.post('/evalute/rule',RuleController.evaluateRule);
routes.post('/combine/rule',RuleController.combine_rule)

export default routes;
import {parse, FunctionNode, ParenthesisNode, OperatorNode, ConstantNode, SymbolNode} from 'mathjs'

export default class GroupHelper {
    static preprocessExpression(expression){
        return expression.replace(/([a-zA-Z])\*/g, '$1')
            .replace(/\|(.*)\|/, 'order($1)')
            .replace(/<(.*)>/, 'subGroupGeneratedByElement($1)');
    }

    static evaluateExpression(group, expression){
        let tree = parse(GroupHelper.preprocessExpression(expression));
        return this._eval(group, tree);
    }

    static _eval(group, tree){
        if (tree instanceof ConstantNode)
            return tree.value;
        if (tree instanceof ParenthesisNode)
            return this._eval(group, tree.content);
        if (tree instanceof OperatorNode && tree.op === '-')
            return -this._eval(group, tree.args[0])
        if(tree instanceof SymbolNode){
            if(tree.name === 'e')
                return group._identity;
            if(tree.name === 'generators'){
                return group.generators();
            }
        }
        if (tree.op === '*') {
            const a = this._eval(group, tree.args[0]);
            const b = this._eval(group, tree.args[1]);
            if (!group.contains(a))
                throw(`Invalid Element (${a})`);
            if (!group.contains(b))
                throw(`Invalid Element (${b})`);
            return group._mult(a, b);
        }
        if(tree.op === '^') {
            const a = this._eval(group, tree.args[0]);
            const b = this._eval(group, tree.args[1]);
            if (!group.contains(a))
                throw(`Invalid Element (${a})`);
            return (group._pow(a, b));
        }
        if(tree instanceof FunctionNode && tree.args.length === 1) {
            const elem = this._eval(group, tree.args[0]);
            if(!group.contains(elem))
                throw(`Invalid Element (${elem})`);
            if (tree.fn.name === 'inv')
                return group.inverse(elem);
            if (tree.fn.name === 'order')
                return group.elementOrder(elem);
            if (tree.fn.name === 'subGroupGeneratedByElement'){
                return group.subGroupGeneratedByElement(elem);
            }
            throw('Invalid Expression');
        }
        throw('Invalid Expression');
    }
}
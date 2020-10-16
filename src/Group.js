import {parse, FunctionNode, ParenthesisNode, OperatorNode, ConstantNode, SymbolNode} from 'mathjs'

export default class Group{
    constructor(set, operation){
        this._set = Array.from(new Set(set));
        this._operation = parse(operation).compile();
        
        this._closed = this._checkClosure();
        this._associative = this._check_associativity();
        this._identity = this._findIdentity();
        this._inverses = this._findInverses();
    }

    //////////////////////////////////////////////
    // PUBLIC FUNCTIONS
    //////////////////////////////////////////////

    get set(){
        return this._set;
    }

    get identity(){
        return this._identity;
    }

    get order(){
        return this._set.length;
    }

    isClosed(){
        return this._closed;
    }

    isAssociative(){
        return this._associative;
    }

    inverse(elem){
        return this._inverses ? this._inverses[elem] : null;
    }

    isValidGroup(){
        return this._closed && this._associative && this._identity && this._inverses;
    }

    isAbelian(){
        for (let i=0; i< this._set.length; i++){
            for(let j=i; j < this._set.length; j++){
                let ab = this._mult(this._set[i], this._set[j]);
                let ba = this._mult(this._set[j], this._set[i]);
                if (ab !== ba)
                    return false;
            }
        }
        return true;
    }

    operationTable(){
        let tbl = [];
        for (let i=0; i< this._set.length; i++){
            let row = []
            for(let j=0; j < this._set.length; j++){
                row.push(this._mult(this._set[i], this._set[j]));
            }
            tbl.push(row);
        }
        return tbl;
    }

    evaluateExpression(expression){
        let tree = parse(expression);
        console.log(tree);
        return this._evaluateExpression(tree);
    }

    

    //////////////////////////////////////////////
    // PRIVATE FUNCTIONS
    //////////////////////////////////////////////

    _checkClosure(){
        //checks if the group is closed under the given operation
        for (let i=0; i< this._set.length; i++){
            for(let j=i; j < this._set.length; j++){
                if (this._set.indexOf(this._mult(this._set[i], this._set[j])) === -1)
                    return false;
            }
        }
        return true;
    }

    _check_associativity(){
        //checks if the group is associative under the given operation
        for (let i=0; i< this._set.length; i++){
            for(let j=0; j < this._set.length; j++){
                for(let k=0; k < this._set.length; k++){
                    const a = this._set[i];
                    const b = this._set[j];
                    const c = this._set[k];
                    const ab = this._mult(a, b);
                    const bc = this._mult(b, c);
                    const ab_c = this._mult(ab, c);
                    const a_bc = this._mult(a, bc);
                    if (ab_c !== a_bc)
                        return false;
                }                
            }
        }
        return true;
    }

    _findIdentity(){
        //returns the identity of the group, or null if it doesn't have one
        for (let i=0; i< this._set.length; i++){
            let isIdentity = true;
            for(let j=0; j < this._set.length; j++){
                if (this._mult(this._set[i], this._set[j]) !== this._set[j]){
                    isIdentity = false;
                    break;
                }
            }
            if (isIdentity)
                return this._set[i];
        }
        return null;
    }

    _findInverses(elem){
        // must not be called outside the class. Assumes this._identity is defined
        let inverses = {};

        ext:
        for (let i=0; i < this._set.length; i++){
            let inverse = null;
            for(let j=i; j < this._set.length; j++){
                if(inverses[this._set[j]])
                    continue ext;
                if (this._mult(this._set[i], this._set[j]) === this._identity){
                    inverse = this._set[j];
                    break;
                }
            }
            if (!inverse)
                return null;
            inverses[this._set[i]] = inverse;
            inverses[inverse] = this._set[i];
        }
        return inverses;
    }

    _evaluateExpression(tree){
        if (tree instanceof ConstantNode)
            return tree.value;
        if (tree instanceof ParenthesisNode)
            return this._evaluateExpression(tree.content);
        if (tree instanceof OperatorNode && tree.op === '-')
            return -this._evaluateExpression(tree.args[0])
        if(tree instanceof SymbolNode && tree.name === 'e')
            return this._identity;
        if(tree instanceof FunctionNode && tree.args.length === 1 && tree.fn.name === 'inv')
            return this.inverse(this._evaluateExpression(tree.args[0]))
        if (tree.op === '*')
            return this._mult(this._evaluateExpression(tree.args[0]), this._evaluateExpression(tree.args[1]));
        if(tree.op === '^')
            return (this._pow(this._evaluateExpression(tree.args[0]), this._evaluateExpression(tree.args[1])));
        
        console.log ('Invalid expression!')
        return null;
    }

    _mult(a, b){
        return this._operation.evaluate({a, b})
    }

    _pow(elem, n){
        if (this._set.indexOf(elem) === -1){
            console.log("Invalid power operation. Element is not in the set");
            return null;
        }
        if (n === 0)
            return this._identity;
            
        if (n < 0) {
            console.log(n)
            elem = this.inverse(elem);
            n = -n;
        }
        let res = elem;
        for(let i=1; i<n; i++)
            res = this._mult(res, elem);
        return res;
    }
}
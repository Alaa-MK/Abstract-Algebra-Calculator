import {parse, FunctionNode, ConstantNode, SymbolNode} from 'mathjs'

export default class Group{
    constructor(set, operation){
        this._set = Array.from(new Set(set));
        this._operation = operation;
        
        this._closed = this._checkClosure();
        this._associative = this.check_associativity();
        this._identity = this._findIdentity();
        this._inverses = this._findInverses();
    }

    //////////////////////////////////////////////
    // PUBLIC FUNCTIONS
    //////////////////////////////////////////////

    getSet(){
        return this._set;
    }

    isClosed(){
        return this._closed;
    }

    isAssociative(){
        return this._associative;
    }

    getIdentity(){
        return this._identity;
    }

    getInverse(elem){
        return this._inverses[elem];
    }

    isValidGroup(){
        return this._closed && this._associative && this._identity && this._inverses;
    }

    isAbelian(){
        for (let i=0; i< this._set.length; i++){
            for(let j=i; j < this._set.length; j++){
                let ab = this._operation(this._set[i], this._set[j]);
                let ba = this._operation(this._set[j], this._set[i]);
                if (ab != ba)
                    return false;
            }
        }
        return true;
    }

    operationTable(){
        let tbl = '';
        for (let i=0; i< this._set.length; i++){
            for(let j=0; j < this._set.length; j++){
                tbl += this._operation(this._set[i], this._set[j]) + '\t';
            }
            tbl += '\n';
        }
        return tbl;
    }

    evaluate(expression){
        let tree = parse(expression);
        console.log(tree);
        return this._evaluate(tree);
    }

    

    //////////////////////////////////////////////
    // PRIVATE FUNCTIONS
    //////////////////////////////////////////////

    _checkClosure(){
        //checks if the group is closed under the given operation
        for (let i=0; i< this._set.length; i++){
            for(let j=i; j < this._set.length; j++){
                if (this._set.indexOf(this._operation(this._set[i], this._set[j])) == -1)
                    return false;
            }
        }
        return true;
    }

    check_associativity(){
        //checks if the group is associative under the given operation
        for (let i=0; i< this._set.length; i++){
            for(let j=0; j < this._set.length; j++){
                for(let k=0; k < this._set.length; k++){
                    const a = this._set[i];
                    const b = this._set[j];
                    const c = this._set[k];
                    const ab = this._operation(a, b);
                    const bc = this._operation(b, c);
                    const ab_c = this._operation(ab, c);
                    const a_bc = this._operation(a, bc);
                    if (ab_c != a_bc)
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
                if (this._operation(this._set[i], this._set[j]) != this._set[j]){
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
                if (this._operation(this._set[i], this._set[j]) == this._identity){
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

    _evaluate(tree){
        if (tree instanceof ConstantNode)
            return tree.value;
        if(tree instanceof SymbolNode && tree.name == 'e')
            return this._identity;
        if(tree instanceof FunctionNode && tree.args.length == 1 && tree.fn.name == 'inv')
            return this.getInverse(tree.args[0])
        if (tree.op == '*')
            return this._operation(this._evaluate(tree.args[0]), this._evaluate(tree.args[1]));
        if(tree.op == '^')
            return (this._pow(this._evaluate(tree.args[0]), this._evaluate(tree.args[1])));
        
        console.log ('Invalid expression!')
        return null;
    }

    _pow(elem, n){
        if (this._set.indexOf(elem) == -1){
            console.log("Invalid power operation. Element is not in the set");
            return null;
        }
        if (n == 0)
            return this._identity;
        let res = elem;
        for(let i=1; i<n; i++)
            res = this._operation(res, elem);
        return res;
    }
}
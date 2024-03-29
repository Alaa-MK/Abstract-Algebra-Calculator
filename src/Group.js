import {parse} from 'mathjs'

export default class Group{
    constructor(set, operation){
        this._set = Array.from(new Set(set));
        this._operationText = operation;
        this._operation = parse(operation).compile();
        
        this._closed = this._checkClosure();
        this._associative = this._checkAssociativity();
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

    get groupOrder(){
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

    contains(element){
        return this._set.indexOf(element) !== -1;
    }

    elementOrder(element){
        let order = 0;
        let curr = element;
        for(let i=0; i < 10000; i++){
            if (curr === this.identity)
                return order;
            curr = this._mult(curr, element);
            order++;
        }
        return Infinity;
    }

    subGroupGeneratedByElement(element){
        let s = new Set();
        s.add(this.identity);
        let curr = this.identity;
        for (let i=0; i < this._set.length; i++){
            curr = this._mult(curr, element);
            if (s.has(curr))
                break;
            s.add(curr);
        }
        console.log('zzzz', new Group(s, this._operationText))
        return new Group(s, this._operationText);
    }

    generators(){
        let result = [];
        for (let i=0; i < this._set.length; i++){
            const s = this.subGroupGeneratedByElement(this._set[i]).set;
            if (s.length == this.groupOrder)
                result.push(this._set[i]);                
        }
        return result;
    }

    isCyclic(){
        return this.generators().length > 0;
    }

    toString(){
        return this.set.toString();
    }

    //////////////////////////////////////////////
    // PRIVATE FUNCTIONS
    //////////////////////////////////////////////

    _checkClosure(){
        //checks if the group is closed under the given operation
        for (let i=0; i< this._set.length; i++){
            for(let j=i; j < this._set.length; j++){
                if (!this.contains(this._mult(this._set[i], this._set[j])))
                    return false;
            }
        }
        return true;
    }

    _checkAssociativity(){
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

    _findInverses(){
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

    _mult(a, b){
        return this._operation.evaluate({a, b})
    }

    _pow(elem, n){
        if (!this.contains(elem)){
            throw(`Invalid Element (${elem})`)
        }
        if (n === 0)
            return this._identity;
            
        if (n < 0) {
            elem = this.inverse(elem);
            n = -n;
        }
        let res = elem;
        for(let i=1; i<n; i++)
            res = this._mult(res, elem);
        return res;
    }
}
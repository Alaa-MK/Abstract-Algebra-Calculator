import React from 'react';
import Group from './Group';
import {parse} from 'mathjs'

function App() {
  let g = new Group([1,3,7,9], (a,b)=>(a*b)%10);
  console.log("RESULT", g.evaluate('e*3*e'))
  return (
    <div>
    </div>
  );
}

export default App;

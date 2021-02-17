import { PromiseProvider } from 'mongoose';
import React, {useState, useEffect} from 'react';
import {Input} from 'reactstrap'


function Player(props) {
    const [name, setName] = useState('')

    useEffect(()=>{
        if(name !== ''){
        props.nameParent(name, props.index);
        }
    },[name])

return(
    <div style={{margin:10}}>    
        <Input style={{width:300}} placeholder='New Player' onChange={(e)=>setName(e.target.value)} value={name}/>
    </div>
);
}

export default Player;
import React, {useState, useEffect} from 'react';
import {Button, Input, ListGroup, ListGroupItem} from 'reactstrap'
import './App.css';
import {Link} from 'react-router-dom';
import Player from './components/Player'
import {connect} from 'react-redux';

function Home(props) {
    const [count, setCount] = useState(1);
    const [names, setNames] = useState([]);
    const [gameName, setGameName] = useState('');
    const [games, setGames] = useState([]);

    function changeName(name, i){
        let newNames = [...names];
        newNames[i] = name;
        setNames(newNames);
    }

    let players = []
    for(let i=0; i<count; i++){
        players.push(<Player nameParent={changeName} index={i}/>)
    }

    async function Load(){
        var rawResponse = await fetch('/getGames', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}`
            });
        var response = await rawResponse.json();
        setGames(response);
    }

    var prevGames = games.map(function(element, i){
        return <Link to='/game'><ListGroupItem key={i} onClick={()=>props.addCurrentGame(element._id)}>{element.name}</ListGroupItem></Link>
    });

return(
    <div style={{display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'center', flexDirection:'column'}}> 
        <Button  style={{margin:10}} color="warning" onClick={()=> Load()}>Load Previous Games</Button>
        <ListGroup>
            {prevGames}
        </ListGroup>
        <p style={{marginTop:10, fontSize: 22}}>New Game</p>
        <div style={{margin:15}}>
            <Input style={{width:300}} placeholder='Name your game' onChange={(e)=>setGameName(e.target.value)} value={gameName}/>
         </div> 
        {players}  
        <Button style={{margin:10}} color="secondary" onClick={()=>setCount(count+1)}>+</Button>
        <Link to='/game'><Button  style={{margin:10}} color="warning" onClick={()=>{props.addNames(names); props.newGame(gameName)}}>Play</Button></Link>
    </div>
);
}

function mapDispatchToProps(dispatch) {
    return {
      addNames: function(names) {
          dispatch( {type: 'add', names: names} )
      },
      newGame: function(name) {
        dispatch( {type: 'name', name: name} )
        },
      addCurrentGame: function(id) {
        dispatch( {type: 'id', id: id} )
        }
    }
}

function mapStateToProps(state) {
    return { token: state.token }
   }
   
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);


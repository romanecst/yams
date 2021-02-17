import React, {useState, useEffect} from 'react';
import {Button, Table, Input} from 'reactstrap'
import './App.css';
import Dice from './components/Dice';
import {connect} from 'react-redux';

function Game(props) {

  var tabDiceOrigin = [
    {id:1,value:'',selected:true},
    {id:2,value:'',selected:true},
    {id:3,value:'',selected:true},
    {id:4,value:'',selected:true},
    {id:5,value:'',selected:true},
  ]

  var gridInit = {
    1:null,
    2:null,
    3:null,
    4:null,
    5:null,
    6:null,
    total1:0,
    bonus:0,
    total1b:0,
    max:null,
    min:null,
    total2:0,
    brelan:null,
    psuite:null,
    gsuite:null,
    full:null,
    carre:null,
    yams:null,
    chance:null,
    total3:0,
    total:0

  }

  const [tabValue, setTabValue] = useState(tabDiceOrigin)
  const [compt, setCompt] = useState(0)
  const [grid, setGrid] = useState(gridInit)
  const [gameId, setGameId] = useState('')
  const [disabled, setDisabled] = useState(false);
  const [player, setPlayer] = useState('');
  const [index, setIndex] = useState(0);


  var updateDice = () => {
    var diceTab = [...tabValue]

    for(var i=0;i<diceTab.length;i++){
      if(diceTab[i].selected == true){
        diceTab[i].value = Math.floor(Math.random() * Math.floor(6) + 1);
        diceTab[i].selected = false

      }
    }

    setTabValue(diceTab)
    setCompt(compt+1)
  }

  useEffect(()=>{
    setPlayer(props.players[0]);
    async function loadGrid(){
      var rawResponse =  await fetch('/getGrid', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: '&id='+props.currentGame+'&index='+0
        });
  
      var response = await rawResponse.json();
      setGrid(response.grid);
      props.newGame(response.name);
      setPlayer(response.grid.userName)
      
      var rawResponsePlayers =  await fetch('/getPlayers', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: '&id='+props.currentGame
      });

      var responsePlayers = await rawResponsePlayers.json();
      props.addNames(responsePlayers)
    
    }
    if(props.currentGame){
      setGameId(props.currentGame);
      loadGrid();
    }
  },[])


  useEffect(()=>{
    if(compt === 3){
      setDisabled(true);
    }
  },[compt])


  var updateSelectedDice = (indice,selected) => {
    var diceTab = [...tabValue]
    diceTab[indice].selected = selected
    setTabValue(diceTab)
  }

  var checkPoints = (number) =>{
    let result;
    let val;
    for(let j=0; j<6; j++){
        let array = tabValue.filter(x => x.value === j+1);
        if(array.length >= number){
          val = array[0].value;
          break
        }
    }
    if(val){
        result = number*val;
    }else{
        result = 0;
    }
    return result;
  }

  var checkSuite = (array) =>{
    let sorted = [...array];
    sorted.sort(function(a,b){return a.value-b.value});
    let prev = sorted[0].value-1;
    let suite = true;
    for(let i=0; i<array.length; i++){
        if(prev === sorted[i].value-1){
            prev = sorted[i].value;
        }else{
            suite = false;
            break
        }
    }
    return suite;
  }

  var updateGrid = async (propriete) => {
    setCompt(0);
    setDisabled(false);
    var newGrid = {...grid}

    var totalDice = 0;
      
    if(typeof propriete == 'number'){
        for(var i=0;i<tabValue.length;i++){
            if(tabValue[i].value === propriete){
            totalDice += tabValue[i].value
            }
        }
    }else{  
        for(var i=0;i<tabValue.length;i++){
          totalDice += tabValue[i].value
        }
      }
  
      switch (propriete) {

        case 'min':
        case 'max':
          newGrid[propriete] = totalDice
  
          if(newGrid.min && newGrid.max){
            newGrid.total2 = newGrid.max - newGrid.min
          }

          break;

        case 'brelan':
            newGrid[propriete] = checkPoints(3)
            break;
        case 'carre':
            newGrid[propriete] = checkPoints(4)
            break;
        case 'yams':
            newGrid[propriete] = checkPoints(5)
            break;
        case 'full':
            if(checkPoints(3) !== 0){
                let full = false;
                for(let j=0; j<6; j++){
                    let array = tabValue.filter(x => x.value === j+1);
                    if(array.length === 2){
                      full = true;
                      break
                    }
                }
                if(full){
                    newGrid[propriete] = 25
                }else{
                    newGrid[propriete] = 0
                }
            }else{
                newGrid[propriete] = 0
            }
            break;
        case 'psuite':
            if(checkPoints(2) === 0){
                newGrid[propriete] = checkSuite(tabValue)
            }else if(checkPoints(3) === 0){
                let temp = []
                for(let j=0; j<tabValue.length; j++){
                    let inArray = false
                   for(let k=0; k<temp.length; k++){
                       if(tabValue[j].value === temp[k].value){
                        inArray = true
                       }
                   }
                   if(!inArray){
                       temp.push(tabValue[j])
                   }
                }
                if(checkSuite(temp)){
                    newGrid[propriete] = 30
                }else{
                    newGrid[propriete] = 0
                }
            }else{
                newGrid[propriete] = 0
            }

            break;
        case 'gsuite':
            if(checkPoints(2) === 0){
                if(checkSuite(tabValue)){
                    newGrid[propriete] = 40
                }else{
                    newGrid[propriete] = 0
                }
            }else{
                newGrid[propriete] = 0
            }

            break;
        default:
          var newGrid = {...grid}
          newGrid[propriete] = totalDice
          break;

      }
      
 
      newGrid.total1 = newGrid[1] + newGrid[2] + newGrid[3] + newGrid[4] + newGrid[5] + newGrid[6]

      if(newGrid.total1>63){
        newGrid.bonus = 35;
      }else{
        newGrid.bonus = 0;
      }

      newGrid.total1b = newGrid.total1 + newGrid.bonus

      if(newGrid.min !== null && newGrid.max !== null){
        newGrid.total2 = newGrid.total1b + newGrid.max - newGrid.min
      } else {
        newGrid.total2 = newGrid.total1b
      }

      newGrid.total3 = newGrid.total2 + newGrid.brelan + newGrid.psuite + newGrid.gsuite + newGrid.full + newGrid.carre + newGrid.yams + newGrid.chance
      
      newGrid.total = newGrid.total3 

      newGrid.userName = props.players[index]

      setGrid(newGrid)

      var rawResponse =  await fetch('/saveGrid', {
                  method: 'POST',
                  headers: {'Content-Type':'application/x-www-form-urlencoded'},
                  body: 'grid='+JSON.stringify(newGrid)+'&id='+gameId+'&name='+props.gameName+'&index='+index+'&token='+props.token
                });
      
      var response = await rawResponse.json();

      setGameId(response.id)
 
      if(index+1<props.players.length){
          setIndex(index+1);
          setPlayer(props.players[index+1]);
      }else{
        setIndex(0);
        setPlayer(props.players[0]);
      }

  }

  useEffect(()=>{
    async function loadGrid(){
    var rawResponse =  await fetch('/getGrid', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: '&id='+gameId+'&index='+index
      });

    var response = await rawResponse.json();
    setGrid(response.grid)
    };
    if(gameId !== ''){
      loadGrid()
    }
  },[index])

  var totalDice = 0;
  var tabDice = []
  var bravo = true

  for(var i=0;i<tabValue.length;i++){
    if(tabValue[i].value!= ''){
      tabDice.push(<Dice key={i}  indice={i} selected={tabValue[i].selected} updateSelectedDice={updateSelectedDice} val={tabValue[i].value} />)
      totalDice += tabValue[i].value
    }
    if(tabValue[i].value != 6){
      bravo = false
    }
  }

  var congrat
  if(bravo){
    congrat = <p>Bravo !!!</p>
  }

  return (
    <div className="App">
      <div>
      <div style={{display:'flex', justifyContent:'center', margin:15, fontSize: 22}}>{props.gameName}</div>
        <Button disabled={disabled} onClick={()=>{updateDice()}} color="secondary">Lancer les dés</Button>
        <p>Total des dés : {totalDice}</p>
        <p>Nombre de lancers : {compt}</p>
        <div style={{display:'flex',justifyContent:'center'}}>{tabDice}</div>
        {congrat}
      </div>
      <div >
        <Table bordered style={{marginTop:20, width:'50%'}}>
          <thead>
            <tr>
              <th>{player}</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={()=>{updateGrid(1)}}>
              <td>Un</td>
              <td>{grid[1]}</td>
            </tr>
            <tr onClick={()=>{updateGrid(2)}}>
              <td>Deux</td>
              <td>{grid[2]}</td>
            </tr>
            <tr onClick={()=>{updateGrid(3)}}>
              <td>Trois</td>
              <td>{grid[3]}</td>
            </tr>
            <tr onClick={()=>{updateGrid(4)}}>
              <td>Quatre</td>
              <td>{grid[4]}</td>
            </tr>
            <tr onClick={()=>{updateGrid(5)}}>
              <td>Cinq</td>
              <td>{grid[5]}</td>
            </tr>
            <tr onClick={()=>{updateGrid(6)}}>
              <td>Six</td>
              <td>{grid[6]}</td>
            </tr>

            <tr>
              <td>Total1</td>
              <td>{grid.total1}</td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td>{grid.bonus}</td>
            </tr>
            <tr>
              <td>Total1b</td>
              <td>{grid.total1b}</td>
            </tr>

            <tr onClick={()=>{updateGrid('min')}}>
              <td>Min</td>
              <td>{grid.min}</td>
            </tr>

            <tr onClick={()=>{updateGrid('max')}}>
              <td>Max</td>
              <td>{grid.max}</td>
            </tr>

            <tr>
              <td>Total2</td>
              <td>{grid.total2}</td>
            </tr>

            <tr onClick={()=>{updateGrid('brelan')}}>
              <td>Brelan</td>
              <td>{grid.brelan}</td>
            </tr>

            <tr onClick={()=>{updateGrid('psuite')}}>
              <td>Petite Suite</td>
              <td>{grid.psuite}</td>
            </tr>

            <tr onClick={()=>{updateGrid('gsuite')}}>
              <td>Grande Suite</td>
              <td>{grid.gsuite}</td>
            </tr>

            <tr onClick={()=>{updateGrid('full')}}>
              <td>Full</td>
              <td>{grid.full}</td>
            </tr>

            <tr onClick={()=>{updateGrid('carre')}}>
              <td>Carre</td>
              <td>{grid.carre}</td>
            </tr>

            <tr onClick={()=>{updateGrid('yams')}}>
              <td>yams</td>
              <td>{grid.yams}</td>
            </tr>

            <tr onClick={()=>{updateGrid('chance')}}>
              <td>chance</td>
              <td>{grid.chance}</td>
            </tr>

            <tr>
              <td>Total3</td>
              <td>{grid.total3}</td>
            </tr>

            <tr>
              <td>Total</td>
              <td>{grid.total}</td>
            </tr>

            

          </tbody>
        </Table>
      </div>
      
      
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    newGame: function(name) {
      dispatch( {type: 'name', name: name} )
      },
      addNames: function(names) {
        dispatch( {type: 'add', names: names} )
    }
  }
}

function mapStateToProps(state) {
    return { players: state.names, gameName: state.gameName, token: state.token, currentGame: state.currentGame}
   }


export default connect(
mapStateToProps,
mapDispatchToProps
)(Game);
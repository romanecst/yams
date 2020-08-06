import React, {useState, useEffect} from 'react';
import {Button, Table} from 'reactstrap'
import './App.css';
import Dice from './components/Dice'

function App() {

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


  var getGrid = async () => {
    var rawResponse =  await fetch('/getGrid');

    var response = await rawResponse.json();

    setGrid(response.grid)
  }

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




  var updateSelectedDice = (indice,selected) => {
    var diceTab = [...tabValue]
    diceTab[indice].selected = selected
    setTabValue(diceTab)
  }


  var updateGrid = async (propriete) => {
    var newGrid = {...grid}

      var totalDice = 0

      for(var i=0;i<tabValue.length;i++){
        totalDice += tabValue[i].value
      }

  
      switch (propriete) {

        case 'min':
        case 'max':
          newGrid[propriete] = totalDice
  
          if(newGrid.min && newGrid.max){
            newGrid.total2 = newGrid.max - newGrid.min
          }

          break;


        default:
          var newGrid = {...grid}
          newGrid[propriete] = 0
          break;

      }
      

      if(newGrid.min !== null && newGrid.max !== null){
        newGrid.total2 = newGrid.total1b + newGrid.max - newGrid.min
      } else {
        newGrid.total2 = newGrid.total1b
      }
      

      setGrid(newGrid)

      var rawResponse =  await fetch('/saveGrid', {
                  method: 'POST',
                  headers: {'Content-Type':'application/x-www-form-urlencoded'},
                  body: 'grid='+JSON.stringify(newGrid)+'&id='+gameId
                });
      
      var response = await rawResponse.json();

      setGameId(response.id)


  }


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
        <Button onClick={()=>{getGrid()}} color="warning">Charger la dernière partie</Button>
        <Button onClick={()=>{updateDice()}} color="secondary">Lancer les dés</Button>
        <p>Total des dés : {totalDice}</p>
        <p>Nombre de lancers : {compt}</p>
        <div style={{display:'flex',justifyContent:'center'}}>{tabDice}</div>
        {congrat}
      </div>
      <div >
        <Table bordered style={{marginTop:20, width:'50%'}}>
          <thead>
            <tr>
              <th></th>
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

            <tr onClick={()=>{console.log('ici');updateGrid('min')}}>
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

export default App;

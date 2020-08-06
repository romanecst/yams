import React, {useState} from 'react';

function Dice(props) {

    var updateDice = (indice) => {

            const isSelected = !props.selected
            props.updateSelectedDice(indice,isSelected)
        
    }


    var styleImg = {
                    width:100
                    }

    if(props.selected === true ){
        styleImg.border = 'solid'
    }

    var src = `/img/${props.val}.png`

    if(props.val==='') return (null)
    
    return (
    <div>
        <img onClick={ ()=>updateDice(props.indice)} style={styleImg} src={src} alt="dé"/>
    </div>

    );
}

export default Dice;
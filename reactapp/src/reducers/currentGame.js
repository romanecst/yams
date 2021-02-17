export default function(currentGame = '', action) {
 
    if(action.type == 'id') {
      return action.id;
    } else {
      return currentGame ;
    }
    
   }
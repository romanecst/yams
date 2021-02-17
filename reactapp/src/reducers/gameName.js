export default function(gameName = '', action) {
 
    if(action.type == 'name') {
      return action.name;
    } else {
      return gameName;
    }
    
   }
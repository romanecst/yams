export default function(names = [], action) {
 
    if(action.type == 'add') {
      return action.names;
    } else {
      return names;
    }
    
   }
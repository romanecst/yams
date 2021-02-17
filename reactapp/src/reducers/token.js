export default function(token='', action) {
    if(action.type == 'token') {
        var newToken = action.token;
        return newToken
    }else{
        return token
    }
}
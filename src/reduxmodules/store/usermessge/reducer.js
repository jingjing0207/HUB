const Token = (state = {} , action = {}) => {
    
    switch(action.type){
        
        case 'TOKEN':
            
            state=Object.assign({},{token:action.token})
            
            return state
        
        default:
            
            return state;
    }
};

export default Token

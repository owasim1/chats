import React from 'react'
import io from 'socket.io-client'

export const CTX = React.createContext();
const initState = {
    general: [
        {from: 'Jimmy', msg: 'Hello'},
        {from: 'John', msg: 'We are in general'},
        {from: 'Will', msg: 'fadfda'}
    ],
    topic2: [
        {from: 'Stefan', msg: 'Hi'},
        {from: 'Elena', msg: 'We are in topic2'},
        {from: 'Damon', msg: 'topic2 is better'},
    ]
}
function reducer(state, action){
    const {from, msg, topic} = action.payload;
    switch(action.type){
        case'RECEIVE_MESSAGE':
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {from, msg}
                ]
            }
        default:
            return state
    }
}

let socket;

function sendChatAction(value) {
    socket.emit('chat message', value);
}

export default function Store(props) {
    const [allChats, dispatch] = React.useReducer(reducer, initState)

    if (!socket) {
        socket = io(':3001')
        socket.on('chat message', function(msg){
            console.log({msg})
            dispatch({type:'RECEIVE_MESSAGE', payload: msg})
        });
    }

    const user = 'Omar' + Math.random(100).toFixed(2)


    return (
        <CTX.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}

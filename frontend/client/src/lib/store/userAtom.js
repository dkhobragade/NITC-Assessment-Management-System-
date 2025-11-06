import {atom} from 'jotai'


export const userAtom =atom({
    user:{
        name:'',
        email:'',
        id:'',
        role:'',
        sID:''
    }
})


export const roleType=atom('Admin')



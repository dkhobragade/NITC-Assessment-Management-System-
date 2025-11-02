import {atom} from 'jotai'


export const userAtom =atom({
    user:{
        name:'',
        email:'',
        id:'',
        role:''
    }
})


export const roleType=atom('Admin')



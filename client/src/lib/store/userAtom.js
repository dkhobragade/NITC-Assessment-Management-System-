import {atom} from 'jotai'


export const userAtom=atom({
    name:'',
    email:'',
    collegeId:'',
    role:''
})

export const selectedRole = atom("Admin")
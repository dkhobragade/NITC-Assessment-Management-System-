import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title, } from '@mantine/core';
import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { selectedRole, userAtom } from '../lib/store/userAtom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { postWrapper } from '../lib/api/postWrapper';


const LoginPage = () =>
{
    const [ formData, setFormData ] = useState( {
        email: '',
        password: ''
    } )

    const navigate = useNavigate()
    const [ selectedProfile ] = useAtom( selectedRole )
    const [ isLoading, setIsLoading ] = useState( false )
    const setUserAtom = useSetAtom( userAtom )
    const setSelectedRole = useSetAtom( selectedRole )

    const onClickSubmit = () =>
    {
        if ( formData.password.trim() == '' || formData.email.trim() == '' )
        {
            return toast.error( "Please fill all the fields" )
        }
        else
        {
            setIsLoading( true )
            postWrapper( 'auth/login', {
                email: formData.email,
                password: formData.password
            } ).then( ( resp ) =>
            {
                if ( resp.message )
                {
                    toast.success( resp.message )
                    setUserAtom( {
                        name: resp.user.name,
                        email: resp.user.email,
                        role: resp.user.role,
                        collegeId: resp.user.collegeId,
                    } );

                    if ( resp.user.role === "Admin" )
                    {
                        navigate( "/admin-overview" );
                    } else if ( resp.user.role === "Faculty" )
                    {
                        navigate( "/faculty-overview" );
                    } else if ( resp.user.role === "Evaluator" )
                    {
                        navigate( "/evaluator-overview" );
                    } else if ( resp.user.role === "Student" )
                    {
                        navigate( "/student-overview" );
                    }
                }
                setSelectedRole( resp.user.role );
            } ).catch( ( error ) =>
            {
                toast.info( error.message )

            } ).finally( () =>
            {
                setIsLoading( false )
                setFormData( {
                    email: '',
                    password: ''
                } )
            } )
        }
    }


    const onChangeEmail = ( e ) =>
    {
        setFormData( prev => ( { ...prev, email: e.target.value } ) );
    }

    const onChangePassword = ( e ) =>
    {
        setFormData( prev => ( { ...prev, password: e.target.value } ) );
    }


    return <Container size={ 420 } my={ 40 }>
        <Title ta="center" className="title">
            Welcome back!
        </Title>
        <Text ta="center" >
            ({ selectedProfile })
        </Text>
        <Paper withBorder shadow="sm" p={ 22 } mt={ 30 } radius="md">
            <TextInput onChange={ onChangeEmail } label="Email" placeholder="@nitc.ac.in" required radius="md" />
            <PasswordInput onChange={ onChangePassword } label="Password" placeholder="password" required mt="md" radius="md" />
            {/* <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Anchor component="button" size="sm">
                    Forgot password?
                </Anchor>
            </Group> */}
            <Button loading={ isLoading } fullWidth mt="xl" radius="md" onClick={ onClickSubmit }>
                Sign in
            </Button>
            <Text ta="center" c="dimmed" size="sm" mt={ 5 }>
                Do not have an account yet? <Anchor onClick={ () => navigate( "/signup" ) }>Create account</Anchor>
            </Text>
        </Paper>
    </Container>
}

export default LoginPage
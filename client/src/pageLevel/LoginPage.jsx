import { Anchor, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { selectedRole, userAtom } from '../lib/store/userAtom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { postWrapper } from '../lib/api/postWrapper';

const LoginPage = () =>
{
    const [ formData, setFormData ] = useState( { email: '', password: '' } );

    const navigate = useNavigate();
    const [ selectedProfile ] = useAtom( selectedRole );
    const [ isLoading, setIsLoading ] = useState( false );
    const setUserAtom = useSetAtom( userAtom );
    const setSelectedRole = useSetAtom( selectedRole );

    const onClickSubmit = () =>
    {
        if ( !formData.password.trim() || !formData.email.trim() )
        {
            return toast.error( "Please fill all the fields" );
        }

        if ( !formData.email.toLowerCase().endsWith( "@nitc.ac.in" ) )
        {
            return toast.info( "Not a valid institutional email" );
        }

        setIsLoading( true );
        postWrapper( 'auth/login', {
            email: formData.email,
            password: formData.password
        } ).then( ( resp ) =>
        {
            if ( resp.message )
            {
                toast.success( resp.message );
                setUserAtom( {
                    name: resp.user.name,
                    email: resp.user.email,
                    role: resp.user.role,
                    collegeId: resp.user.collegeId,
                } );
                localStorage.setItem( "user", JSON.stringify( resp.user ) );
                setSelectedRole( resp.user.role );

                const role = resp.user.role;
                if ( role === "Admin" ) navigate( "/admin-overview" );
                else if ( role === "Faculty" ) navigate( "/faculty-overview" );
                else if ( role === "Evaluator" ) navigate( "/evaluator-overview" );
                else if ( role === "Student" ) navigate( "/student-overview" );
            }
        } ).catch( ( error ) =>
        {
            toast.info( error.message );
        } ).finally( () =>
        {
            setIsLoading( false );
            setFormData( { email: '', password: '' } );
        } );
    };

    return (
        <Container size={ 420 } my={ 40 }>
            <Title ta="center" className="title">
                Welcome back!
            </Title>
            <Text ta="center">({ selectedProfile })</Text>
            <Paper withBorder shadow="sm" p={ 22 } mt={ 30 } radius="md">
                <TextInput
                    onChange={ ( e ) => setFormData( prev => ( { ...prev, email: e.target.value } ) ) }
                    label="Email"
                    placeholder="@nitc.ac.in"
                    value={ formData.email }
                    required
                    radius="md"
                />
                <PasswordInput
                    onChange={ ( e ) => setFormData( prev => ( { ...prev, password: e.target.value } ) ) }
                    label="Password"
                    placeholder="password"
                    value={ formData.password }
                    required
                    mt="md"
                    radius="md"
                />
                {/* Forgot password link aligned to right */ }
                <Group position="right" mt="sm">
                    <Anchor component="button" size="sm" onClick={ () => navigate( "/forgot-password" ) }>
                        Forgot password?
                    </Anchor>
                </Group>
                <Button
                    loading={ isLoading }
                    fullWidth
                    mt="xl"
                    radius="md"
                    onClick={ onClickSubmit }
                >
                    Sign in
                </Button>
                <Text ta="center" c="dimmed" size="sm" mt={ 5 }>
                    Do not have an account yet?{ " " }
                    <Anchor onClick={ () => navigate( "/signup" ) }>Create account</Anchor>
                </Text>
            </Paper>
        </Container>
    );
};

export default LoginPage;

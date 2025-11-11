import { Container, Title, Text, Paper, TextInput, PasswordInput, Button, Anchor, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { selectedRole, userAtom } from "../lib/store/userAtom";
import { postWrapper } from "../lib/api/postWrapper";
import { toast } from "react-toastify";

const SignupPage = () =>
{
    const [ selectedProfile ] = useAtom( selectedRole );
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState( {
        name: "",
        collegeId: "",
        email: "",
        password: "",
    } );
    const [ isLoading, setIsLoading ] = useState( false );
    const setUserAtom = useSetAtom( userAtom );

    const handleChange = ( e ) =>
    {
        setFormData( { ...formData, [ e.target.name ]: e.target.value } );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        if (
            !formData.name?.trim() ||
            !formData.email?.trim() ||
            !formData.collegeId?.trim() ||
            !formData.password?.trim()
        )
        {
            return toast.error( "Please fill all the fields" );
        }

        if ( !formData.email.toLowerCase().endsWith( "@nitc.ac.in" ) )
        {
            return toast.info( "Not a valid institutional email" );
        }

        setIsLoading( true );

        postWrapper( "auth/signup", {
            name: formData.name,
            email: formData.email,
            collegeId: formData.collegeId,
            password: formData.password,
            role: selectedProfile,
        } )
            .then( ( resp ) =>
            {
                if ( resp.message )
                {
                    toast.success( resp.message );

                    setUserAtom( {
                        name: resp.name,
                        email: resp.email,
                        collegeId: resp.collegeId,
                        role: resp.role,
                        isApproved: resp.isApproved,
                    } );

                    if ( selectedProfile === "Admin" )
                    {
                        navigate( "/admin-overview" );
                        return;
                    }

                    if ( !resp.isApproved )
                    {
                        if ( selectedProfile === "Faculty" )
                        {
                            toast.info( "Your account is pending approval from the Admin." );
                        } else if ( selectedProfile === "Evaluator" || selectedProfile === "Student" )
                        {
                            toast.info( "Your account is pending approval from the Faculty." );
                        }

                        navigate( "/login" );
                        return;
                    }

                    if ( selectedProfile === "Faculty" )
                    {
                        navigate( "/faculty-overview" );
                    } else if ( selectedProfile === "Evaluator" )
                    {
                        navigate( "/evaluator-overview" );
                    } else if ( selectedProfile === "Student" )
                    {
                        navigate( "/student-overview" );
                    }
                }
            } )
            .catch( ( resp ) =>
            {
                toast.error( resp.message );
            } )
            .finally( () =>
            {
                setFormData( {
                    name: "",
                    email: "",
                    collegeId: "",
                    password: "",
                } );
                setIsLoading( false );
            } );
    };


    return (
        <Container size={ 420 } my={ 40 }>
            <Title ta="center" className="title">
                Create an Account
            </Title>
            <Text ta="center">({ selectedProfile })</Text>
            <Paper
                withBorder
                shadow="sm"
                p={ 22 }
                mt={ 30 }
                radius="md"
                component="form"
                onSubmit={ handleSubmit }
            >
                <TextInput
                    label="Full Name"
                    placeholder="name"
                    name="name"
                    value={ formData.name }
                    onChange={ handleChange }
                    required
                    radius="md"
                />

                <TextInput
                    label="College ID"
                    placeholder="e.g. 23CS123"
                    name="collegeId"
                    value={ formData.collegeId }
                    onChange={ handleChange }
                    required
                    mt="md"
                    radius="md"
                />

                <TextInput
                    label="Email"
                    placeholder="nitc.ac.in"
                    name="email"
                    value={ formData.email }
                    onChange={ handleChange }
                    required
                    mt="md"
                    radius="md"
                />

                <PasswordInput
                    label="Password"
                    placeholder="password"
                    name="password"
                    value={ formData.password }
                    onChange={ handleChange }
                    required
                    mt="md"
                    radius="md"
                />

                <Group justify="flex-end" mt="lg">
                    <Button loading={ isLoading } type="submit" fullWidth radius="md">
                        Sign up
                    </Button>
                </Group>
                <Text ta="center" c="dimmed" size="sm" mt={ 5 }>
                    Already have an account?{ " " }
                    <Anchor
                        size="sm"
                        onClick={ () => navigate( "/login" ) }
                        style={ { cursor: "pointer" } }
                    >
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
};

export default SignupPage;

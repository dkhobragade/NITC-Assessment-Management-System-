import
{
    Container,
    Title,
    Text,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Anchor,
    Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAtom } from "jotai";
import { selectedRole } from "../lib/store/userAtom";

const SignupPage = () =>
{
    const [ selectedProfile ] = useAtom( selectedRole )
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState( {
        name: "",
        collegeId: "",
        email: "",
        password: "",
    } );

    const handleChange = ( e ) =>
    {
        setFormData( { ...formData, [ e.target.name ]: e.target.value } );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        console.log( formData );
    };

    return (
        <Container size={ 420 } my={ 40 }>
            <Title ta="center" className="title">
                Create an Account
            </Title>
            <Text ta="center" >
                ({ selectedProfile })
            </Text>
            <Paper withBorder shadow="sm" p={ 22 } mt={ 30 } radius="md" component="form" onSubmit={ handleSubmit }>
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
                    <Button type="submit" fullWidth radius="md">
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

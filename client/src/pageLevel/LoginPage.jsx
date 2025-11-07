import
{
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { selectedRole } from '../lib/store/userAtom';


const LoginPage = () =>
{
    const navigate = useNavigate()
    const [ selectedProfile ] = useAtom( selectedRole )

    return <Container size={ 420 } my={ 40 }>
        <Title ta="center" className="title">
            Welcome back!
        </Title>
        <Text ta="center" >
            ({ selectedProfile })
        </Text>
        <Paper withBorder shadow="sm" p={ 22 } mt={ 30 } radius="md">
            <TextInput label="Email" placeholder="@nitc.ac.in" required radius="md" />
            <PasswordInput label="Password" placeholder="password" required mt="md" radius="md" />
            {/* <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Anchor component="button" size="sm">
                    Forgot password?
                </Anchor>
            </Group> */}
            <Button fullWidth mt="xl" radius="md">
                Sign in
            </Button>
            <Text ta="center" c="dimmed" size="sm" mt={ 5 }>
                Do not have an account yet? <Anchor onClick={ () => navigate( "/signup" ) }>Create account</Anchor>
            </Text>
        </Paper>
    </Container>
}

export default LoginPage
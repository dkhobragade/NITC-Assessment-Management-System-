import { IconArrowLeft } from '@tabler/icons-react';
import { Anchor, Button, Container, Group, Paper, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postWrapper } from '../lib/api/postWrapper';

export function ForgotPassword ()
{
    const navigate = useNavigate();
    const [ email, setEmail ] = useState( '' );
    const [ newPassword, setNewPassword ] = useState( '' );
    const [ emailVerified, setEmailVerified ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( false );

    const handleVerifyEmail = async () =>
    {
        if ( !email.trim() ) return toast.info( 'Please enter your email' );
        if ( !email.toLowerCase().endsWith( '@nitc.ac.in' ) )
            return toast.info( 'Not a valid institutional email' );

        setIsLoading( true );
        try
        {
            const resp = await postWrapper( 'auth/forgot-password', { email } );
            if ( resp.success )
            {
                toast.success( resp.message );
                setEmailVerified( true );
            }
        } catch ( err )
        {
            toast.error( err.message || 'Email not found' );
        } finally
        {
            setIsLoading( false );
        }
    };

    const handleResetPassword = async () =>
    {
        if ( !newPassword.trim() ) return toast.error( 'Please enter a new password' );

        setIsLoading( true );
        try
        {
            const resp = await postWrapper( 'auth/reset-password', { email, newPassword } );
            if ( resp.success )
            {
                toast.success( resp.message );
                navigate( '/login' );
            }
        } catch ( err )
        {
            toast.error( err.message || 'Failed to reset password' );
        } finally
        {
            setIsLoading( false );
        }
    };

    return (
        <Container size={ 460 } my={ 30 }>
            <Title ta="center">Forgot your password?</Title>

            <Paper withBorder shadow="md" p={ 30 } radius="md" mt="xl">
                <TextInput
                    label="Your email"
                    placeholder="example@nitc.ac.in"
                    value={ email }
                    onChange={ ( e ) => setEmail( e.target.value ) }
                    disabled={ emailVerified }
                    required
                />

                { emailVerified && (
                    <TextInput
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        mt="md"
                        value={ newPassword }
                        onChange={ ( e ) => setNewPassword( e.target.value ) }
                        required
                    />
                ) }

                <Group justify="space-between" mt="lg">
                    <Anchor component="button" size="sm" onClick={ () => navigate( '/login' ) }>
                        <IconArrowLeft size={ 12 } stroke={ 1.5 } />
                        Back to login
                    </Anchor>

                    <Button onClick={ emailVerified ? handleResetPassword : handleVerifyEmail } loading={ isLoading }>
                        { emailVerified ? 'Reset Password' : 'Verify Email' }
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
}

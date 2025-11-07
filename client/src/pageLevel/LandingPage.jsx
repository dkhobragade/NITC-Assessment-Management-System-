import { Card, Text, Title, Container, SimpleGrid } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { selectedRole } from '../lib/store/userAtom';

const LandingPage = () =>
{
    const navigate = useNavigate()
    const setProfile = useSetAtom( selectedRole )

    const onClickBox = ( role ) =>
    {
        setProfile( role )
        navigate( '/signup' )
    }


    return (
        <Container
            size="xl"
            style={ {
                paddingTop: '80px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            } }
        >
            <Title order={ 2 } mb="xl" style={ { fontWeight: 700 } }>
                Welcome to the NITC Portal
            </Title>

            <SimpleGrid
                cols={ 2 }
                spacing="xl"
                verticalSpacing="xl"
                breakpoints={ [ { maxWidth: 'sm', cols: 1 } ] }
                style={ { width: '100%', maxWidth: '900px' } }
            >
                { [ 'Admin', 'Faculty', 'Evaluator', 'Student' ].map( ( role, i ) => (
                    <Card
                        onClick={ () => onClickBox( role ) }
                        key={ i }
                        shadow="xl"
                        padding="xl"
                        radius="xl"
                        withBorder
                        style={ {
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, background-color 0.3s',
                        } }
                        onMouseEnter={ ( e ) =>
                        {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.backgroundColor = '#e7f5ff';
                        } }
                        onMouseLeave={ ( e ) =>
                        {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                        } }
                    >
                        <Text fz="xl" fw={ 700 }>
                            { role }
                        </Text>
                    </Card>
                ) ) }
            </SimpleGrid>
        </Container>
    );
};

export default LandingPage;

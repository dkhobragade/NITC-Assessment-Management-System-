import { useState } from 'react';
import { Card, Grid, Text, Title, TextInput, Button, Group, Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

const StudentOverview = () =>
{
    const totalTask = 12;
    const totalEnrolledCourses = 8;
    const [ enrollCode, setEnrollCode ] = useState( '' );
    const [ enrolled, setEnrolled ] = useState( false );

    const handleEnroll = () =>
    {
        if ( !enrollCode.trim() )
        {
            alert( '⚠️ Please enter an enrollment code!' );
            return;
        }
        // In actual implementation, this will call your API to enroll the student
        setEnrolled( true );
        setEnrollCode( '' );
    };

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">
                Student Overview
            </Title>

            {/* Stats Section */ }
            <Grid gutter="xl">
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Task
                        </Text>
                        <Title order={ 1 } c="blue">
                            { totalTask }
                        </Title>
                    </Card>
                </Grid.Col>

                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Enrolled Courses
                        </Text>
                        <Title order={ 1 } c="green">
                            { totalEnrolledCourses }
                        </Title>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Enrollment Section */ }
            <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
                <Title order={ 3 } mb="md">
                    Enroll in a Course
                </Title>
                <Group align="flex-end" gap="md">
                    <TextInput
                        label="Enter Enrollment Code"
                        placeholder="e.g., CS2025X"
                        value={ enrollCode }
                        onChange={ ( e ) => setEnrollCode( e.currentTarget.value ) }
                        style={ { flex: 1 } }
                    />
                    <Button color="blue" onClick={ handleEnroll }>
                        Enroll
                    </Button>
                </Group>

                { enrolled && (
                    <Notification
                        icon={ <IconCheck size={ 18 } /> }
                        color="teal"
                        title="Enrollment Successful"
                        mt="md"
                        onClose={ () => setEnrolled( false ) }
                    >
                        You have been successfully enrolled in the course!
                    </Notification>
                ) }
            </Card>
        </div>
    );
};

export default StudentOverview;

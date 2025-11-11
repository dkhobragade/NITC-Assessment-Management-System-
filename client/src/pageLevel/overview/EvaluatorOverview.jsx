import { Card, Grid, Text, Title, Stack, Collapse } from '@mantine/core';
import { useEffect, useState } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';

const EvaluatorOverview = () =>
{
    const [ totalStudent, setTotalStudent ] = useState( 0 );
    const [ taskCreated, setTaskCreated ] = useState( 0 );
    const [ students, setStudents ] = useState( [] );
    const [ showStudents, setShowStudents ] = useState( false );

    useEffect( () =>
    {
        getCreatedTask();
        getAssignedStudents();
    }, [] );

    const getCreatedTask = () =>
    {
        fetchWrapper( 'evaluator/all-tasks' )
            .then( ( resp ) =>
            {
                if ( resp.success ) setTaskCreated( resp.totalTasks || 0 );
            } )
            .catch( ( err ) => toast.error( err.message ) );
    };

    const getAssignedStudents = () =>
    {
        fetchWrapper( 'evaluator/assigned-students' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setTotalStudent( resp.evaluator?.assignedStudentsCount || 0 );

                    setStudents( resp.assignedStudents || [] );
                }
            } )
            .catch( ( err ) => toast.error( err.message ) );
    };

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">Evaluator Overview</Title>

            <Grid gutter="xl">
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">Task Count</Text>
                        <Title order={ 1 } c="blue">{ taskCreated }</Title>
                    </Card>
                </Grid.Col>

                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={ { cursor: 'pointer' } }
                        onClick={ () => setShowStudents( ( prev ) => !prev ) }
                    >
                        <Text size="lg" fw={ 500 } mb="xs">Number of Assigned Students</Text>
                        <Title order={ 1 } c="green">{ totalStudent }</Title>

                        <Collapse in={ showStudents }>
                            <Stack spacing="sm" mt="md">
                                { students.length === 0 ? (
                                    <Text c="dimmed">No students assigned.</Text>
                                ) : (
                                    students.map( ( s ) => (
                                        <Card key={ s._id } shadow="xs" padding="sm" radius="sm" withBorder>
                                            <Text fw={ 500 }>{ s.name }</Text>
                                            <Text size="sm" c="dimmed">{ s.email }</Text>
                                            <Text size="sm" c="dimmed">
                                                Courses: { s.enrolledCourses.map( ec => ec.enrollmentCode ).join( ', ' ) }
                                            </Text>
                                        </Card>
                                    ) )
                                ) }
                            </Stack>
                        </Collapse>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default EvaluatorOverview;

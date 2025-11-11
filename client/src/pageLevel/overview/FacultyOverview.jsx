import { Card, Grid, Text, Title, Stack, Collapse } from '@mantine/core';
import { useEffect, useState } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const FacultyOverview = () =>
{
    const [ assignedCourse, setAssignedCourse ] = useState( '' );
    const [ taskCreated, setTaskCreated ] = useState( 0 );
    const [ tasks, setTasks ] = useState( [] );
    const [ showTasks, setShowTasks ] = useState( false );

    useEffect( () =>
    {
        getAssignedCourse();
        getCreatedTask();
    }, [] );

    const getAssignedCourse = () =>
    {
        fetchWrapper( 'faculty/assigned-courses' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setAssignedCourse( resp.assignedCourses[ 0 ]?.name || '-' );
                }
            } )
            .catch( ( err ) =>
            {
                toast.error( err.message );
            } );
    };

    const getCreatedTask = () =>
    {
        fetchWrapper( 'faculty/task' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setTaskCreated( resp.totalTasks || 0 );
                    setTasks( resp.tasks || [] );
                }
            } )
            .catch( ( err ) =>
            {
                toast.error( err.message );
            } );
    };

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">
                Faculty Overview
            </Title>

            <Grid gutter="xl">
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Assigned Course
                        </Text>
                        <Title order={ 1 } c="blue">
                            { assignedCourse }
                        </Title>
                    </Card>
                </Grid.Col>

                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={ { cursor: 'pointer' } }
                        onClick={ () => setShowTasks( ( prev ) => !prev ) }
                    >
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Task
                        </Text>
                        <Title order={ 1 } c="green">
                            { taskCreated }
                        </Title>

                        <Collapse in={ showTasks }>
                            <Stack spacing="sm" mt="md">
                                { tasks.length === 0 ? (
                                    <Text c="dimmed">No tasks available.</Text>
                                ) : (
                                    tasks.map( ( task ) => (
                                        <Card key={ task._id } shadow="xs" padding="sm" radius="sm" withBorder>
                                            <Text fw={ 500 }>{ task.title }</Text>
                                            <Text size="sm" c="dimmed">
                                                { task.description }
                                            </Text>
                                            <Text size="sm" c="blue">
                                                Deadline: { dayjs( task.deadline ).format( 'DD MMM YYYY' ) }
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

export default FacultyOverview;

import { Card, Grid, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';

const FacultyOverview = () =>
{

    const [ assignedCourse, setAssignedCourse ] = useState( '' )
    const taskCreated = 8;

    useEffect( () =>
    {
        getAssignedCourse()
    }, [] )

    const getAssignedCourse = () =>
    {
        fetchWrapper( 'faculty/assigned-courses' ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                setAssignedCourse( resp.assignedCourses[ 0 ].name )
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } )
    }


    return <div style={ { padding: '20px' } }>
        <Title order={ 2 } mb="lg">Faculty Overview</Title>

        <Grid gutter="xl">
            {/* Assigned Course  */ }
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

            {/* Task Count Box */ }
            <Grid.Col span={ { base: 12, sm: 6 } }>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={ 500 } mb="xs">
                        Total Task
                    </Text>
                    <Title order={ 1 } c="green">
                        { taskCreated }
                    </Title>
                </Card>
            </Grid.Col>
        </Grid>
    </div>
}

export default FacultyOverview
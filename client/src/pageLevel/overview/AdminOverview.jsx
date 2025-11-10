import { Card, Grid, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper'
import { toast } from 'react-toastify';

const AdminOverview = () =>
{
    const [ coursesCount, setCoursesCount ] = useState( 0 )
    const [ facultyCount, setFacultyCount ] = useState( 0 )

    useEffect( () =>
    {
        getFacultyCount()
        getCoursesCount()
    }, [] )

    const getFacultyCount = () =>
    {
        fetchWrapper( 'admin/faculty-count' ).then( ( resp ) =>
        {
            if ( resp )
            {
                setFacultyCount( resp.count )
            }
        } ).catch( ( error ) =>
        {
            toast.error( error.message.message )
        } )
    }

    const getCoursesCount = () =>
    {
        fetchWrapper( 'admin/courses-count' ).then( ( resp ) =>
        {
            if ( resp )
            {
                setCoursesCount( resp.count )
            }
        } ).catch( ( error ) =>
        {
            toast.error( error.message.message )
        } )
    }

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">Admin Overview</Title>

            <Grid gutter="xl">
                {/* Faculty Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Faculty
                        </Text>
                        <Title order={ 1 } c="blue">
                            { facultyCount }
                        </Title>
                    </Card>
                </Grid.Col>

                {/* Course Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={ 500 } mb="xs">
                            Total Courses
                        </Text>
                        <Title order={ 1 } c="green">
                            { coursesCount }
                        </Title>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default AdminOverview;

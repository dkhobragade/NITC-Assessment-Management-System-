import { Card, Grid, Text, Title, Stack, Collapse } from '@mantine/core';
import { useState, useEffect } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';

const AdminOverview = () =>
{
    const [ coursesCount, setCoursesCount ] = useState( 0 );
    const [ facultyCount, setFacultyCount ] = useState( 0 );
    const [ courses, setCourses ] = useState( [] );
    const [ faculty, setFaculty ] = useState( [] );
    const [ showCourses, setShowCourses ] = useState( false );
    const [ showFaculty, setShowFaculty ] = useState( false ); // toggle for faculty

    useEffect( () =>
    {
        getFacultyCount();
        getCoursesCount();
    }, [] );

    const getFacultyCount = () =>
    {
        fetchWrapper( 'admin/faculty-count' ) // changed to fetch list
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setFacultyCount( resp.count );
                    setFaculty( resp.faculty || [] );
                }
            } )
            .catch( ( error ) => toast.error( error.message || 'Error fetching faculty' ) );
    };

    const getCoursesCount = () =>
    {
        fetchWrapper( 'admin/courses-count' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setCoursesCount( resp.count );
                    setCourses( resp.courses || [] );
                }
            } )
            .catch( ( error ) => toast.error( error.message || 'Error fetching courses' ) );
    };

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">Admin Overview</Title>

            <Grid gutter="xl">
                {/* Faculty Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={ { cursor: 'pointer' } }
                        onClick={ () => setShowFaculty( ( prev ) => !prev ) }
                    >
                        <Text size="lg" fw={ 500 } mb="xs">Total Faculty</Text>
                        <Title order={ 1 } c="blue">{ facultyCount }</Title>

                        <Collapse in={ showFaculty }>
                            <Stack spacing="sm" mt="md">
                                { faculty.length === 0 ? (
                                    <Text c="dimmed">No faculty available.</Text>
                                ) : (
                                    faculty.map( ( f ) => (
                                        <Card key={ f._id } shadow="xs" padding="sm" radius="sm" withBorder>
                                            <Text fw={ 500 }>{ f.name }</Text>
                                            <Text size="sm" c="dimmed">{ f.email }</Text>
                                        </Card>
                                    ) )
                                ) }
                            </Stack>
                        </Collapse>
                    </Card>
                </Grid.Col>

                {/* Courses Count Box */ }
                <Grid.Col span={ { base: 12, sm: 6 } }>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={ { cursor: 'pointer' } }
                        onClick={ () => setShowCourses( ( prev ) => !prev ) }
                    >
                        <Text size="lg" fw={ 500 } mb="xs">Total Courses</Text>
                        <Title order={ 1 } c="green">{ coursesCount }</Title>

                        <Collapse in={ showCourses }>
                            <Stack spacing="sm" mt="md">
                                { courses.length === 0 ? (
                                    <Text c="dimmed">No courses available.</Text>
                                ) : (
                                    courses.map( ( course ) => (
                                        <Card key={ course._id } shadow="xs" padding="sm" radius="sm" withBorder>
                                            <Text fw={ 500 }>{ course.name }</Text>
                                            <Text size="sm" c="dimmed">Code: { course.code }</Text>
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

export default AdminOverview;

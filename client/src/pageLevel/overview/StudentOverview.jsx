import { useEffect, useState } from 'react';
import { Card, Grid, Text, Title, TextInput, Button, Group, Notification, Table, ScrollArea, Loader } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { postWrapper } from '../../lib/api/postWrapper';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';

const StudentOverview = () =>
{
    const [ totalTask, setTotalTask ] = useState( 0 );
    const [ totalEnrolledCourses, setTotalEnrolledCourses ] = useState( 0 );
    const [ enrollCode, setEnrollCode ] = useState( '' );
    const [ enrolled, setEnrolled ] = useState( false );
    const [ courses, setCourses ] = useState( [] );
    const [ loadingCourses, setLoadingCourses ] = useState( false );

    useEffect( () =>
    {
        getEnrolledCourseCount();
        getEnrolledCourseTaskCount();
        getCourseList();
    }, [] );

    const getEnrolledCourseCount = () =>
    {
        fetchWrapper( 'student/enrollments' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setTotalEnrolledCourses( resp.courses.length || 0 );
                }
            } )
            .catch( ( err ) => toast.error( err.message ) );
    };

    const getEnrolledCourseTaskCount = () =>
    {
        fetchWrapper( 'student/enrollments-with-tasks' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    // ✅ Sum up all taskCounts
                    const totalTaskCount = resp.courses.reduce(
                        ( sum, course ) => sum + ( course.taskCount || 0 ),
                        0
                    );

                    setTotalTask( totalTaskCount );
                }
            } )
            .catch( ( err ) => toast.error( err.message ) );
    };


    const getCourseList = () =>
    {
        setLoadingCourses( true );
        fetchWrapper( 'student/list' )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    setCourses( resp.courses );
                }
            } )
            .catch( ( err ) => toast.error( err.message ) )
            .finally( () => setLoadingCourses( false ) );
    };

    const handleEnroll = () =>
    {
        if ( !enrollCode.trim() )
        {
            toast.info( 'Please enter an enrollment code!' );
            return;
        }

        postWrapper( 'student/enroll', { enrollmentCode: enrollCode } )
            .then( ( resp ) =>
            {
                if ( resp.success )
                {
                    toast.success( resp.message );
                    setEnrolled( true );
                }
            } )
            .catch( ( err ) => toast.info( err.message ) )
            .finally( () => setEnrollCode( '' ) );
    };

    return (
        <div style={ { padding: '20px' } }>
            <Title order={ 2 } mb="lg">
                Student Overview
            </Title>

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

            <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl">
                <Title order={ 3 } mb="md">
                    Enroll in a Course
                </Title>

                <Grid gutter="lg">
                    <Grid.Col span={ { base: 12, md: 6 } }>
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
                    </Grid.Col>

                    {/* Course List Table */ }
                    <Grid.Col span={ { base: 12, md: 6 } }>
                        <Title order={ 4 } mb="sm">
                            Available Courses
                        </Title>
                        <ScrollArea h={ 200 }>
                            { loadingCourses ? (
                                <Loader size="sm" />
                            ) : (
                                <Table striped highlightOnHover withBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Course Name</Table.Th>
                                            <Table.Th>Course Code</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        { courses.map( ( c ) => (
                                            <Table.Tr key={ c._id }>
                                                <Table.Td>{ c.name }</Table.Td>
                                                <Table.Td>{ c.code }</Table.Td>
                                            </Table.Tr>
                                        ) ) }
                                    </Table.Tbody>
                                </Table>
                            ) }
                        </ScrollArea>
                    </Grid.Col>
                </Grid>
            </Card>
        </div>
    );
};

export default StudentOverview;

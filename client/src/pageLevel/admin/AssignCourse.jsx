import { useState } from 'react';
import { Select, Button, Card, Title, Group, Box, Table } from '@mantine/core';
import { useEffect } from 'react';
import { fetchWrapper } from '../../lib/api/fetchWrapper';
import { toast } from 'react-toastify';
import { postWrapper } from '../../lib/api/postWrapper';

const AssignCourse = () =>
{
    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ facultyOptions, setFacultyOptions ] = useState( [] );
    const [ courseOptions, setCourseOptions ] = useState( [] );
    const [ assignedCourses, setAssignedCourses ] = useState( [] );

    useEffect( () =>
    {
        getFacultyOptions()
        getCoursesOptions()
        getAssignedCourses()
    }, [] )

    const getAssignedCourses = () =>
    {
        fetchWrapper( "admin/assigned-courses" ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                setAssignedCourses( resp.assigned )
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } )
    }

    const getFacultyOptions = () =>
    {
        fetchWrapper( "admin/available-faculties" ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                setFacultyOptions(
                    resp.faculties.map( ( f ) => ( {
                        value: f._id,
                        label: `${ f.name }`,
                    } ) )
                );
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } )
    }
    const getCoursesOptions = () =>
    {
        fetchWrapper( "admin/unassigned-courses" ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                setCourseOptions(
                    resp.courses.map( ( c ) => ( {
                        value: c._id,
                        label: `${ c.code } - ${ c.name }`,
                    } ) )
                );
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } )
    }



    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        if ( !faculty || !course ) return toast.info( 'Please select both Faculty and Course.' );
        setIsLoading( true );

        postWrapper( 'admin/assign-course', {
            facultyId: faculty,
            courseId: course
        } ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                toast.success( resp.message )
                getAssignedCourses()
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } ).finally( () =>
        {
            setIsLoading( false );
            setFaculty( '' );
            setCourse( '' );
        } )
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Assign Course to Faculty
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder maw={ 600 }>
                <form onSubmit={ handleSubmit }>
                    <Select
                        label="Select Faculty"
                        placeholder="Choose a faculty member"
                        data={ facultyOptions }
                        value={ faculty }
                        onChange={ setFaculty }
                        required
                        mb="md"
                    />

                    <Select
                        label="Select Course"
                        placeholder="Choose a course"
                        data={ courseOptions }
                        value={ course }
                        onChange={ setCourse }
                        required
                        mb="md"
                    />

                    <Group justify="flex-end" mt="lg">
                        <Button loading={ isLoading } type="submit">Assign Course</Button>
                    </Group>
                </form>
            </Card>
            <Title order={ 3 } mt="xl" mb="sm">
                Assigned Courses
            </Title>

            <Table striped highlightOnHover withBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Faculty Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Course Name</Table.Th>
                        <Table.Th>Course Code</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    { assignedCourses.map( ( row ) => (
                        <Table.Tr key={ row._id }>
                            <Table.Td>{ row.faculty?.name }</Table.Td>
                            <Table.Td>{ row.faculty?.email }</Table.Td>
                            <Table.Td>{ row.name }</Table.Td>
                            <Table.Td>{ row.code }</Table.Td>
                        </Table.Tr>
                    ) ) }
                </Table.Tbody>
            </Table>
        </Box>
    );
};

export default AssignCourse;

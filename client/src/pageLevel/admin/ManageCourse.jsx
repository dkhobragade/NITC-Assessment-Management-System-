import { useState } from "react";
import { TextInput, Textarea, NumberInput, Button, Card, Title, Group, Box } from "@mantine/core";
import { toast } from "react-toastify";
import { postWrapper } from "../../lib/api/postWrapper";

const ManageCourse = () =>
{
    const [ isLoading, setIsLoading ] = useState( false );
    const [ data, setData ] = useState( {
        courseName: "",
        courseCode: "",
        description: "",
        credits: "",
    } );

    const handleChange = ( e ) =>
    {
        const { name, value } = e.target;
        setData( ( prev ) => ( { ...prev, [ name ]: value } ) );
    };

    const handleCreditChange = ( value ) =>
    {
        setData( ( prev ) => ( { ...prev, credits: value } ) );
    };

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();

        if (
            !data.courseName.trim() ||
            !data.courseCode.trim() ||
            !data.credits
        )
        {
            return toast.error( "Please fill all required fields!" );
        }

        setIsLoading( true );

        postWrapper( "admin/add-course", {
            name: data.courseName,
            code: data.courseCode,
            description: data.description,
            credits: data.credits,
        } ).then( ( resp ) =>
        {
            if ( resp.success )
            {
                toast.success( resp.message )
            }
        } ).catch( ( err ) =>
        {
            toast.error( err.message )
        } ).finally( () =>
        {
            setData( {
                courseName: "",
                courseCode: "",
                description: "",
                credits: "",
            } );
            setIsLoading( false )
        } )

    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Add New Course
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder maw={ 600 }>
                <form onSubmit={ handleSubmit }>
                    <TextInput
                        label="Course Name"
                        name="courseName"
                        placeholder="Enter course name"
                        required
                        value={ data.courseName }
                        onChange={ handleChange }
                        mb="md"
                    />

                    <TextInput
                        label="Course Code"
                        name="courseCode"
                        placeholder="e.g. CS101"
                        required
                        value={ data.courseCode }
                        onChange={ handleChange }
                        mb="md"
                    />

                    <Textarea
                        label="Course Description"
                        name="description"
                        placeholder="Briefly describe the course..."
                        autosize
                        minRows={ 3 }
                        value={ data.description }
                        onChange={ handleChange }
                        mb="md"
                    />

                    <NumberInput
                        label="Credits"
                        placeholder="Enter course credits"
                        min={ 1 }
                        max={ 10 }
                        required
                        value={ data.credits }
                        onChange={ handleCreditChange }
                        mb="md"
                    />

                    <Group justify="flex-end" mt="lg">
                        <Button type="submit" loading={ isLoading }>
                            { isLoading ? "Adding..." : "Add Course" }
                        </Button>
                    </Group>
                </form>
            </Card>
        </Box>
    );
};

export default ManageCourse;

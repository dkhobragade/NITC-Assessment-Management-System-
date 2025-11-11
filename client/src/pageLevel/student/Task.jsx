import { useState, useEffect } from "react";
import
{
    Card,
    Title,
    Text,
    Grid,
    Button,
    Group,
    FileButton,
    Notification,
    Loader,
} from "@mantine/core";
import
{
    IconUpload,
    IconCheck,
    IconFileText,
    IconEye,
} from "@tabler/icons-react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { postWrapper } from "../../lib/api/postWrapper";
import { toast } from "react-toastify";

const Task = () =>
{
    const [ tasks, setTasks ] = useState( [] );
    const [ uploadedFiles, setUploadedFiles ] = useState( {} );
    const [ showNotification, setShowNotification ] = useState( false );
    const [ isUploading, setIsUploading ] = useState( {} );

    useEffect( () =>
    {
        fetchStudentTasks();
    }, [] );

    const fetchStudentTasks = async () =>
    {
        try
        {
            const resp = await fetchWrapper( "student/enrollments-with-tasks" );

            if ( resp.success )
            {
                const allTasks = [];

                for ( const course of resp.courses )
                {
                    const taskResp = await fetchWrapper(
                        `student/course/${ course.courseId }/tasks`
                    );

                    if ( taskResp.success )
                    {
                        const formattedTasks = taskResp.tasks.map( ( task ) => ( {
                            ...task,
                            courseName: task.course?.name || course.name,
                            submission: task.submissions?.[ 0 ] || null,
                        } ) );
                        allTasks.push( ...formattedTasks );
                    }
                }

                setTasks( allTasks );
            }
        } catch ( err )
        {
            console.error( "Error fetching tasks:", err );
            toast.error( "Failed to fetch tasks" );
        }
    };

    const handleFileUpload = async ( taskId, file ) =>
    {
        setUploadedFiles( ( prev ) => ( { ...prev, [ taskId ]: file.name } ) );
        setIsUploading( ( prev ) => ( { ...prev, [ taskId ]: true } ) );

        const formData = new FormData();
        formData.append( "file", file );

        try
        {
            const uploadResp = await postWrapper( `student/upload/${ taskId }`, formData, true );
            if ( uploadResp.success )
            {
                toast.success( "File uploaded successfully!" );
                await fetchStudentTasks(); // Refresh list after upload
            }
        } catch ( err )
        {
            console.error( "File upload failed:", err );
            toast.error( "File upload failed" );
        } finally
        {
            setIsUploading( ( prev ) => ( { ...prev, [ taskId ]: false } ) );
            setShowNotification( true );
        }
    };

    if ( !tasks.length )
        return (
            <div style={ { textAlign: "center", padding: "50px" } }>
                <Loader size="lg" color="blue" />
                <Text mt="md">Loading tasks...</Text>
            </div>
        );

    return (
        <div style={ { padding: "20px" } }>
            <Title order={ 2 } mb="lg">
                My Tasks
            </Title>

            <Grid gutter="lg">
                { tasks.map( ( task ) => (
                    <Grid.Col span={ { base: 12, md: 6 } } key={ task._id }>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={ 4 } mb="sm" c="blue">
                                { task.title }
                            </Title>
                            <Text fw={ 500 } mb="xs">
                                Course: { task.courseName }
                            </Text>
                            <Text size="sm" mb="sm">
                                { task.description }
                            </Text>
                            <Text size="sm" c="dimmed" mb="md">
                                Deadline: <b>{ new Date( task.deadline ).toLocaleDateString() }</b>
                            </Text>

                            <Group>
                                { task.submission ? (
                                    <Button
                                        component="a"
                                        href={ task.submission.fileUrl }
                                        download={ task.submission.fileName || "submission.pdf" } // ✅ This sets correct filename
                                        target="_blank"
                                        leftSection={ <IconEye size={ 16 } /> }
                                        color="green"
                                        variant="light"
                                    >
                                        View Submission
                                    </Button>
                                ) : (
                                    <FileButton
                                        onChange={ ( file ) => handleFileUpload( task._id, file ) }
                                        accept="application/pdf"
                                    >
                                        { ( props ) => (
                                            <Button
                                                { ...props }
                                                leftSection={ <IconUpload size={ 16 } /> }
                                                color="blue"
                                                variant="light"
                                                loading={ isUploading[ task._id ] || false }
                                            >
                                                Upload PDF
                                            </Button>
                                        ) }
                                    </FileButton>
                                ) }


                                { uploadedFiles[ task._id ] && (
                                    <Text size="sm" c="green">
                                        <IconFileText
                                            size={ 16 }
                                            style={ { verticalAlign: "middle" } }
                                        />{ " " }
                                        { uploadedFiles[ task._id ] }
                                    </Text>
                                ) }
                            </Group>
                        </Card>
                    </Grid.Col>
                ) ) }
            </Grid>

            { showNotification && (
                <Notification
                    icon={ <IconCheck size={ 18 } /> }
                    color="teal"
                    title="Upload Successful"
                    mt="xl"
                    onClose={ () => setShowNotification( false ) }
                >
                    Your task file has been successfully uploaded!
                </Notification>
            ) }
        </div>
    );
};

export default Task;

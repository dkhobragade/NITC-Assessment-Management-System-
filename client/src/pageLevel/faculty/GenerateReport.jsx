import { useState } from 'react';
import { Box, Card, Title, Button, Group, Loader, Text } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { getFileWrapper } from '../../lib/api/getFileWrapper';

const GenerateReport = () =>
{
    const [ loading, setLoading ] = useState( false );

    const handleGenerateReport = async () =>
    {
        try
        {
            setLoading( true );
            await getFileWrapper( 'faculty/generate-report', 'faculty_report.pdf' );


        } catch ( err )
        {

        } finally
        {
            setLoading( false );
        }
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Generate Faculty Report
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 600 }>
                <Text c="dimmed" mb="md">
                    Click the button below to generate a PDF report of your assigned courses,
                    enrolled students, and their marks.
                </Text>

                <Group justify="center">
                    <Button
                        size="md"
                        color="blue"
                        leftSection={ loading ? <Loader size={ 16 } color="white" /> : <IconFileText size={ 18 } /> }
                        onClick={ handleGenerateReport }
                        disabled={ loading }
                    >
                        { loading ? 'Generating...' : 'Generate Report' }
                    </Button>
                </Group>
            </Card>
        </Box>
    );
};

export default GenerateReport;

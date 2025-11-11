import { useState } from 'react';
import { Box, Card, Title, Button, Group, Loader, Text } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { getFileWrapper } from '../../lib/api/getFileWrapper';

const EvaluatorReport = () =>
{
    const [ loading, setLoading ] = useState( false );

    const handleGenerateReport = async () =>
    {
        try
        {
            setLoading( true );
            await getFileWrapper( 'evaluator/generate-report', 'evaluator_report.pdf' );
            toast.success( 'Evaluator report downloaded successfully.' );
        } catch ( err )
        {
            console.error( err );
            toast.error( err.message || 'Failed to generate report' );
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <Box p="lg">
            <Title order={ 2 } mb="lg">
                Generate Evaluator Report
            </Title>

            <Card shadow="sm" padding="xl" radius="md" withBorder maw={ 600 }>
                <Text c="dimmed" mb="md">
                    Click the button below to generate a PDF report showing your assigned students
                    and the marks you’ve awarded for their submissions.
                </Text>

                <Group justify="center">
                    <Button
                        size="md"
                        color="blue"
                        leftSection={
                            loading ? <Loader size={ 16 } color="white" /> : <IconFileText size={ 18 } />
                        }
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

export default EvaluatorReport;

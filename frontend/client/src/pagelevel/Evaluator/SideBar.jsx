import EvaluatorOverView from '../Evaluator/EvaluatorOverView'
import GenerateReport from '../Evaluator/GenerateReport'

const EvalutorSidebar = ( { selectedType } ) =>
{

    const renderSelectedType = () =>
    {
        if ( selectedType == "Overview" ) return <EvaluatorOverView />;
        else return <GenerateReport />;
    };
    return <>{ renderSelectedType() }</>
}

export default EvalutorSidebar
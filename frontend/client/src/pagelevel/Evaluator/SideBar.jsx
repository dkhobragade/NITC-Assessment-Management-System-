import EvaluatorOverView from '../Evaluator/EvaluatorOverView'
import ManageStudent from './ManageStudent';


const EvalutorSidebar = ( { selectedType } ) =>
{

    const renderSelectedType = () =>
    {
        if ( selectedType === "Overview" ) return <EvaluatorOverView />;
        else if ( selectedType === "Manage Student" ) return <ManageStudent />;
        else return <GenerateReport />;
    };
    return <>{ renderSelectedType() }</>
}

export default EvalutorSidebar
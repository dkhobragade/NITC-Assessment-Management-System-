import FacultyOverView from './FacultyOverView'
import CreateTask from './CreateTask'
import MapEvalutor from './MapEvalutor'
import GenerateReport from './GenerateReport'
import ManageEvalutor from './ManageEvalutor'

const FacultySidebar = ( { selectedType } ) =>
{
    const renderSelectedType = () =>
    {
        if ( selectedType == "Overview" ) return <FacultyOverView />
        else if ( selectedType == "Create Task" ) return <CreateTask />
        else if ( selectedType == "Map Evalutor" ) return <MapEvalutor />
        else if ( selectedType == "Manage Evalutor" ) return <ManageEvalutor />
        else return <GenerateReport />
    }

    return <>{ renderSelectedType() }</>

}

export default FacultySidebar
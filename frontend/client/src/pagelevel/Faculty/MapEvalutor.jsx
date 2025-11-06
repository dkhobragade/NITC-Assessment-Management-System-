import { useState } from "react";
import { toast } from "react-toastify";
import { BASEURL } from "../../lib/constant";
import { useAtom } from 'jotai';
import { userAtom } from "../../lib/store/userAtom";

const MapEvaluator = () =>
{
    const [ evaluatorFile, setEvaluatorFile ] = useState( null );
    const [ studentFile, setStudentFile ] = useState( null );
    const [ evaluators, setEvaluators ] = useState( [] );
    const [ students, setStudents ] = useState( [] );
    const [ mapping, setMapping ] = useState( [] );
    const [ user ] = useAtom( userAtom )

    // Upload Excel files
    const handleUpload = async ( e ) =>
    {
        e.preventDefault();

        if ( !evaluatorFile || !studentFile )
        {
            toast.error( "Please upload both files" );
            return;
        }

        const formData = new FormData();
        formData.append( "evaluator", evaluatorFile );
        formData.append( "student", studentFile );

        try
        {
            const res = await fetch( `${ BASEURL }facultyAuth/upload-excel`, {
                method: "POST",
                body: formData,
            } );
            const data = await res.json();

            if ( res.ok )
            {
                // Keep only _id and fullName
                setEvaluators( data.evaluators.map( ( e ) => ( { _id: e._id, fullName: e.fullName } ) ) );
                setStudents( data.students.map( ( s ) => ( { _id: s._id, fullName: s.fullName } ) ) );
                toast.success( "Files uploaded successfully" );
            } else
            {
                toast.error( data.message );
            }
        } catch ( err )
        {
            toast.error( "Error uploading files" );
        }
    };

    // Random mapping
    const handleRandomMap = async () =>
    {
        if ( !user?.user?.sID )
        {
            toast.error( "Faculty ID not found" );
            return;
        }


        try
        {
            const res = await fetch( `${ BASEURL }facultyAuth/random-map`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { evaluators, students, facultyId: user.user.sID } ),
            } );

            const data = await res.json();
            if ( res.ok )
            {
                // Only show fullName in the frontend
                setMapping(
                    data.mapping.map( ( pair ) => ( {
                        student: { fullName: pair.student.fullName, _id: pair.student._id },
                        evaluator: { fullName: pair.evaluator.fullName, _id: pair.evaluator._id },
                    } ) )
                );
                toast.success( "Random mapping successful" );
            } else
            {
                toast.error( data.message );
            }
        } catch ( err )
        {
            toast.error( "Error in random mapping" );
        }
    };

    return (
        <div style={ { padding: "20px", maxWidth: "800px", margin: "auto" } }>
            <h2 style={ { textAlign: "center" } }>Evaluator–Student Mapping</h2>

            <form onSubmit={ handleUpload } style={ { marginBottom: "20px" } }>
                <div style={ { marginBottom: "10px" } }>
                    <label><b>Upload Evaluator Excel:</b></label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={ ( e ) => setEvaluatorFile( e.target.files[ 0 ] ) }
                        required
                    />
                </div>

                <div style={ { marginBottom: "10px" } }>
                    <label><b>Upload Student Excel:</b></label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={ ( e ) => setStudentFile( e.target.files[ 0 ] ) }
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={ {
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    } }
                >
                    Upload & View
                </button>
            </form>

            { evaluators.length > 0 && students.length > 0 && (
                <>
                    <h3>Evaluator List</h3>
                    <ul>
                        { evaluators.map( ( e, i ) => (
                            <li key={ i }>{ e.fullName }</li>
                        ) ) }
                    </ul>

                    <h3>Student List</h3>
                    <ul>
                        { students.map( ( s, i ) => (
                            <li key={ i }>{ s.fullName }</li>
                        ) ) }
                    </ul>

                    <button
                        onClick={ handleRandomMap }
                        style={ {
                            backgroundColor: "green",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            marginTop: "10px",
                        } }
                    >
                        Randomly Map Evaluators to Students
                    </button>

                    { mapping.length > 0 && (
                        <div style={ { marginTop: "20px" } }>
                            <h3>Mapping Result</h3>
                            <table
                                border="1"
                                style={ { width: "100%", textAlign: "left", borderCollapse: "collapse" } }
                            >
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Evaluator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { mapping.map( ( pair, i ) => (
                                        <tr key={ i }>
                                            <td>{ pair.student.fullName }</td>
                                            <td>{ pair.evaluator.fullName }</td>
                                        </tr>
                                    ) ) }
                                </tbody>
                            </table>
                            <br />
                            <button
                                type="submit"
                                style={ {
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                } }
                            >
                                Submit the mapping
                            </button>
                        </div>
                    ) }
                </>
            ) }
        </div>
    );
};

export default MapEvaluator;

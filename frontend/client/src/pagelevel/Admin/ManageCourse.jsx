import { useState } from "react";
import { toast } from "react-toastify";
import { postWrapper } from "../../lib/api/postWrapper";
import { useEffect } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";

const ManageCourse = () =>
{

    useEffect( () =>
    {
        getAllCourses()
        getAllFaculty()
        getAssignedCourses()
    }, [] )

    const [ faculty, setFaculty ] = useState( '' );
    const [ course, setCourse ] = useState( '' );
    const [ courseName, setCourseName ] = useState( '' );
    const [ courseCode, setCourseCode ] = useState( '' );

    const [ courseList, setCourseList ] = useState( [] )
    const [ facultyList, setFacultyList ] = useState( [] )
    const [ assignedCourses, setAssignedCourses ] = useState( [] )

    const getAllCourses = () =>
    {
        fetchWrapper( "adminAuth/coursesData" ).then( ( resp ) =>
        {
            setCourseList( resp.courses )
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    const getAssignedCourses = () =>
    {
        fetchWrapper( "adminAuth/assigned-courses" ).then( ( resp ) =>
        {
            setAssignedCourses( resp.data )
            console.log( "resp.courses.data", resp.courses.data )
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    const getAllFaculty = () =>
    {
        fetchWrapper( "adminAuth/adminGetAllFaculty" )
            .then( ( resp ) =>
            {
                setFacultyList( resp );
            } )
            .catch( ( err ) =>
            {
                console.error( err );
                toast.error( err.message || "Failed to fetch faculty data" );
            } );
    }


    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        if ( !faculty )
        {
            toast.error( 'Please Select the faculty' )
            return
        } else if ( !course )
        {
            toast.error( "Please select the course" )
            return
        }

        postWrapper( 'adminAuth/adminAssignCourse', {
            faculty: faculty,
            course: course
        } ).then( ( resp ) =>
        {
            if ( resp.message )
            {
                toast.success( resp.message )
                getAssignedCourses()
            }
        } ).catch( ( resp ) =>
        {
            toast.error( resp.message )
        } ).finally( () =>
        {
            setFaculty( '' )
            setCourse( '' )
        } )
    };

    const handleAddCourse = () =>
    {
        postWrapper( 'adminAuth/adminAddCourses', {
            courseName: courseName,
            courseCode: courseCode
        } ).then( ( resp ) =>
        {

            if ( resp.message )
            {
                toast.success( resp.message )
            }
            getAllCourses()
        } ).catch( ( resp ) =>
        {
            toast.error( resp.message )
        } ).finally( () =>
        {
            setCourseCode( '' )
            setCourseName( '' )
        } )
    }

    return <div>
        <h3>Add Course</h3>
        <div style={ { display: 'flex', gap: '10px', justifySelf: 'center' } }>
            <input
                type="text"
                value={ courseName }
                onChange={ ( e ) => setCourseName( e.target.value ) }
                placeholder="Course Name"
                style={ {
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '200px',
                } }
            />

            <input
                type="text"
                value={ courseCode }
                onChange={ ( e ) => setCourseCode( e.target.value ) }
                placeholder="Course Code"
                style={ {
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '200px',
                } }
            />

            <button
                type="submit"
                style={ {
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                } }
                onClick={ handleAddCourse }
            >
                Add Course
            </button>
        </div>
        <br />
        <table style={ { width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" } }>
            <thead style={ { backgroundColor: "#f8f8f8" } }>
                <tr>
                    <th style={ headerStyle }>Course</th>
                    <th style={ headerStyle }>Course ID</th>
                </tr>
            </thead>
            <tbody>
                { courseList.length > 0 ? (
                    courseList.map( ( user ) => (
                        <tr key={ user._id } style={ { borderBottom: "1px solid #ddd" } }>
                            <td style={ cellStyle }>{ user.courseName }</td>
                            <td style={ cellStyle }>{ user.courseCode }</td>
                        </tr>
                    ) )
                ) : (
                    <tr>
                        <td colSpan="5" style={ { textAlign: "center", padding: "12px" } }>
                            No Course data found
                        </td>
                    </tr>
                ) }
            </tbody>
        </table>
        <br />
        <h3>Assign Course</h3>
        <form onSubmit={ handleSubmit } style={ { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifySelf: 'center' } }>
            <select
                value={ faculty }
                onChange={ ( e ) => setFaculty( e.target.value ) }
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' } }
            >
                <option value="">Select Faculty</option>
                { facultyList.map( ( fac, index ) => (
                    <option key={ index } value={ fac.id }>{ fac.fullName }</option>
                ) ) }
            </select>


            <select
                value={ course }
                onChange={ ( e ) => setCourse( e.target.value ) }
                style={ { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' } }
            >
                <option value="">Select Course</option>
                { courseList.map( ( crs, index ) => (
                    <option key={ index } value={ crs.courseCode }>
                        { crs.courseName }
                    </option>
                ) ) }
            </select>


            <button
                type="submit"
                style={ { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' } }
            >
                Assign Course
            </button>
        </form>

        <br />
        <table style={ { width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" } }>
            <thead style={ { backgroundColor: "#f8f8f8" } }>
                <tr>
                    <th style={ headerStyle }>Faculty Name</th>
                    <th style={ headerStyle }>Assigned Course</th>
                </tr>
            </thead>
            <tbody>
                { assignedCourses.length > 0 ? (
                    assignedCourses.map( ( item, index ) =>
                    {
                        // Find faculty name from the faculty list
                        const matchedFaculty = facultyList.find( ( f ) => f.id === item.faculty );
                        const facultyName = matchedFaculty ? matchedFaculty.fullName : item.faculty; // fallback if not found

                        return (
                            <tr key={ index } style={ { borderBottom: "1px solid #ddd" } }>
                                <td style={ cellStyle }>{ facultyName }</td>
                                <td style={ cellStyle }>{ item.course }</td>
                            </tr>
                        );
                    } )
                ) : (
                    <tr>
                        <td colSpan="2" style={ { textAlign: "center", padding: "12px" } }>
                            No Assigned Course data found
                        </td>
                    </tr>
                ) }
            </tbody>
        </table>


    </div>
}

const headerStyle = {
    padding: "12px",
    textAlign: "center",
    fontWeight: "600",
    borderBottom: "2px solid #ddd",
};

const cellStyle = {
    padding: "10px",
    fontSize: "15px",
};

export default ManageCourse
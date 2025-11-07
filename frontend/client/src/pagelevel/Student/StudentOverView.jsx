import { useState, useEffect } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { postWrapper } from "../../lib/api/postWrapper";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/store/userAtom";

const StudentOverview = () =>
{
    const [ courseCode, setCourseCode ] = useState( "" );
    const [ enrolledCourses, setEnrolledCourses ] = useState( [] );
    const [ user ] = useAtom( userAtom );

    useEffect( () =>
    {
        // ✅ Use fetchWrapper (GET) instead of postWrapper for fetching data
        postWrapper( `studentAuth/my-courses`, { email: user.email } )
            .then( ( res ) =>
            {
                if ( res?.data ) setEnrolledCourses( res.data );
            } )
            .catch( () => toast.error( "Failed to load courses" ) );
    }, [ user.email ] );

    const handleEnroll = async () =>
    {
        if ( !courseCode.trim() )
        {
            toast.error( "Please enter a course code" );
            return;
        }

        try
        {
            const response = await postWrapper( "studentAuth/enroll", {
                email: user.email,
                courseCode,
            } );

            toast.success( response.message );
            setCourseCode( "" );
            // ✅ Add the newly enrolled course dynamically
            if ( response.data )
            {
                setEnrolledCourses( ( prev ) => [ ...prev, response.data ] );
            }
        } catch ( error )
        {
            toast.error( error.message || "Failed to enroll" );
        }
    };

    return (
        <div style={ { padding: "40px" } }>
            <h1
                style={ {
                    textAlign: "center",
                    marginBottom: "30px",
                    fontSize: "28px",
                    color: "#333",
                } }
            >
                Student Dashboard Overview
            </h1>

            {/* --- Enrollment Section --- */ }
            <div
                style={ {
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                } }
            >
                <input
                    type="text"
                    placeholder="Enter Course Code"
                    value={ courseCode }
                    onChange={ ( e ) => setCourseCode( e.target.value ) }
                    style={ {
                        padding: "10px",
                        width: "250px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginRight: "10px",
                    } }
                />
                <button
                    onClick={ handleEnroll }
                    style={ {
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "white",
                        cursor: "pointer",
                    } }
                >
                    Enroll
                </button>
            </div>

            {/* --- Enrolled Courses --- */ }
            <div
                style={ {
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "30px",
                } }
            >
                { enrolledCourses.length > 0 ? (
                    enrolledCourses.map( ( course, index ) => (
                        <div key={ index } style={ cardStyle }>
                            <h3 style={ { color: "#007bff" } }>{ course.courseName }</h3>
                            <p style={ { fontSize: "16px" } }>Code: { course.courseCode }</p>
                            <p style={ { fontSize: "13px", color: "#666" } }>
                                Enrolled On: { new Date( course.enrolledAt ).toLocaleDateString() }
                            </p>
                        </div>
                    ) )
                ) : (
                    <p>No enrolled courses yet.</p>
                ) }
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "220px",
    margin: "10px",
};

export default StudentOverview;

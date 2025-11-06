import { useState } from "react";
import { toast } from "react-toastify";
import { postWrapper } from "../../lib/api/postWrapper";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/store/userAtom";

const CreateTask = () =>
{
    const [ task, setTask ] = useState( {
        title: "",
        description: "",
        dueDate: "",
    } );
    const [ pdfFile, setPdfFile ] = useState( null );
    const [ user ] = useAtom( userAtom )

    const handleChange = ( e ) =>
    {
        setTask( { ...task, [ e.target.name ]: e.target.value } );
    };

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();

        const formData = new FormData();
        formData.append( "title", task.title );
        formData.append( "description", task.description );
        formData.append( "dueDate", task.dueDate );
        formData.append( "facultyEmail", user.email )
        if ( pdfFile ) formData.append( "pdf", pdfFile );

        try
        {
            const resp = await postWrapper( "facultyAuth/create-task", formData, true );
            toast.success( resp.message );
            setTask( { title: "", description: "", dueDate: "" } );
            setPdfFile( null );
        } catch ( err )
        {
            toast.error( err.message || "Failed to create task" );
        }
    };

    return (
        <div
            style={ {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            } }
        >
            <div
                style={ {
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    width: "400px",
                } }
            >
                <h2
                    style={ {
                        textAlign: "center",
                        marginBottom: "25px",
                        fontSize: "24px",
                        color: "#333",
                    } }
                >
                    Create New Task
                </h2>

                <form onSubmit={ handleSubmit }>
                    <div style={ { marginBottom: "15px" } }>
                        <label style={ { display: "block", fontWeight: "bold", marginBottom: "5px" } }>
                            Task Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={ task.title }
                            onChange={ handleChange }
                            placeholder="Enter task title"
                            required
                            style={ {
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                            } }
                        />
                    </div>

                    <div style={ { marginBottom: "15px" } }>
                        <label style={ { display: "block", fontWeight: "bold", marginBottom: "5px" } }>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={ task.description }
                            onChange={ handleChange }
                            placeholder="Enter task description"
                            rows="3"
                            required
                            style={ {
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                resize: "none",
                            } }
                        />
                    </div>

                    <div style={ { marginBottom: "20px" } }>
                        <label style={ { display: "block", fontWeight: "bold", marginBottom: "5px" } }>
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={ task.dueDate }
                            onChange={ handleChange }
                            required
                            style={ {
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                            } }
                        />
                    </div>

                    <label style={ { display: "block", fontWeight: "bold", marginBottom: "5px" } }>
                        Upload PDF
                    </label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={ ( e ) => setPdfFile( e.target.files[ 0 ] ) }
                        style={ {
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            marginBottom: "12px",
                        } }
                    />

                    <button
                        type="submit"
                        style={ {
                            width: "100%",
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "10px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        } }
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;

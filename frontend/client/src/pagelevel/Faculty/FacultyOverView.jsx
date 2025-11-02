const FacultyOverView = () =>
{
    const totalTasks = 8;
    const evaluatorsMapped = 4;

    return <>
        <div
            style={ {
                padding: "40px",
            } }
        >
            <h1
                style={ {
                    textAlign: "center",
                    marginBottom: "30px",
                    fontSize: "28px",
                    color: "#333",
                } }
            >
                Faculty Dashboard Overview
            </h1>

            <div
                style={ {
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginBottom: "40px",
                } }
            >
                <div style={ cardStyle }>
                    <h3 style={ { marginBottom: "8px", color: "#007bff" } }>Total Tasks</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ totalTasks }</p>
                </div>

                <div style={ cardStyle }>
                    <h3 style={ { marginBottom: "8px", color: "#28a745" } }>Evaluators Mapped</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ evaluatorsMapped }</p>
                </div>
            </div>
        </div>
    </>
}


const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "220px",
    margin: "10px",
};

const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    fontSize: "15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
};

export default FacultyOverView
const ExamTable = ({ exams }) => {

  return (
    <div className="card" style={{ padding:20 }}>

      <h3>Exams</h3>

      <table className="table">

        <thead>

          <tr>

            <th>Title</th>

            <th>Faculty</th>

            <th>Total Marks</th>

            <th>Start</th>

            <th>End</th>

          </tr>

        </thead>

        <tbody>

          {exams.map(exam => (

            <tr key={exam.id}>

              <td>{exam.title}</td>

              <td>{exam.facultyName}</td>

              <td>{exam.totalMarks}</td>

              <td>{exam.startTime}</td>

              <td>{exam.endTime}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

};

export default ExamTable;
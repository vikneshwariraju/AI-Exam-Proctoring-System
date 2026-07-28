import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllExams } from "../../services/adminService";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllExams()
      .then(setExams)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout activeItem="Exams">
      <h2>Exams</h2>

      {loading ? (
        <Loader />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Faculty</th>
              <th>Marks</th>
              <th>Start</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.facultyName}</td>
                <td>{e.totalMarks}</td>
                <td>{new Date(e.startTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

export default Exams;
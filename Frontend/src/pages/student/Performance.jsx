import { useEffect, useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Award,
  Target,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import { getStudentExams } from "../../services/studentService";
import { getStudentPerformance } from "../../services/examService";

const DIFFICULTY_COLORS = {
  easy: "#16A34A",
  medium: "#F59E0B",
  hard: "#DC2626",
};

const AccuracyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-muted small">
        No difficulty data available.
      </p>
    );
  }

  return (
    <div>
      {data.map((d) => (
        <div key={d.difficulty} className="mb-3">

          <div className="d-flex justify-content-between mb-1">

            <span className="fw-semibold text-capitalize">
              {d.difficulty}
            </span>

            <span className="text-muted small">
              {d.accuracy ?? 0}% ({d.correct}/{d.total})
            </span>

          </div>

          <div
            className="progress"
            style={{ height: "10px" }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${d.accuracy ?? 0}%`,
                background:
                  DIFFICULTY_COLORS[d.difficulty] || "#2563EB",
              }}
            />
          </div>

        </div>
      ))}
    </div>
  );
};

const ScoreTrendChart = ({ exams }) => {

  if (!exams.length) {
    return (
      <p className="text-muted small">
        No completed exams yet.
      </p>
    );
  }

  return (

    <div
      className="d-flex align-items-end gap-3"
      style={{ height: 180 }}
    >

      {exams.map((exam) => (

        <div
          key={exam.examId}
          className="flex-fill text-center"
        >

          <div className="small fw-bold mb-1">
            {exam.percentage}%
          </div>

          <div
            className="mx-auto rounded-top"
            style={{
              width: 40,
              height: `${Math.max(exam.percentage, 5)}%`,
              background:
                exam.percentage >= 40
                  ? "#2563EB"
                  : "#DC2626",
            }}
          />

          <small
            className="text-muted d-block mt-2"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {exam.examTitle}
          </small>

        </div>

      ))}

    </div>

  );
};

const Performance = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const exams = await getStudentExams();

        const completedExams = exams.filter(
          (e) => e.status === "completed"
        );

        const results = await Promise.all(
          completedExams.map((e) =>
            getStudentPerformance(e.id).catch(() => null)
          )
        );

        setPerformances(results.filter(Boolean));
      } catch (err) {
        setLoadError(
          err.response?.data?.error ||
            err.response?.data?.detail ||
            "Could not load performance data."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger">
          {loadError}
        </div>
      </DashboardLayout>
    );
  }

  // =============================
  // Summary calculations
  // =============================

  const averageScore =
    performances.length > 0
      ? (
          performances.reduce(
            (sum, p) => sum + (p.percentage || 0),
            0
          ) / performances.length
        ).toFixed(1)
      : 0;

  const totalExams = performances.length;

  const avgDifficulty =
    performances.length > 0
      ? performances
          .flatMap((p) => p.difficultyBreakdown)
          .sort(
            (a, b) =>
              (b.accuracy || 0) -
              (a.accuracy || 0)
          )[0]?.difficulty || "-"
      : "-";

  const weakCount = performances.reduce(
    (sum, p) => sum + p.weakAreas.length,
    0
  );

return (
  <DashboardLayout activeItem="Performance">

    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Performance Analysis
          </h2>

          <p className="text-muted mb-0">
            Track your academic progress and identify your strengths and weak areas.
          </p>
        </div>

        <button className="btn btn-primary">
          <BarChart3 size={18} className="me-2" />
          Performance Report
        </button>

      </div>

      {performances.length === 0 ? (

        <div className="card shadow-sm border-0">

          <div className="card-body text-center py-5">

            <BookOpen
              size={45}
              className="text-primary mb-3"
            />

            <h4>No Performance Data</h4>

            <p className="text-muted">
              Complete an exam to view your performance analysis.
            </p>

          </div>

        </div>

      ) : (

        <>

          {/* Summary Cards */}

          <div className="row g-4 mb-4">

            <div className="col-md-6 col-lg-3">

              <div className="card shadow-sm border-0 h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <small className="text-muted">
                        Average Score
                      </small>

                      <h2 className="fw-bold mt-2">
                        {averageScore}%
                      </h2>

                    </div>

                    <Award
                      size={38}
                      color="#2563EB"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="card shadow-sm border-0 h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <small className="text-muted">
                        Exams Completed
                      </small>

                      <h2 className="fw-bold mt-2">
                        {totalExams}
                      </h2>

                    </div>

                    <BookOpen
                      size={38}
                      color="#16A34A"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="card shadow-sm border-0 h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <small className="text-muted">
                        Strongest Difficulty
                      </small>

                      <h2 className="fw-bold text-capitalize mt-2">
                        {avgDifficulty}
                      </h2>

                    </div>

                    <Target
                      size={38}
                      color="#F59E0B"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="card shadow-sm border-0 h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <small className="text-muted">
                        Weak Areas
                      </small>

                      <h2 className="fw-bold mt-2">
                        {weakCount}
                      </h2>

                    </div>

                    <AlertTriangle
                      size={38}
                      color="#DC2626"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Score Trend */}

          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-4 d-flex align-items-center">

                <TrendingUp
                  className="me-2"
                  size={20}
                />

                Score Trend

              </h5>

              <ScoreTrendChart exams={performances} />

            </div>

          </div>

          {/* Individual Exam Cards */}

          {performances.map((p) => (

            <div
              key={p.examId}
              className="card shadow-sm border-0 mb-4"
            >

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>

                    <h4 className="fw-bold mb-1">
                      {p.examTitle}
                    </h4>

                    <small className="text-muted">
                      Marks : {p.marks}
                    </small>

                  </div>

                  <span className="badge bg-primary fs-6 px-3 py-2">
                    {p.percentage}%
                  </span>

                </div>

                <AccuracyBarChart
                  data={p.difficultyBreakdown}
                />

                {p.weakAreas.length > 0 && (

                  <div className="alert alert-warning mt-4 mb-0">

                    <strong>Weak Areas:</strong>{" "}
                    {p.weakAreas.join(", ")}

                  </div>

                )}

              </div>

            </div>

          ))}

        </>

      )}

    </div>

  </DashboardLayout>
);
};
export default Performance
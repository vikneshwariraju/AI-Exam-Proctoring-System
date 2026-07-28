import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Video, VideoOff, AlertTriangle } from "lucide-react";
import { detectFace } from "../../services/aiService";

const DETECTION_INTERVAL = 2000;

const WebcamProctor = ({ examId }) => {
  const webcamRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [status, setStatus] = useState("Starting Camera...");
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!webcamRef.current) return;

      const image = webcamRef.current.getScreenshot();

      if (!image) return;

      try {
        const res = await detectFace(examId, image);

        if (res.face_count === 1) {
          setStatus("✅ Face Detected");
        } else if (res.face_count === 0) {
          setStatus("❌ Face Missing");

          if (res.warning_type) {
            setWarningCount(res.warning_count || 0);
          }
        } else {
          setStatus("⚠ Multiple Faces");

          if (res.warning_type) {
            setWarningCount(res.warning_count || 0);
          }
        }

        if (res.flagged) {
          alert(
            "Warning limit exceeded. Faculty has been notified."
          );
        }
      } catch (err) {
        console.error(err);
      }
    }, DETECTION_INTERVAL);

    return () => clearInterval(interval);
  }, [examId]);

  return (
    <div className="card p-3">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {cameraError ? (
          <VideoOff color="red" />
        ) : (
          <Video color="green" />
        )}

        <h5 style={{ margin: 0 }}>AI Proctoring</h5>
      </div>

      {cameraError ? (
        <div className="alert alert-danger">
          <AlertTriangle size={16} />
          {" "}
          {cameraError}
        </div>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 320,
              height: 240,
              facingMode: "user",
            }}
            onUserMediaError={() =>
              setCameraError(
                "Camera permission denied."
              )
            }
            style={{
              width: "100%",
              borderRadius: 10,
            }}
          />

          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background: "#f5f5f5",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {status}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Warnings : {warningCount}
          </p>
        </>
      )}
    </div>
  );
};

export default WebcamProctor;
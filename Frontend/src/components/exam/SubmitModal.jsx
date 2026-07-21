import Modal from "../common/Modal";
import Button from "../common/Button";

const SubmitModal = ({ answeredCount, totalCount, onConfirm, onCancel }) => (
  <Modal title="Submit Exam?" onClose={onCancel} width={380}>
    <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", marginBottom: 4 }}>
      You've answered <b>{answeredCount}</b> of <b>{totalCount}</b> questions.
    </p>
    {answeredCount < totalCount && (
      <p style={{ fontSize: 13, color: "var(--color-warning)", marginTop: 6 }}>
        {totalCount - answeredCount} question(s) are still unanswered.
      </p>
    )}
    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      <Button variant="secondary" onClick={onCancel} style={{ flex: 1, justifyContent: "center" }}>
        Continue Exam
      </Button>
      <Button variant="primary" onClick={onConfirm} style={{ flex: 1, justifyContent: "center" }}>
        Submit Now
      </Button>
    </div>
  </Modal>
);

export default SubmitModal;
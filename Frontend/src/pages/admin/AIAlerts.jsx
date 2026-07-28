import DashboardLayout from "../../components/layout/DashboardLayout";

const AIAlerts = () => {
  return (
    <DashboardLayout activeItem="AI Alerts">
      <h2>AI Alerts</h2>

      <div className="card" style={{ padding:20 }}>
        No AI alerts available.
      </div>
    </DashboardLayout>
  );
};

export default AIAlerts;
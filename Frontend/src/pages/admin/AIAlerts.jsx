import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDashboardStats } from "../../services/adminService";

const AIAlerts = () => {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getDashboardStats();
        setStats(data);
    };

    return (
        <DashboardLayout activeItem="AI Alerts">

            <h2>AI Alerts</h2>

            <div className="card" style={{ padding:20 }}>

                <h3>Total Flagged Students</h3>

                <h1 style={{ color:"red" }}>
                    {stats?.flaggedAlerts ?? 0}
                </h1>

                <p>
                    Students having 3 or more AI warnings.
                </p>

            </div>

        </DashboardLayout>
    );
};

export default AIAlerts;
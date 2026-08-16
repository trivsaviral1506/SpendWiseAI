interface StatCardProps {
    title: string;
    value: string;
    type?: "balance" | "income" | "expense" | "transactions";
}

function StatCard({
    title,
    value,
    type = "balance"
}: StatCardProps) {
    return (
        <div className={`stat-card ${type}`}>
            <p className="stat-title">{title}</p>
            <h2>{value}</h2>
        </div>
    );
}

export default StatCard;
interface CategorySummary {
    category: string;
    total: number;
    count: number;
}

interface AIInsightsProps {
    categorySummary: CategorySummary[];
}

function AIInsights({
    categorySummary
}: AIInsightsProps) {

    if (categorySummary.length === 0) {
        return (
            <div className="ai-insights">
                <div className="ai-title">
                    🤖 AI Spending Insights
                </div>

                <p>
                    Add some expenses to receive
                    spending insights.
                </p>
            </div>
        );
    }

    const topCategory =
        categorySummary[0];

    const totalSpending =
        categorySummary.reduce(
            (sum, item) =>
                sum + Number(item.total),
            0
        );

    const percentage =
        totalSpending === 0
            ? 0
            : (
                Number(topCategory.total) /
                totalSpending
            ) * 100;

    let message = "";

    if (percentage >= 50) {
        message =
            `More than half of your spending is in ${topCategory.category}. Consider reviewing this category.`;
    } else if (percentage >= 30) {
        message =
            `${topCategory.category} is your highest spending category. Keep an eye on your spending here.`;
    } else {
        message =
            `Your spending is spread across multiple categories. ${topCategory.category} is currently your highest expense category.`;
    }

    return (
        <div className="ai-insights">

            <div className="ai-title">
                🤖 AI Spending Insights
            </div>

            <div className="ai-main">

                <h3>
                    Your highest spending category is{" "}
                    <strong>
                        {topCategory.category}
                    </strong>
                </h3>

                <p>
                    You spent{" "}
                    <strong>
                        ₹
                        {Number(
                            topCategory.total
                        ).toLocaleString()}
                    </strong>{" "}
                    on{" "}
                    {topCategory.category}.
                </p>

                <p>
                    This represents{" "}
                    <strong>
                        {percentage.toFixed(1)}%
                    </strong>{" "}
                    of your total spending.
                </p>

                <div className="ai-message">
                    💡 {message}
                </div>

            </div>

        </div>
    );
}

export default AIInsights;
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TbArrowBigLeftFilled,
  TbArrowBigRightFilled,
  TbBellFilled,
} from "react-icons/tb";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { noDataPlugin, options } from "../chartsConfig";
import { generateBarData, generateMonthData } from "../utils";
import { Entry } from "../types";
import moment from "moment";
import { User } from "firebase/auth";

const Dashboard: React.FC<{ entries: Entry[]; user: User | null }> = ({
  entries,
  user,
}) => {
  const [month, setMonth] = useState(moment().month());
  const [year, setYear] = useState(moment().year());

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Colors,
    Tooltip,
    Legend,
    noDataPlugin
  );

  const workingEntries = entries.map(({ expense, date, amount, category }) => ({
    expense,
    amount,
    category,
    year: date.toDate().getFullYear(),
    month: date.toDate().getMonth(),
  }));

  const currentMthEntries = workingEntries.filter(
    (entry) => entry.year === year && entry.month === month
  );

  const { income, expense, typeData, categoryData } =
    generateMonthData(currentMthEntries);
  const barData = generateBarData(workingEntries);

  const handlePeriodChange = (e: React.SyntheticEvent) => {
    let periodWrapper = moment(new Date(year, month, 1));
    if (e.currentTarget.classList.contains("prev-btn")) {
      periodWrapper = moment(periodWrapper).subtract(1, "months");
    } else {
      periodWrapper = moment(periodWrapper).add(1, "months");
    }
    setMonth(periodWrapper.get("month"));
    setYear(periodWrapper.get("year"));
  };

  return (
    <main className="dashboard">
      {user && entries.length === 0 && (
        <div className="instruction text-center">
          <TbBellFilled className="bell" />
          <p>
            To create your first entry, navigate to the{" "}
            <Link to="/add">NEW</Link> page.
          </p>
        </div>
      )}
      <section className="overview text-center">
        <h2>
          Overview for {moment.monthsShort(month)} {year}
        </h2>
        <button className="btn prev-btn" onClick={handlePeriodChange}>
          <TbArrowBigLeftFilled />
        </button>
        {(moment().month() !== month || moment().year() !== year) && (
          <button className="btn next-btn" onClick={handlePeriodChange}>
            <TbArrowBigRightFilled />
          </button>
        )}
        <ul>
          <li>
            <span className="dashboard__count">{currentMthEntries.length}</span>{" "}
            entries are recorded this month
          </li>
          <li>
            <span className="dashboard__count">{expense.count}</span> Expense
            entries ={" "}
            <span className="expense dashboard__total">
              ${expense.total ? expense.total.toFixed(2) : "--"}
            </span>
          </li>
          <li>
            <span className="dashboard__count">{income.count}</span> Income
            entries ={" "}
            <span className="income dashboard__total">
              ${income.total ? income.total.toFixed(2) : "--"}
            </span>
          </li>
        </ul>
      </section>
      {entries.length > 0 && (
        <>
          <section className="chart__type-pie">
            <h3 className="text-center">
              Income and Expense Breakdown - {moment.monthsShort(month)} {year}
            </h3>
            <Pie data={typeData} />
          </section>
          <section className="chart__expense-pie">
            <h3 className="text-center">
              Expense Breakdown by Category - {moment.monthsShort(month)} {year}
            </h3>
            <Pie data={categoryData} options={options} />
          </section>
          <section className="chart__type-bar">
            <h3 className="text-center">
              Income and Expense Trends over the Last 6 Months (as of{" "}
              {moment().format("D-MMM-YY")})
            </h3>
            <Bar data={barData} />
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;

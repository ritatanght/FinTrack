import { EntryDate, WorkingEntries } from "./types";
import moment from "moment";

export const momentParseDate = (date: EntryDate, format: string = "") => {
  if (format === "long") {
    return moment(date.toDate()).format("D.MMM.YYYY");
  }
  return moment(date.toDate()).format("D.MMM.YY");
};

// for data on Chart.js
const generateBarLabel = () => {
  let currentPeriod = new Date();
  let months = [{ month: moment().month(), year: moment().year() }];
  let periodWrapper = moment(currentPeriod);
  for (let i = 1; i < 6; i++) {
    const newPeriod = moment(periodWrapper).subtract(i, "month");
    months.unshift({
      month: newPeriod.month(),
      year: newPeriod.year(),
    });
  }
  return months;
};

// output data for the 2 pie charts and overview
export const generateMonthData = (entries: WorkingEntries[]) => {
  const categoryList = [
    ...new Set(
      entries.filter((entry) => entry.expense).map((entry) => entry.category)
    ),
  ];
  const expenseByCat: number[] = Array(categoryList.length).fill(0);

  let incomeTotal = 0,
    incomeCount = 0,
    expenseTotal = 0,
    expenseCount = 0;

  entries.forEach((entry) => {
    if (entry.expense) {
      const ind = categoryList.indexOf(entry.category);
      expenseByCat[ind] += entry.amount;
      expenseTotal += entry.amount;
      expenseCount++;
    } else {
      incomeTotal += entry.amount;
      incomeCount++;
    }
  });

  const typeData = {
    labels:
      expenseTotal === 0 && incomeTotal === 0 ? [] : ["Expense", "Income"],
    datasets: [
      {
        data:
          expenseTotal === 0 && incomeTotal === 0
            ? []
            : [expenseTotal, incomeTotal],
        backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(75, 200, 180, 0.8)"],
      },
    ],
  };

  const categoryData = {
    labels: categoryList,
    datasets: [
      {
        data: expenseByCat,
      },
    ],
  };
  return {
    income: { total: incomeTotal, count: incomeCount },
    expense: { total: expenseTotal, count: expenseCount },
    typeData,
    categoryData,
  };
};

// output data for the bar graph
export const generateBarData = (entries: WorkingEntries[]) => {
  const labels = generateBarLabel();
  const expenseByMonth = Array(labels.length).fill(0);
  const incomeByMonth = Array(labels.length).fill(0);
  entries.forEach((entry) => {
    const ind = labels.findIndex(
      (m) => m.year === entry.year && m.month === entry.month
    );
    if (entry.expense) {
      expenseByMonth[ind] += entry.amount;
    } else {
      incomeByMonth[ind] += entry.amount;
    }
  });

  return {
    labels: labels.map((label) => moment.months(label.month)),
    datasets: [
      {
        label: "Expense",
        data: expenseByMonth,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Income",
        data: incomeByMonth,
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };
};

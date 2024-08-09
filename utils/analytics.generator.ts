import { Document, Model } from "mongoose";

interface IMonthData{
  month: string;
  count: number;
} 

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export async function generatorLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: IMonthData[]}> {
  const last12Months: IMonthData[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      daysInMonth(currentDate.getMonth() - i, currentDate.getFullYear())
    )
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      2
    )
    const monthYear = endDate.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    })
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    })
    last12Months.push({month: monthYear, count})
  }

  return { last12Months };
}
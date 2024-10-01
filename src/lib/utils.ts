import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sub } from "date-fns";
import {
  FormattedHistoricObject,
  ResponseData30DayRangeBancoGuatemala,
} from "@/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const substract30DaysFromDate = (date: string) => {
  const arrDate = date.split("/");
  const [day, month, year] = arrDate;
  const parseDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );
  const pastDate = sub(parseDate, { days: 30 });
  return `${
    pastDate.getDate() < 10 ? "0" + pastDate.getDate() : pastDate.getDate()
  }/${
    pastDate.getMonth() + 1 < 10
      ? "0" + (pastDate.getMonth() + 1)
      : pastDate.getMonth() + 1
  }/${pastDate.getFullYear()}`;
};

export const parseDataForLegibleIn30DayRange = (
  data: ResponseData30DayRangeBancoGuatemala[]
) => {
  const formattedData: FormattedHistoricObject[] = [];
  data.forEach((el) => {
    formattedData.push({
      fecha: el.Var.children[1].fecha.content,
      precio: el.Var.children[3].compra.content,
    });
  });

  return formattedData;
};

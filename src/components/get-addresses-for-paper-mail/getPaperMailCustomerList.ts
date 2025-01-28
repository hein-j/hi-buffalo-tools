import { parse } from "csv-parse/browser/esm/sync";
import { stringify } from "csv-stringify/browser/esm/sync";

export function getJSONFromCSV(csv: string, objname?: string) {
  csv = csv.replace(/^\uFEFF/, ""); // strip BOM markers

  return parse(csv, {
    columns: true,
    objname,
  });
}

export function getCSVFromJSON(records: any[]) {
  return stringify(records, { header: true });
}

export function getPaperMailCustomerList(fieldEntriesCSV: string) {
  function getValueFromInfo(info: any, key: string) {
    return info[key]?.value ?? "";
  }
  const fieldEntriesJSON = getJSONFromCSV(fieldEntriesCSV);

  const customers = fieldEntriesJSON.reduce(
    (acc: any, curr: any) => {
      const fieldName = curr["Field name"];

      let next = { value: curr["Field value"], date: curr["Date"] };
      const prev = acc[curr.Email]?.[fieldName];
      // if prev is more current, keep prev
      if (prev && prev.date > next.date) {
        next = prev;
      }

      return {
        ...acc,
        [curr["Email"]]: {
          ...(acc[curr.Email] ?? {
            "First name": curr["First name"],
            "Last name": curr["Last name"],
          }),
          [fieldName]: next,
        },
      };
    },
    {} as {
      [email: string]: {
        [fieldName: string]: { value: string; date: string } | string;
      };
    }
  );

  const customersOptingPaper = Object.entries(customers).reduce(
    (acc, [email, info]: [string, any]) => {
      // sometimes, email is ''
      if (!email) {
        return acc;
      }
      if (getValueFromInfo(info, "Paper Mail") !== "Yes") {
        return acc;
      }

      acc.push({
        Email: email,
        "First name": info["First name"],
        "Last name": info["Last name"],
        "Street Address": getValueFromInfo(info, "Street Address"),
        City: getValueFromInfo(info, "City"),
        State: getValueFromInfo(info, "State"),
        "Zip Code": getValueFromInfo(info, "Zip Code"),
      });

      return acc;
    },
    [] as any
  );

  return getCSVFromJSON(customersOptingPaper);
}

import ExcelJS from "exceljs";

export const COMMENT_COLUMNS = ["category", "text", "sentiment"] as const;
export const SENTIMENT_OPTIONS = ["POSITIVE", "FUNNY", "CRITICAL"] as const;

export type ParsedRow = Record<string, string>;

/**
 * Reads the first worksheet of an .xlsx buffer and returns each data row as an
 * object keyed by the (lower-cased, trimmed) header cells in row 1.
 */
export async function parseCommentsExcel(buffer: Buffer): Promise<ParsedRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as never);

  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const headers: Record<number, string> = {};
  sheet.getRow(1).eachCell((cell, col) => {
    headers[col] = String(cell.text ?? "").trim().toLowerCase();
  });

  const rows: ParsedRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const parsed: ParsedRow = {};
    let hasValue = false;

    row.eachCell((cell, col) => {
      const key = headers[col];
      if (!key) return;
      const value = String(cell.text ?? "").trim();
      parsed[key] = value;
      if (value) hasValue = true;
    });

    if (hasValue) rows.push(parsed);
  });

  return rows;
}

/**
 * Builds a downloadable .xlsx template with the expected headers, example rows,
 * and a dropdown on the sentiment column limited to the 3 allowed values.
 */
export async function buildCommentsTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("comments");

  sheet.columns = [
    { header: "category", key: "category", width: 24 },
    { header: "text", key: "text", width: 60 },
    { header: "sentiment", key: "sentiment", width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };

  sheet.addRow({ category: "BeamNG Crash", text: "This game looks awesome", sentiment: "POSITIVE" });
  sheet.addRow({
    category: "BeamNG Crash",
    text: "Hahaha that crash was hilarious",
    sentiment: "FUNNY",
  });
  sheet.addRow({ category: "GTA 6", text: "The graphics could be better", sentiment: "CRITICAL" });

  // Sentiment dropdown (only POSITIVE / FUNNY / CRITICAL) for the data rows.
  for (let rowNumber = 2; rowNumber <= 1000; rowNumber += 1) {
    sheet.getCell(`C${rowNumber}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${SENTIMENT_OPTIONS.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Invalid sentiment",
      error: "Choose one of: POSITIVE, FUNNY, CRITICAL",
    };
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

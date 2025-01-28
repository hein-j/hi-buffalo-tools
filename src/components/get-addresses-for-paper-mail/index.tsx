import * as React from "react";
import { useState } from "react";
import { getPaperMailCustomerList } from "./getPaperMailCustomerList";

export const GetAddressesForPaperMail = () => {
  const [downloadLinkSettings, setDownloadLinkSettings] = useState<{
    show: boolean;
    href: string | undefined;
    download: string | undefined;
  }>({
    show: false,
    href: undefined,
    download: undefined,
  });
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [statusText, setStatusText] = useState("");

  return (
    <div>
      <h2>Get Addresses for Paper Mail</h2>
      <ol>
        <li>Go to Momence</li>
        <li>From the sidebar, click into "Analytics" &gt; "Reports"</li>
        <li>
          Scroll and find the section "Customers." Click into "Custom fields"
        </li>
        <li>Click "Download summary" in the top-left corner.</li>
        <li>Upload the downloaded file here.</li>
      </ol>
      <label htmlFor="momence-csv">Upload CSV:</label>
      <input
        disabled={inputIsDisabled}
        type="file"
        id="momence-csv"
        name="momence-csv"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setInputIsDisabled(true);
            setStatusText("Working...");
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async () => {
              try {
                if (reader.result) {
                  if (typeof reader.result !== "string") {
                    throw new Error("Reader read file as Array Buffer!");
                  }
                  const csvContent = await getPaperMailCustomerList(
                    reader.result
                  );
                  console.log("wrotecsv");
                  const fileName = "customers-opting-paper.csv";
                  const csvFile = new File([csvContent], fileName, {
                    type: "text/plain",
                  });
                  console.log("wrote file");
                  setDownloadLinkSettings({
                    show: true,
                    href: URL.createObjectURL(csvFile),
                    download: fileName,
                  });

                  setStatusText("Success!");
                }
              } catch (e) {
                setStatusText("Error: " + e);
              }
            };
            reader.onerror = () => {
              setStatusText("Error: " + e);
            };
          }
        }}
      />
      <p>{statusText}</p>
      {downloadLinkSettings.show && (
        <a
          href={downloadLinkSettings.href}
          download={downloadLinkSettings.download}
        >
          Download file
        </a>
      )}
    </div>
  );
};

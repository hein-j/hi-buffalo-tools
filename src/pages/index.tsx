import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import "./index.css";
import { GetAddressesForPaperMail } from "../components/get-addresses-for-paper-mail";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <div>
      <h1>HI Buffalo Tools</h1>
      <GetAddressesForPaperMail />
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

import { PropsWithChildren } from "react";

const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className="space-y-2 mb-16">{children}</div>;
};

const Title = ({ children }: PropsWithChildren) => {
  return <h2>{children}</h2>;
};

const Description = ({ children }: PropsWithChildren) => {
  return <p>{children}</p>;
};

PageHeader.Title = Title;
PageHeader.Description = Description;

export default PageHeader;

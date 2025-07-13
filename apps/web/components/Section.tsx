import { PropsWithChildren } from "react";

const Section = ({ children }: PropsWithChildren) => {
  return <section className="mb-12 break-keep">{children}</section>;
};

const SubSection = ({ children }: PropsWithChildren) => {
  return <div className="mb-8">{children}</div>;
};

const Title = ({ children }: PropsWithChildren) => {
  return <h3 className="font-semibold text-white mb-6">{children}</h3>;
};

const SubTitle = ({ children }: PropsWithChildren) => {
  return <h4 className="font-semibold text-white mb-4">{children}</h4>;
};

const Paragraph = ({ children }: PropsWithChildren) => {
  return <p className="mb-4">{children}</p>;
};

const List = ({ children }: PropsWithChildren) => {
  return <ul className="list-disc pl-5 space-y-1 mb-4">{children}</ul>;
};

const ListItem = ({ children }: PropsWithChildren) => {
  return <li>{children}</li>;
};

const OrderedList = ({ children }: PropsWithChildren) => {
  return <ol className="list-decimal pl-5 space-y-2 mb-4">{children}</ol>;
};

const OrderedListItem = ({ children }: PropsWithChildren) => {
  return <li>{children}</li>;
};

Section.Title = Title;
Section.SubSection = SubSection;
Section.SubTitle = SubTitle;
Section.Paragraph = Paragraph;
Section.List = List;
Section.ListItem = ListItem;
Section.OrderedList = OrderedList;
Section.OrderedListItem = OrderedListItem;

export default Section;

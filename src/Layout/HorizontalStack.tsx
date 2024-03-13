import React from "react";

interface HorizontalStackProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const HorizontalStack: React.FC<HorizontalStackProps> = ({
  children,
  style,
}) => {
  const mergedStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    ...style,
  };

  return <div style={mergedStyles}>{children}</div>;
};

export default HorizontalStack;

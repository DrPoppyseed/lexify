import * as React from "react";

const DrawerItem: React.FC<{
  text: string;
  onClick: React.MouseEventHandler;
}> = ({ text, onClick }) => (
  <div className="br-2 w-full" onClick={onClick}>
    <p>{text}</p>
  </div>
);

export default DrawerItem;

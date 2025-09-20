import React from "react";

export const EventTypeContext = React.createContext<{
  eventType: string;
  setEventType: (type: string) => void;
}>({
  eventType: "",
  setEventType: () => {},
});

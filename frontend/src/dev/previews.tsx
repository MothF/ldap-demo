import React from "react";
import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import App from "../app/App";
import {LogEventsTable} from "../app/ldap/log-events/LogEventsTable";

export const ComponentPreviews = () => {
  return (
    <Previews>
      <ComponentPreview path="/App">
        <App />
      </ComponentPreview>
        <ComponentPreview path="/LogEventsTable">
            <LogEventsTable/>
        </ComponentPreview>
    </Previews>
  );
};

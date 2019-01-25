import React from "react";
import { MDBAlert } from 'mdbreact';

export const FormErrors = ({ formErrors }) => (
  <div className="formErrors">
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return <MDBAlert color="warning" key={i} dismiss>{formErrors[fieldName]}</MDBAlert>;
      } else {
        return "";
      }
    })}
  </div>
);

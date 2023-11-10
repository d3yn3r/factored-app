import React from "react";

// for formatting the error message
const ErrorMessage = ({ message }) => (
    <p className="has-text-weight-bold has-text-danger">{message}</p>
);

export default ErrorMessage;
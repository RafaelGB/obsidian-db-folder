import React from "react";

export default function OutlinkIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
      <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
      <line x1="16" y1="21" x2="16" y2="19"></line>
      <line x1="19" y1="16" x2="21" y2="16"></line>
      <line x1="3" y1="8" x2="5" y2="8"></line>
      <line x1="8" y1="3" x2="8" y2="5"></line>
    </svg>
  );
}

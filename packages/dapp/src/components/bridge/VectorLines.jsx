import React from 'react';

export const LeftVector = () => (
  <svg width="201" height="42" viewBox="0 0 201 42" fill="none">
    <path
      d="M200 41L184.184 6.80222C182.547 3.26462 179.005 1 175.107 1H0"
      stroke="url(#paint_left_linear)"
    />
    <defs>
      <linearGradient
        id="paint_left_linear"
        x1="200"
        y1="41"
        x2="0"
        y2="41"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A0B6D7" />
        <stop offset="1" stopColor="#A0B6D7" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const RightVector = () => (
  <svg width="201" height="42" viewBox="0 0 201 42" fill="none">
    <path
      d="M0.999985 41L16.8165 6.80222C18.4526 3.26462 21.9951 1 25.8927 1H201"
      stroke="url(#paint_right_linear)"
    />
    <defs>
      <linearGradient
        id="paint_right_linear"
        x1="0.999985"
        y1="41"
        x2="201"
        y2="41"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A0B6D7" />
        <stop offset="1" stopColor="#A0B6D7" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

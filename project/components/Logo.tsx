import React from 'react';

export const Logo: React.FC<{ className?: string }> = (props) => (
    <svg 
        {...props}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path d="M7.5 7.67V6.5C7.5 4.01 9.51 2 12 2C14.49 2 16.5 4.01 16.5 6.5V7.67" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.5 12.5C20.5 16.33 19.33 17.5 15.5 17.5H8.5C4.67 17.5 3.5 16.33 3.5 12.5V11.5C3.5 7.67 4.67 6.5 8.5 6.5H15.5C19.33 6.5 20.5 7.67 20.5 11.5V12.5Z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.4955 22H8.50446" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17.5V22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

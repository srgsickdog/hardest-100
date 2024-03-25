import React, { useState, useEffect } from "react";

const CountdownTimer: React.FC = () => {
  const [timer, setTimer] = useState(20); // Initial countdown time in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000); // Update timer every 1 second (1000 milliseconds)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [timer]);

  return <div>{timer} seconds</div>;
};

export default CountdownTimer;

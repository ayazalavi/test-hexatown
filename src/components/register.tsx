"use client";

import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

type LoginProps = { click: () => void };
export default function Register(props: LoginProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const onClick = async () => {
    setLoader(true);

    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .catch(() => {});

    setLoader(false);
    if (response.error) {
      setError(response.error);
    } else {
      props.click();
    }
  };
  return (
    <>
      <input
        value={username}
        disabled={loader}
        onChange={(e) => setUsername(e.target.value)}
        className="h-10 p-5 outline-none lg:w-1/2 w-full mt-10 border border-solid border-white bg-transparent text-white text-lg rounded"
      />
      <button
        className="h-10 lg:w-1/2 w-full bg-[#FFA500] text-white text-lg rounded mt-5"
        onClick={onClick}
      >
        Create an account
        {loader ? <CircularProgress size={20} color="secondary" /> : <></>}
      </button>
      <div className="lg:w-1/2 w-full text-center font-mono">
        <h1
          className="text-lg cursor-pointer underline mt-5"
          onClick={props.click}
        >
          Already have an account?
        </h1>
      </div>
    </>
  );
}

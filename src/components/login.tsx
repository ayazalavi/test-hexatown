"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginProps = { click: () => void };
export default function Login(props: LoginProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setLoader(true);
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => resp.json());
    setLoader(false);
    if (response.error) {
      setError(response.error);
    } else {
      localStorage.setItem("token", response.token);
      router.push(`/chat`, { scroll: false });
    }
  };

  return (
    <>
      <input
        value={username}
        disabled={loader}
        onChange={(e) => setUsername(e.target.value)}
        className={
          "h-10 p-5 outline-none lg:w-1/2 w-full mt-10 border border-solid border-white bg-transparent text-white text-lg rounded"
        }
      />
      {error ? <p className="text-error">{error}</p> : <></>}
      <button
        className="h-10 lg:w-1/2 w-full bg-[#FFA500] text-white text-lg rounded mt-5"
        onClick={onClick}
      >
        Login{" "}
        {loader ? <CircularProgress size={20} color="secondary" /> : <></>}
      </button>
      <div className="lg:w-1/2 w-full text-center font-mono">
        <h1
          className="text-lg cursor-pointer underline mt-5"
          onClick={props.click}
        >
          Register a new account
        </h1>
      </div>
    </>
  );
}

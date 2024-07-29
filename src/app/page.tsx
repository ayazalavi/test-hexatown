"use client";

import { useState } from "react";
import Login from "@/components/login";
import Register from "@/components/register";

export default function Home() {
  const [login, setLogin] = useState(false);

  const setLogin_ = () => {
    setLogin(true);
  };

  const setRegister = () => {
    setLogin(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-1/2 text-center font-mono">
        <h1 className="text-xl">Chat Application</h1>
      </div>
      {login ? <Login click={setRegister} /> : <Register click={setLogin_} />}
    </main>
  );
}

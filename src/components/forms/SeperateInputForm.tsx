import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { checkWalletBalance } from "@/lib/actions/wallet.actions";
import Spinner from "../shared/spinner";
import { cn } from "@/lib/utils";
import { useWalletContext } from "@/provider/wallet-provider";

const SeperateInput = ({ numberOfInput, close }: { numberOfInput: number; close?: () => void }) => {
  const [pin, setPin] = useState(new Array(numberOfInput).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const pinBoxRef = React.useRef<HTMLInputElement[]>([]);
  const {userId} = useAuth();
  const {setBalance } = useWalletContext();


  function handleChange(value: string, index: number) {
    let newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < numberOfInput - 1) {
      pinBoxRef.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e: any, index: number) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      pinBoxRef.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfInput - 1) {
      pinBoxRef.current[index + 1].focus();
    }
  }

  async function handleSubmit() {
    const hasEmptyField = pin.some((digit) => digit === "");
    if (hasEmptyField) {
      setError("Please fill in all the fields");
    } else {
      if (userId) {
        setLoading(true);
        const res = await checkWalletBalance(userId, pin.join(""));
        if (res?.status === "error") {
          setError(res?.message);
          setLoading(false);
        } else {
          setBalance(res?.balance || 0);
          setError(""); // Clear any previous error
          setLoading(false);
          if (close) {
            close();
          }
        }
      }

    }

  }

  return (
    <article className="flex flex-col items-center gap-4 mt-10">
      <div className={cn("flex items-center gap-4")}>
        {pin.map((digit, index) => (
          <Input
            key={index}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(reference) => (pinBoxRef.current[index] = reference as HTMLInputElement)}
            className={`w-12 h-12 text-4xl text-center rounded-md ${error ? "border-red-500" : ""}`}
            onKeyDown={(e) => {
              // Allow only numeric keys (0-9) and special keys like Backspace, Enter, Arrow keys
              if (!/^\d$/.test(e.key) && !["Backspace", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        ))}
      </div>
      <Button type="button" variant="secondary" className="w-full" onClick={handleSubmit}>
        {loading ? <Spinner size={4} /> : null}
        <p className="ml-2">Submit</p>
      </Button>
      {error && <div className="text-red-500">{error}</div>}
    </article>
  );
};

export default SeperateInput;

import React, { useEffect, useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SeperateInput = ({numberOfInput} : { numberOfInput:number}) => {
    const [pin, setPin] = useState(new Array(numberOfInput).fill(""));
    const [error, setError] = useState<string>("");
    const pinBoxRef = React.useRef<HTMLInputElement[]>([]);

    function handleChange(value:string , index : number) {
        let newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if(value && index < numberOfInput - 1) {
            pinBoxRef.current[index + 1].focus();
        }
    }

    function handleBackspaceAndEnter(e: any, index: number) {
        if(e.key === "Backspace" && !e.target.value && index > 0) {
          pinBoxRef.current[index - 1].focus();
        }
        if(e.key === "Enter" && e.target.value && index < numberOfInput-1) {
            pinBoxRef.current[index + 1].focus()
        }
    }

    return (
        <article className="flex flex-col items-center gap-4 mt-10">
         <div className='flex items-center gap-4'>
          {pin.map((digit, index)=>(
            <Input key={index} value={digit} maxLength={1}  
            onChange={(e)=> handleChange(e.target.value, index)}
            onKeyUp={(e)=> handleBackspaceAndEnter(e, index)}
            ref={(reference) =>  pinBoxRef.current[index] = reference as HTMLInputElement}
            className="w-12 h-12 text-4xl text-center  rounded-md"
            />
          ))}
         </div>
          <Button type="button" variant="secondary" className="w-full" >
            Submit
            </Button>
        </article>
      );

};

export default SeperateInput;

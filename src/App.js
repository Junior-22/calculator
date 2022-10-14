import React, { useState } from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import './App.css';

// array representation of the data in the wireframe, so we can map through and render all the buttons in the ButtonBox
const btnValues = [
  ["C", "()", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  ["+-", 0, ".", "="],
];

// implement value formatting. Essentially what it does is take a number, format it into the string format and create the space separators for the thousand mark
const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

// If we reverse the process and want to process the string of numbers, first we need to remove the spaces, so we can later convert it to number
const removeSpaces = (num) => num.toString().replace(/\s/g, "");

function App() {

  // define state
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0
  });

  // defaults all the initial values of calc, returning the calc state as it was when the Calculator app was first rendered
  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0
    });
  };

  // checks if there’s any entered value (num) or calculated value (res) and then inverts them by multiplying with -1
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: ""
    });
  };

  // checks if there’s any entered value (num) or calculated value (res) and then calculates the percentage using the built-in Math.pow function, which returns the base to the exponent power
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: ""
    });
  };

  /* calculate the result when the equals button (=) is pressed. It will also make sure that:
     there’s no effect on repeated calls
     users can’t divide with 0
  */
  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
            ? a - b
            : sign === "X"
              ? a * b
              : a / b;

      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "cannot divide with 0"
            : toLocaleString(
              math(
                Number(calc.res),
                Number(calc.num),
                calc.sign
              )
            ),
        sign: "",
        num: 0
      });
    }
  };

  // gets fired when the user press either +, –, * or /. The particular value is then set as a current sign value in the calc object
  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0
    });
  };

  // gets fired only if the decimal point (.) is pressed
  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  /* gets triggered only if any of the number buttons are pressed. It will also make sure that:
     no whole numbers start with zero
     there are no multiple zeros before the comma
     the format will be “0.” if “.” is pressed first
     numbers are entered up to 16 integers long 
  */
  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
              ? toLocaleString(Number(removeSpaces(calc.num + value)))
              : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  return (
    <Wrapper>
      {/* Screen displays the entered number */}
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {
          btnValues.flat().map((btn, i) => {
            return (
              // detect different button types and execute the assigned function once the specific button is pressed
              <Button
                key={i}
                className={btn === "=" ? "equals" : ""}
                value={btn}
                onClick={
                  btn === "C"
                    ? resetClickHandler
                    : btn === "+-"
                      ? invertClickHandler
                      : btn === "%"
                        ? percentClickHandler
                        : btn === "="
                          ? equalsClickHandler
                          : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                            ? signClickHandler
                            : btn === "."
                              ? commaClickHandler
                              : numClickHandler
                }
              />
            )
          })
        }
      </ButtonBox>
    </Wrapper>
  );
}

export default App;

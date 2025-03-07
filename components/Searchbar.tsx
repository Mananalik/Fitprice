"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

function MultiStepAccordion() {
  const [steps, setSteps] = useState([{ id: 1, selected: "" }]);
  const [completedSelection, setCompletedSelection] = useState(false);
  const options1 = ["Protien", "Creatine", "Peanut Butter"];
  const options2 = ["500g", "1kg", "2kg"];
  const options3 = ["Chocolate", "vanilla", "Mixed Fruit"];

  const handleSelection = (id: number, value: string) => {
    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step) =>
        step.id === id ? { ...step, selected: value } : step
      );
      if (id < 3) {
        setCompletedSelection(false);
      } else {
        setCompletedSelection(true);
      }
      if (id < 3) {
        if (!updatedSteps.some((step) => step.id === id + 1)) {
          updatedSteps.push({ id: id + 1, selected: "" });
        }
      }

      return updatedSteps;
    });
  };

  const submitButton = () => {
    if (completedSelection) {
      return (
        <button
          className="bg-black text-white px-3 py-2 rounded-lg w-[25%]
         hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-200">
          Search
        </button>
      );
    }
  };

  const getOptionsForStep = (stepId: number) => {
    switch (stepId) {
      case 1:
        return options1;
      case 2:
        return options2;
      case 3:
        return options3;
      default:
        return [];
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 space-y-4 flex flex-col items-center">
      {steps.map((step) => (
        <Accordion key={step.id} type="single" collapsible>
          <AccordionItem
            key={step.id}
            value={`step-${step.id}`}
            title={`Step ${step.id}`}>
            <div className="space-y-2">
              {getOptionsForStep(step.id).map((option) => (
                <Button
                  key={option}
                  onClick={() => handleSelection(step.id, option)}
                  variant={step.selected === option ? "default" : "outline"}>
                  {option}
                </Button>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      ))}
      {submitButton()}
    </div>
  );
}

export default MultiStepAccordion;

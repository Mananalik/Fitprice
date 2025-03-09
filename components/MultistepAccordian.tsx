"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

function MultiStepAccordion() {
  const [steps, setSteps] = useState([{ id: 1, selected: "" }]);

  // Define product options with weights and flavors
  const optionsMap: Record<string, { weights: string[]; flavors: string[] }> = {
    Protein: {
      weights: ["250g", "500g", "1kg", "2kg", "5kg"],
      flavors: ["Chocolate", "Vanilla", "Strawberry"],
    },
    Creatine: {
      weights: ["100g", "250g", "300g", "400g", "500g", "600g", "800g"],
      flavors: ["Chocolate", "Fruit Punch", "Watermelon"],
    },
    "Peanut Butter": {
      weights: ["250g", "350", "500g", "700", "1kg", "2kg"],
      flavors: [
        "Classic",
        "Honey",
        "jaggery",
        "Chocolate",
        "Natural/Unsweetened",
      ],
    },
  };

  const handleSelection = (id: number, value: string) => {
    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step) =>
        step.id === id ? { ...step, selected: value } : step
      );

      // Add next step if it doesn't exist
      if (id < 3 && !updatedSteps.some((step) => step.id === id + 1)) {
        return [...updatedSteps, { id: id + 1, selected: "" }];
      }

      return updatedSteps;
    });
  };

  const getOptionsForStep = (stepId: number) => {
    if (stepId === 1) {
      return Object.keys(optionsMap); // Get product names (Protein, Creatine, etc.)
    }

    if (stepId === 2) {
      const selectedProduct = steps.find((step) => step.id === 1)?.selected;
      return selectedProduct ? optionsMap[selectedProduct]?.weights : [];
    }

    if (stepId === 3) {
      const selectedProduct = steps.find((step) => step.id === 1)?.selected;
      return selectedProduct ? optionsMap[selectedProduct]?.flavors : [];
    }

    return [];
  };

  const isSelectionComplete =
    steps.length === 3 && steps.every((step) => step.selected !== "");

  return (
    <div className="w-full max-w-xl mx-auto mt-12 space-y-4 flex flex-col items-center">
      {steps.map((step) => (
        <Accordion key={step.id} type="single" collapsible>
          <AccordionItem value={`step-${step.id}`}>
            <div className="space-y-2">
              {getOptionsForStep(step.id)?.map((option: string) => (
                <Button
                  key={option}
                  onClick={() => handleSelection(step.id, option)}
                  variant={step.selected === option ? "default" : "outline"}
                  value={option}
                  title={option}>
                  {option}
                </Button>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      ))}
      {isSelectionComplete && (
        <button className="bg-black text-white px-3 py-2 rounded-lg w-[25%] hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-200">
          Search
        </button>
      )}
    </div>
  );
}

export default MultiStepAccordion;

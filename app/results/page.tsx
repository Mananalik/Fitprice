"use client";
import { Suspense } from "react";
import React from "react";
import ResultsComponent from "./ResultsComponent"; // New component

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

export default Page;

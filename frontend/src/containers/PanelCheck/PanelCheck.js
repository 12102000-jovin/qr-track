import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PanelCheck = () => {
  const { panelId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  const [component1, setComponent1] = useState("");
  const [component2, setComponent2] = useState("");
  const [component1Match, setComponent1Match] = useState("");
  const [component2Match, setComponent2Match] = useState("");
  const [matchBadge1, setMatchBadge1] = useState(null);
  const [matchBadge2, setMatchBadge2] = useState(null);

  const [allMatched, setAllMatched] = useState(false);

  useEffect(() => {
    // Check if both matchBadge values are true
    if (matchBadge1 === true && matchBadge2 === true) {
      setAllMatched(true);
    } else {
      setAllMatched(false);
    }
  }, [matchBadge1, matchBadge2]);

  const handleFormNext = (e) => {
    e.preventDefault();

    setCurrentStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();

    setCurrentStep(1);

    setMatchBadge1(null);
    setMatchBadge2(null);

    setComponent1Match("");
    setComponent2Match("");
  };

  const handleFormCheckMatch = (e) => {
    e.preventDefault();

    if (component1 === component1Match) {
      setMatchBadge1(true);
    } else {
      setMatchBadge1(false);
    }

    if (component2 === component2Match) {
      setMatchBadge2(true);
    } else {
      setMatchBadge2(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
          <div>
            <p className=" text-4xl text-signature font-black mb-5 mt-3 flex items-center justify-center">
              Panel
              <span className="p-2 pl-4 pr-4 ml-3 bg-red-600 text-xl text-white rounded-full">
                {panelId}
              </span>
            </p>
          </div>
          <ol className="mt-10 flex items-center justify-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            <li
              className={`flex md:w-2/4 items-center ${
                currentStep === 1 ? "text-signature" : ""
              } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
            >
              <span
                className={`flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 `}
              >
                {currentStep === 1 ? (
                  <span className="me-2"> 1. </span>
                ) : (
                  <>
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5 ${
                        currentStep === 2 ? "text-green-500" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill={currentStep === 2 ? "green" : "currentColor"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  </>
                )}
                <span className={currentStep === 2 ? "text-gray-500" : ""}>
                  Input
                </span>
                <span
                  className={`hidden sm:inline-flex sm:ms-2 ${
                    currentStep === 2 ? "text-gray-500" : ""
                  }`}
                >
                  Component
                </span>
                <span
                  className={`hidden sm:inline-flex sm:ms-2 ${
                    currentStep === 2 ? "text-gray-500" : ""
                  }`}
                >
                  Serial
                </span>
                <span
                  className={`hidden sm:inline-flex sm:ms-2 ${
                    currentStep === 2 ? "text-gray-500" : ""
                  }`}
                >
                  Number
                </span>
              </span>
            </li>

            <li className="flex">
              <span
                className={`flex items-center after:content-['/']  ${
                  currentStep === 2 ? "text-signature" : ""
                } sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500`}
              >
                <span className="me-2"> 2. </span>
                Match
                <span className="hidden sm:inline-flex sm:ms-2">Component</span>
              </span>
            </li>
          </ol>

          <div className="flex justify-center">
            <form className="w-3/4">
              <label className="block text-xl text-base mt-10 mb-2 flex justify-start font-bold">
                Component 1
              </label>
              {currentStep === 2 ? (
                <input
                  type="password"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                  disabled={currentStep === 2}
                  value={component1}
                />
              ) : (
                <div>
                  <input
                    type="text"
                    className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                    onChange={(e) => setComponent1(e.target.value)}
                    value={component1}
                  />
                </div>
              )}

              <label className="block text-xl text-base mt-10 mb-2 flex justify-start font-bold">
                Component 2
              </label>
              {currentStep === 2 ? (
                <input
                  type="password"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                  disabled={currentStep === 2}
                  value={component2}
                />
              ) : (
                <input
                  type="text"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                  onChange={(e) => setComponent2(e.target.value)}
                  value={component2}
                />
              )}
            </form>

            {currentStep === 2 && (
              <form className="w-3/4 ml-10">
                <label className="block text-xl text-base mt-10 mb-2 flex justify-start font-bold">
                  Component 1
                  {matchBadge1 !== null && (
                    <span
                      className={`p-1 pl-2 pr-2 ml-2 rounded-full  text-white font-bold text-sm ${
                        matchBadge1 === true ? "bg-green-500" : "bg-red-500"
                      } `}
                    >
                      {matchBadge1 === true ? "Matched" : "Not Match"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                  min="1"
                  onChange={(e) => setComponent1Match(e.target.value)}
                />

                <label className="block text-xl text-base mt-10 mb-2 flex justify-start font-bold">
                  Component 2
                  {matchBadge2 !== null && (
                    <span
                      className={`p-1 pl-2 pr-2 ml-2 rounded-full  text-white font-bold text-sm ${
                        matchBadge2 === true ? "bg-green-500" : "bg-red-500"
                      } `}
                    >
                      {matchBadge2 === true ? "Matched" : "Not Match"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focusborder-gray-600 text-black"
                  min="1"
                  onChange={(e) => setComponent2Match(e.target.value)}
                />
              </form>
            )}
          </div>
          <div className="flex justify-center mt-10">
            {currentStep === 2 && (
              <>
                <button
                  className="bg-secondary text-white font-bold mr-2 rounded-md hover:bg-black"
                  onClick={handleBack}
                >
                  Back
                </button>
                {/* {allMatched === false && ( */}
                <button
                  className="bg-black text-white font-bold mr-2 rounded-md hover:bg-secondary"
                  onClick={handleFormCheckMatch}
                >
                  Check
                </button>
                {/* )} */}
              </>
            )}
            {currentStep === 1 && allMatched === false && (
              <button
                className="p-2 bg-signature rounded-md text-white font-bold hover:bg-secondary "
                onClick={handleFormNext}
              >
                Next
              </button>
            )}
            {allMatched && (
              <button
                className="bg-signature text-white font-bold rounded-md hover:bg-secondary"
                // onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCheck;

import React from "react";

/**
 * Generate an info blurb for the given details
 * @param {number} resultsNum The number of results returned
 * @param {string} companyName The name of the company
 */
const InfoBlurb = (resultsNum, companyName) => {
    if (companyName === "") return null;
    if (resultsNum === 0) return <p>No results were returned for assignee "{companyName}"</p>;
    return <React.Fragment>
        <h1>Inventors working for {companyName}</h1>
        <p>Hover over an inventor's name to see: <ul className="align-items-start">
            <li>what concepts were involved in their inventions</li>
            <li>how many patents they were involved in</li>
            <li>(if they have one), what's their Twitter account</li>
            </ul></p>
    </React.Fragment>
}

export default InfoBlurb;
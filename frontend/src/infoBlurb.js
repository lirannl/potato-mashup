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
        <p>Hover over an inventor's name to see what concepts were involved in their inventions, and (if they have one), what's their Twitter account.</p>
    </React.Fragment>
}

export default InfoBlurb;
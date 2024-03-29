import React from "react";
import randomColour from "./colourGen";

/**
 * Pluralises a given word
 * @param num The number based on which to pluralise
 * @param word
 */
const pluralise = (num: number, word: string) => {
  if (num === 1) return word;
  return `${word}s`;
}

/**
 * Expands a data item from the result to a react component
 * @param {{name: string, twitter_username?: string, frequency?: number, concepts: string[]}} inventor
 */
const expandResultItem = (inventor: {name: string, twitter_username?: string, frequency: number, concepts: string[]}) => <div key={inventor.name} className="pure-menu-item pure-menu-has-children pure-menu-allow-hover pure-u-1 pure-u-md-1-4">
  <span className="pure-menu-link" style={{ backgroundColor: randomColour() }}>{inventor.name}</span>
  <ul className="pure-menu-children" style={{ width: "fit-content" }}>
    {(inventor.twitter_username ? <li className="pure-menu-item">
      <a href={`https://twitter.com/${inventor.twitter_username}`} className="pure-menu-link">{`${inventor.twitter_username} `}<img className="inline-image" alt="Twitter" src="twitter.svg" /></a>
    </li> : null)}
{(inventor.frequency ? <li className="pure-menu-item pure-menu-disabled enabled">In {inventor.frequency} {
pluralise(inventor.frequency, "patent")} involving:</li> : null)}
    {inventor.concepts.map(concept => <li key={`${inventor.name}.${concept}`} className="pure-menu-item">
      <span className="pure-menu-item pure-menu-disabled enabled">{concept}</span>
    </li>)}
  </ul>
</div>;

export default expandResultItem;
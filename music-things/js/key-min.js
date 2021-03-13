import{rotate,range}from"tonal-array";import{tokenize as split,altToAcc}from"tonal-note";import{trFifths,fifths,interval,transpose}from"tonal-distance";import{fromDegree,decimal}from"tonal-roman-numeral";const MODES="major dorian phrygian lydian mixolydian minor locrian ionian aeolian".split(" "),NUMS=[0,1,2,3,4,5,6,0,5],NOTES="C D E F G A B".split(" "),TRIADS=["","m","m","","","m","dim"],SEVENTHS="Maj7 m7 m7 Maj7 7 m7 m7b5".split(" "),FIFTHS=[0,2,4,-1,1,3,5,0,3],modenum=e=>NUMS[MODES.indexOf(e)];export const modeNames=e=>!0===e?MODES.slice():MODES.slice(0,7);export const fromAlter=e=>trFifths("C",e)+" major";export const names=(e=4)=>{const t=[];for(let o=-(e=Math.abs(e));o<=e;o++)t.push(fromAlter(o));return t};const NO_KEY=Object.freeze({name:null,tonic:null,mode:null,modenum:null,intervals:[],scale:[],alt:null,acc:null}),properties=e=>{const t=tokenize(e);if(null===t[0])return NO_KEY;const o={tonic:t[0],mode:t[1]};o.name=o.tonic+" "+o.mode,o.modenum=modenum(o.mode);const n=rotate(o.modenum,NOTES);return o.alt=fifths("C",o.tonic)-FIFTHS[MODES.indexOf(o.mode)],o.acc=altToAcc(o.alt),o.intervals=n.map(interval(n[0])),o.scale=o.intervals.map(transpose(o.tonic)),Object.freeze(o)},memo=(e,t={})=>o=>t[o]||(t[o]=e(o));export const props=memo(properties);export const scale=e=>props(e).scale;export const degrees=e=>{const t=props(e);if(null===t.name)return[];return rotate(t.modenum,SEVENTHS).map((e,t)=>fromDegree(t+1,"m"!==e[0]))};export const alteredNotes=e=>{const t=props(e).alt;return null===t?null:0===t?[]:t>0?range(1,t).map(trFifths("B")):range(-1,t).map(trFifths("F"))};export function leadsheetSymbols(e,t,o){if(1===arguments.length)return(t,o)=>leadsheetSymbols(e,t,o);const n=props(t);if(!n.name)return[];const r=rotate(n.modenum,e),s=n.scale.map((e,t)=>e+r[t]);return o?o.map(decimal).map(e=>s[e-1]):s}export const chords=leadsheetSymbols(SEVENTHS);export const triads=leadsheetSymbols(TRIADS);export const secDomChords=e=>{const t=props(e);return t.name?t.scale.map(e=>transpose(e,"P5")+"7"):[]};export const relative=(e,t)=>{if(1===arguments.length)return t=>relative(e,t);const o=modenum(e.toLowerCase());if(void 0===o)return null;const n=props(t);return null===n.name?null:trFifths(n.tonic,FIFTHS[o]-FIFTHS[n.modenum])+" "+e};export const tokenize=e=>{const t=split(e);return t[3]=t[3].toLowerCase(),""===t[0]||-1===MODES.indexOf(t[3])?[null,null]:[t[0]+t[1],t[3]]};
export const katexCSS = `@font-face {
  font-display: swap;
  font-family: KaTeX_Main;
  font-style: normal;
  font-weight: 400;
  src: url(/fonts/KaTeX_Main-Regular.woff2) format("woff2");
}

@font-face {
  font-display: swap;
  font-family: KaTeX_Math;
  font-style: italic;
  font-weight: 400;
  src: url(/fonts/KaTeX_Math-Italic.woff2) format("woff2");
}

.katex {
  font: normal 1.21em KaTeX_Main, Times New Roman, serif;
  line-height: 1.2;
  text-indent: 0;
  text-rendering: auto;
  color: var(--color-text-primary);
}

.boldsymbol {
   font-family:KaTeX_Math;
   font-style:italic;
   font-weight:70;
} 



.katex-mathml {
  clip: rect(1px, 1px, 1px, 1px);
  border: 0;
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.newline {
  display: block;
}

.base {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  width: min-content;
}

.katex-display {
  display: block;
  text-align: center;
  overflow-x: auto;
  white-space: nowrap;
  padding: .4rem 0;
}

.frac-line {
  border-bottom-style: solid;
  display: inline-block;
  width: 100%;
}` 

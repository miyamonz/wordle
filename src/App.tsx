import { useState } from "react";
import wordsText from "../words.txt?raw";
const words = wordsText.split("\n");

function* range(n: number) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}
const m = (input: string, mask: string) => (word: string) =>
  [...range(input.length)]
    .map((i) => {
      const c = input[i];
      const m = mask[i];
      const w = word[i];

      const hitMask = mask.split("").map((m, i) => m === "h" || m === "b");
      const notHitChars = input
        .split("")
        .filter((_, ii) => !hitMask[ii] && ii !== i);

      if (m === "h") {
        return w === c;
      } else if (m === "b") {
        return w !== c && word.indexOf(c) >= 0;
      } else {
        return w !== c && !notHitChars.includes(w);
      }
    })
    .reduce((a, b) => a && b);

function App() {
  const [conds, setConds] = useState<[string, string][]>([]);
  const addCond = (cond: [string, string]) => {
    setConds((c) => [...c, cond]);
  };
  const removeCond = (w: string) => {
    setConds((c) => c.filter((c2) => c2[0] !== w));
  };

  const filtered = conds.reduce((a, b) => a.filter(m(b[0], b[1])), words);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>wordle</h1>
      <ul>
        {conds.map(([input, mask], i) => {
          return (
            <li>
              {[...range(input.length)].map((i) => (
                <>
                  <span
                    style={{
                      width: "1em",
                      background:
                        mask[i] === "h"
                          ? "lightgreen"
                          : mask[i] === "b"
                          ? "lightyellow"
                          : "lightgray",
                    }}
                  >
                    {input[i]}
                  </span>
                </>
              ))}
              <button onClick={() => removeCond(input)}>x</button>
            </li>
          );
        })}
      </ul>
      <Inputs onClick={addCond} />
      <ul>
        {filtered.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

function Inputs({ onClick }: { onClick: (cond: [string, string]) => void }) {
  const [text, setText] = useState("");
  const [hit, setHit] = useState("");

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <input value={hit} onChange={(e) => setHit(e.target.value)} />
      <br />
      <button onClick={() => onClick([text, hit])}>ok</button>
    </>
  );
}

export default App;

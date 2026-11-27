// Starts the engine (routine-web) in this worker. Messages the page sends
// while the wasm loads would otherwise be dropped (nothing listens yet), so
// they wait here and go to the engine's handler once it's set.
const early = [];
self.onmessage = (e) => early.push(e);
importScripts("./routine-web.js?v=40d032c75e71");
wasm_bindgen("./routine-web_bg.wasm?v=40d032c75e71").then(
  () => {
    for (const e of early.splice(0)) self.onmessage(e);
  },
  (err) => {
    console.error("Routine Tracker's engine couldn't start", err);
    self.postMessage({ event: "backend-state", payload: { state: "failed", reason: "crash", error: String(err) } });
  },
);

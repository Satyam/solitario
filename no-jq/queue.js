export const q = [];
let running = false;
export const runQ = () => {
    if (!running && q.length) {
        running = true;
        q.shift()();
        running = false;
        runQ();
    }
};
export const addQ = (fn) => {
    q.push(fn);
    runQ();
};
export const clearQ = () => {
    q.length = 0;
};

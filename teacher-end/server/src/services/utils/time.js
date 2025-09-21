//this function adds hours or days to a given date and returns the new date in ISO string format
export function addHours(date, h) {
    const d = new Date(date); d.setHours(d.getHours() + h); return d.toISOString();
}
export function addDays(date, d) {
    const n = new Date(date); n.setDate(n.getDate() + d); return n.toISOString();
}

/**
 * Utility functions for leave calculations
 */

/**
 * Compute remaining available normal leave days for the current calendar year.
 * - Annual allowance: 16 days
 * - Excludes medical leaves (assumes leave_type or a similar field indicates 'MEDICAL')
 * - Counts only leaves with dates inside the current year
 * - Sums `leave_day_count` for matching leaves
 *
 * @param {Array} leaves - array of leave objects (expected to include leave_type, leave_date, arrival_date, leave_day_count)
 * @param {number} allowance - optional annual allowance (default 16)
 * @returns {number} remainingDays - >= 0
 */
export function computeAvailableNormalLeaves(leaves = [], allowance = 16) {
  if (!Array.isArray(leaves)) return allowance;

  const now = new Date();
  const year = now.getFullYear();

  // Helper to parse YYYY-MM-DD or ISO date strings
  function parseDate(d) {
    if (!d) return null;
    const parsed = new Date(d);
    if (!isNaN(parsed)) return parsed;
    // fallback: try YYYY-MM-DD
    const parts = d.split('-');
    if (parts.length >= 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    return null;
  }

  // Sum days for non-medical leaves that fall in this calendar year
  let used = 0;

  for (const leave of leaves) {
    const type = (leave.leave_type || '').toString().toUpperCase();
    // skip medical/sick leaves
    if (type === 'MEDICAL' || type === 'SICK' || type === 'MED' ) continue;

    // only count approved leaves towards used allowance
    const status = (leave.leave_status || '').toString().toUpperCase();
    if (status !== 'APPROVED' && status !== 'ACCEPTED') continue;

    // Determine leave day count
    const count = Number(leave.leave_day_count) || 0;

    // If leave has start and end dates, check overlap with this year
    const start = parseDate(leave.leave_date);
    const end = parseDate(leave.arrival_date);

    if (start && end) {
      // If both dates are outside this year, skip
      if (end.getFullYear() < year || start.getFullYear() > year) {
        // no overlap
        continue;
      }
      // For simplicity, count the provided leave_day_count when any overlap occurs
      used += count;
    } else {
      // no dates, just add count
      used += count;
    }
  }

  const remaining = Math.max(0, allowance - used);
  return remaining;
}

export default { computeAvailableNormalLeaves };

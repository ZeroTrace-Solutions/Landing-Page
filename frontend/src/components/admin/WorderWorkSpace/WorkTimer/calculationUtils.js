/**
 * Calculates elapsed work time for a worker based on their status history and timestamps.
 * 
 * @param {string[]} workStatus Array of statuses (clockin, clockout, break)
 * @param {string[]} workTimes Array of ISO timestamps corresponding to workStatus
 * @param {number} now Current timestamp in milliseconds
 * @returns {number} Elapsed milliseconds for the current session
 */
export const calculateElapsedTime = (workStatus, workTimes, now) => {
  if (!workStatus || !workStatus.length || !workTimes || !workTimes.length) {
    return 0;
  }

  const activeStatus = workStatus[workStatus.length - 1];
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();

  if (activeStatus === 'clockout') {
    return 0;
  }

  if (activeStatus === 'break') {
    let breakStartTime = 0;
    for (let i = workStatus.length - 1; i >= 0; i--) {
      if (workStatus[i] === 'break') {
        const t = new Date(workTimes[i]).getTime();
        if (!isNaN(t)) breakStartTime = t;
      } else {
        break;
      }
    }
    return breakStartTime > 0 ? Math.max(0, now - breakStartTime) : 0;
  }

  if (activeStatus === 'clockin') {
    const safeLength = Math.min(workStatus.length, workTimes.length);
    if (safeLength === 0) {
      return 0;
    }

    // 1. Find the HARD START of this session
    // A session starts after the LATEST 'clockout' or the start of the day.
    let sessionBoundaryIndex = 0;
    for (let i = safeLength - 1; i >= 0; i--) {
      const t = new Date(workTimes[i]).getTime();
      if (isNaN(t)) continue;
      if (workStatus[i] === 'clockout') {
        sessionBoundaryIndex = i + 1;
        break;
      }
      if (t < todayStart) {
        sessionBoundaryIndex = i + 1;
        break;
      }
    }

    // 2. Sum up work intervals WITHIN this session only
    let sessionWorkMs = 0;
    let runningWorkStart = null;

    for (let i = sessionBoundaryIndex; i < safeLength; i++) {
      const s = workStatus[i];
      const t = new Date(workTimes[i]).getTime();
      if (isNaN(t)) continue;

      if (s === 'clockin') {
        // Start of a new work block (could be first or following a break)
        runningWorkStart = t;
      } else if (s === 'break' && runningWorkStart !== null) {
        // End of a work block because of break
        sessionWorkMs += Math.max(0, t - runningWorkStart);
        runningWorkStart = null;
      }
    }

    // 3. Add current active block if still clocked in
    if (runningWorkStart !== null) {
      // Double-check: ensure the running session start is localized to today
      const effectiveSessionStart = Math.max(runningWorkStart, todayStart);
      sessionWorkMs += Math.max(0, now - effectiveSessionStart);
    }

    return isNaN(sessionWorkMs) ? 0 : sessionWorkMs;
  }

  return 0;
};

/**
 * Formats milliseconds into HH:MM:SS
 * @param {number} ms 
 * @returns {string}
 */
export const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

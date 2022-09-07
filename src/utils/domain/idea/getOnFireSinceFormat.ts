import { DateTime } from "luxon";

export const getOnFireSinceFormat = (onFireSince: string | null) => {
  if (onFireSince) {
    const dtOnFireSince = DateTime.fromISO(onFireSince);

    const diffObj = dtOnFireSince.diffNow("days").toObject();
    if (diffObj.days && diffObj.days < 0) {
      const days = Math.floor(Math.abs(diffObj.days));
      if (days === 0) return "'Today'";
      return `'${days}d ago'`;
    }
  }

  return "LLL dd, yyyy";
};

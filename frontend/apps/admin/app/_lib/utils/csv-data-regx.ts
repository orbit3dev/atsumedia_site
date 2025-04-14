const numberIdRegx = /^\d+$/;

const numberOrEmptyRegx = /^\d*$/;

const numbersCommaSplitOrEmpty = /^\d*(,\d+)*$/;

const numbersSpotSplitOrEmpty = /^\d*(・\d+)*$/;

export const checkId = (item: string) => numberIdRegx.test(item.trim());

export const checkNumberOrEmpty = (item: string) => numberOrEmptyRegx.test(item.trim());

export const checkNumbersCommaSplitOrEmpty = (item: string) => numbersCommaSplitOrEmpty.test(item.trim());

export const checkNumbersSpotSplitOrEmpty = (item: string) => numbersSpotSplitOrEmpty.test(item.trim());

export const checkStringNotEmpty = (item: string) => item.trim().length > 0;

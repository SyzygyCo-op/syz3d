import debounce from "debounce";

/**
 * @param {Function} fn
 * @param {Object}   thisArg
 * @param {number?}  interval
 * @param {boolean?} immediate
 */
export function debounceBoundFn(fn, thisArg, interval, immediate = false) {
  return debounce(fn.bind(thisArg), interval, immediate);
}

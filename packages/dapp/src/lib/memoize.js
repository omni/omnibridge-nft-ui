export const memoize = method => {
  const cache = {};

  return async function memoized(...args) {
    const argString = JSON.stringify(args);
    cache[argString] = cache[argString] || (await method(...args));
    return cache[argString];
  };
};

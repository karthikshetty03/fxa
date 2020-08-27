/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Various utilities that don't fit in a standalone lib

/**
 * Recursively merge an object
 **/
export function deepMerge(
  target: Hash<any>,
  ...sources: Hash<any>[]
): Hash<any> {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  for (const key in source) {
    const value = source[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!target[key]) {
        Object.assign(target, { [key]: {} });
      }

      deepMerge(target[key], value);
    } else {
      Object.assign(target, { [key]: value });
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Convert a search string to its object representation, one entry
 * per query parameter. Assumes the string is a search string and
 * not a full URL without a search string.
 */
export function searchParams(str = '', allowedFields?: string[]) {
  // ditch everything before the ? and from # to the end
  const search = str.replace(/(^.*\?|#.*$)/g, '').trim();
  if (!search) {
    return {};
  }

  return splitEncodedParams(search, allowedFields!);
}

/**
 * Return the value of a single query parameter in the string
 */
export function searchParam(name: string, str?: string): string {
  return searchParams(str)[name];
}

/**
 * Convert a URI encoded string to its object representation.
 *
 * `&` is the expected delimiter between parameters.
 * `=` is the delimiter between a key and a value.
 */
export function splitEncodedParams(str = '', allowedFields?: string[]) {
  const pairs = str.split('&');
  const terms: { [key: string]: string } = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    terms[key] = decodeURIComponent(value).trim();
  });

  if (!allowedFields) {
    return terms;
  }

  return Object.keys(terms)
    .filter((key) => allowedFields.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: terms[key] }), {});
}

export function deleteSearchParams(
  search: Location['search'],
  ...keys: string[]
): string {
  const searchParams = new URLSearchParams(search.slice(1));
  keys.forEach((k) => searchParams.delete(k));
  return searchParams.toString();
}

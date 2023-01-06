export function validURL(str: string) {
  if (!str.includes("github.com")) {
    return false;
  }

  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export function validateBugsUrl(str: string) {
  if (!str.includes("github.com")) {
    return false;
  }

  const pattern = /(https?:\/\/[\w./-]+)/gm;

  return !!pattern.test(str);
}

export default { validURL, validateBugsUrl };

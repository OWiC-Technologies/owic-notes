const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

function getThumbnail_helper(originalUrl, prepend) {
  // Decode the URL to work with it easily
  let decodedUrl = decodeURIComponent(originalUrl);

  // Locate the position of the '?' indicating the start of query parameters
  const queryStartIndex = decodedUrl.indexOf("?");
  const urlBeforeQuery =
    queryStartIndex !== -1
      ? decodedUrl.substring(0, queryStartIndex)
      : decodedUrl;
  const urlAfterQuery =
    queryStartIndex !== -1 ? decodedUrl.substring(queryStartIndex) : "";

  // Find the last '/' in the part of the URL before any query parameters
  const lastSlashIndex = urlBeforeQuery.lastIndexOf("/");

  // Insert 'prepend' before the filename
  let modifiedUrlBeforeQuery;
  if (lastSlashIndex !== -1) {
    const beforeFilename = urlBeforeQuery.substring(0, lastSlashIndex + 1);
    const filename = urlBeforeQuery.substring(lastSlashIndex + 1);

    // Re-encode the part before the filename, as we initially decoded the whole URL
    modifiedUrlBeforeQuery = beforeFilename + prepend + filename + ".jpg";
    // Correctly encode '%' characters that were part of the original encoding
    modifiedUrlBeforeQuery = modifiedUrlBeforeQuery.replace(/%25/g, "%");
  } else {
    // If there's no '/', just prepend "prepend" to the filename
    modifiedUrlBeforeQuery = prepend + urlBeforeQuery + ".jpg";
  }

  // Reassemble the URL
  const newUrl = modifiedUrlBeforeQuery + urlAfterQuery;

  return newUrl;
}

function getThumbnail(savedImg) {
  const filename = encodeURIComponent(savedImg.filename);
  return savedImg.type.startsWith("video")
    ? getThumbnail_helper(savedImg.url, "thumb_")
    : savedImg.url;
}

export { toBase64, getThumbnail };

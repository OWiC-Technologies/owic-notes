const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

function getThumbnail(savedImg) {
  const filename = encodeURIComponent(savedImg.filename);
  return savedImg.type.startsWith("video")
    ? savedImg.url.replace(filename, `thumb_${filename}.jpg`)
    : savedImg.url;
}

export { toBase64, getThumbnail };

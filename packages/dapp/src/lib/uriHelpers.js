export const fetchImageUri = async tokenUri => {
  try {
    const response = await fetch(tokenUri); // Fetch the resource
    const text = await response.text(); // Parse it as text
    const { image } = JSON.parse(text); // Try to parse it as json
    if (!image) throw new Error('Image not found in metadata');
    return image;
  } catch (err) {
    return tokenUri;
  }
};

export const getImage = async (speciesName: string) => {
  // return;

  const encodedName = encodeURI(speciesName);
  const googleResponse = await fetch(
    `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.NEXT_GOOGLE_SEARCH_PSE_ID}&q=${encodedName}&searchType=image&key=${process.env.NEXT_GOOGLE_SEARCH_API_KEY}`
  );

  if (!googleResponse.ok) {
    console.error(googleResponse);
    throw new Error('GOOGLE_ERROR');
  }

  const result = await googleResponse.json();

  console.log({ result: result.items[1] });

  return result.items[1].link;
};

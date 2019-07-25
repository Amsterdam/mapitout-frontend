export const request = async (url, requestConfig) => {
  let response;

  response = await fetch(url, requestConfig);

  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      throw new Error("Invalid server response");
    }
  } else {
    throw new Error("Invalid server response");
  }
};

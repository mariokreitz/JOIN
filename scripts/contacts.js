async function init() {
  const response = await fetchData(firebaseConfig.apiKey + ".json");
  console.log(response);
}

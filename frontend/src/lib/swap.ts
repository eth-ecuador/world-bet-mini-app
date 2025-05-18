const UNO_APP_ID = "app_a4f7f3e62c1de0b9490a5260cb390b56";

export function getUnoDeeplinkUrl({
  fromToken,
  toToken,
  amount,
  referrerAppId,
  referrerDeeplinkPath,
}: {
  fromToken?: string;
  toToken?: string;
  amount?: string;
  referrerAppId?: string;
  referrerDeeplinkPath?: string;
}) {
  let path = `?tab=swap`;
  if (fromToken) {
    path += `&fromToken=${fromToken}`;
    if (amount) {
      path += `&amount=${amount}`;
    }
  }
  if (toToken) {
    path += `&toToken=${toToken}`;
  }
  if (referrerAppId) {
    path += `&referrerAppId=${referrerAppId}`;
  }
  if (referrerDeeplinkPath) {
    path += `&referrerDeeplinkPath=${encodeURIComponent(referrerDeeplinkPath)}`;
  }
  const encodedPath = encodeURIComponent(path);
  return `https://worldcoin.org/mini-app?app_id=${UNO_APP_ID}&path=${encodedPath}`;
}

import { useEffect, useState } from "react";

import { getSeedPhrase } from "../helpers";

export const useSeedPhrase = () => {
  const [seedPhrase, setSeedPhrase] = useState<string>(null);
  useEffect(() => {
    (async () => {
      const result = await getSeedPhrase();
      setSeedPhrase(result);
    })();
  });
  return seedPhrase;
};

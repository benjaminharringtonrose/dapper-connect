import { useEffect, useState } from "react";

import { getSeedPhrase } from "../helpers";

export const useSeedPhrase = () => {
  const [seedphrase, setSeedphrase] = useState<string>(null);
  useEffect(() => {
    (async () => {
      const result = await getSeedPhrase();
      setSeedphrase(result);
    })();
  });
  return seedphrase;
};

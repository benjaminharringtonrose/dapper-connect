import { useEffect, useState } from "react";

import { getSeedPhraseFromSecureStore } from "../helpers";

export const useSeedphrase = () => {
  const [seedphrase, setSeedphrase] = useState<string>(null);
  useEffect(() => {
    (async () => {
      const result = await getSeedPhraseFromSecureStore();
      setSeedphrase(result);
    })();
  });
  return seedphrase;
};

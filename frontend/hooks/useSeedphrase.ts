import { useEffect, useState } from "react";

import { getSeedphrase } from "../helpers";

export const useSeedphrase = () => {
  const [seedphrase, setSeedphrase] = useState<string>(null);
  useEffect(() => {
    (async () => {
      const result = await getSeedphrase();
      setSeedphrase(result);
    })();
  });
  return seedphrase;
};

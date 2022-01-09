import { useEffect, useState } from "react";

import { secureStore } from "../classes";

export const usePassword = () => {
  const [password, setPassword] = useState<string>(null);
  useEffect(() => {
    (async () => {
      const password = await secureStore.getPassword();
      setPassword(password);
    })();
  }, []);
  return password;
};

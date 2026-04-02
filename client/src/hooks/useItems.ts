import { useState, useEffect } from "react";
import type { ItemsMap } from "../types/item";

export const useItems = () => {
  const [items, setItems] = useState<ItemsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.opendota.com/api/constants/items", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }

        return res.json();
      })
      .then((data: ItemsMap) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { items, loading };
};

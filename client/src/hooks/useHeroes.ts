import { useState, useEffect } from "react";
import type { Hero } from "../types/hero";

export const useHeroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.opendota.com/api/heroStats", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch heroes");
        }

        return res.json();
      })
      .then((data: Hero[]) => {
        setHeroes(data.sort((a, b) => a.localized_name.localeCompare(b.localized_name)));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { heroes, loading, error };
};

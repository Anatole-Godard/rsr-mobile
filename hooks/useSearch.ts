import * as React from "react";

export function useSearch<T = object>(key: keyof T, items: T[]) {
  const [search, setSearch] = React.useState("");
  const [filtered, setFiltered] = React.useState<T[]>(items);

  // if the 'items' change, make sure we update our state.
  React.useEffect(() => {
    setFiltered(items);
  }, [items]);

  function onChange(e: string) {
    const value = e;
    setSearch(value);

    // if there's no hits found, set filtered back to all items
    if (value.length <= 0) {
      setFiltered(items);

      // else, search on the provided 'key'
    } else {
      setFiltered(
        items.filter((v) =>
          (v[key] as unknown as string)
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
    }
  }

  return {
    search,
    onChange,
    filtered,
  };
}

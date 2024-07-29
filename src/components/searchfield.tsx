import { TextField } from "@mui/material";
import React, { FC } from "react";

export type SearchFieldType = {
  search: string;
  searchUsers: () => void;
  setSearch: (text: string) => void;
};
export default function SearchField({
  search,
  searchUsers,
  setSearch,
}: SearchFieldType) {
  return (
    <TextField
      id="standard-basic"
      label="Search User"
      variant="standard"
      value={search}
      onKeyDown={({ nativeEvent: { key } }) => {
        if (key === "Enter") {
          searchUsers();
        }
      }}
      onChange={(e) => setSearch(e.target.value)}
      inputProps={{ className: "text-white" }}
      sx={{
        width: "95%",
        marginLeft: "6px",
        input: {
          color: "white",
          paddingLeft: "5px",
          paddingRight: "5px",
        },
        label: { color: "white" },
        "& .MuiInput-underline:before": { borderBottomColor: "white" },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottomColor: "white",
        },
        "& .MuiInput-underline:after": { borderBottomColor: "white" },
      }}
    />
  );
}

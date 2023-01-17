import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React from "react";

export default function TblHead(props) {
  const { HeadCells, order, setOrder, setOrderBy, orderBy } = props;

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  return (
    <TableHead
      sx={{
        backgroundColor: "#faebd7",
      }}
    >
      <TableRow>
        {HeadCells.map((HeadCell) => (
          <TableCell key={HeadCell.id}>
            <TableSortLabel
              active={orderBy === HeadCell.id}
              direction={orderBy === HeadCell.id ? order : "asc"}
              onClick={() => {
                handleSortRequest(HeadCell.id);
              }}
            >
              {HeadCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

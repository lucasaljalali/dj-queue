"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  collection,
  query,
  where,
  orderBy as orderQueryBy,
  limit,
  startAfter,
  getCountFromServer,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/app/services/firebase";
import { useAuth } from "@/app/contexts/AuthContext";
import { IMusic, Order } from "@/app/global";
import { getStableSort } from "@/app/utils/getStableSort";
import TableToolbar from "./TableToolbar";
import CustomTableHead from "./CustomTableHead";
import EditIcon from "@mui/icons-material/Edit";
import EditMusicForm from "../EditMusicForm";

export default function UserMusics() {
  const [data, setData] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IMusic>("title");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { currentUser } = useAuth();
  const editFormData = useRef<IMusic | null>(null);

  let loading = false;
  let isFetching = true;

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IMusic) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.data().id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex >= 0) {
      newSelected = selected.filter((itemId) => itemId !== id);
    }
    setSelected(newSelected);
  };

  const handleEditClick = (event: React.MouseEvent<unknown>, data: IMusic) => {
    event.stopPropagation();
    editFormData.current = data;
    setEditFormOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    handleFetch(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTotal) : 0;

  const visibleRows = useMemo(() => getStableSort(data, order, orderBy, page, rowsPerPage), [data, order, orderBy, page, rowsPerPage]);

  const handleFetch = async (loadOneMorePage?: boolean) => {
    loading = true;

    if (currentUser) {
      const musicsCollectionRef = collection(db, "musics");
      const pagination = loadOneMorePage ? [startAfter(data[data.length - 1]?.data()?.[orderBy])] : [];
      const queryOptions = [where("user", "==", currentUser?.uid), orderQueryBy(orderBy, order), ...pagination];
      const musicsQuery = query(musicsCollectionRef, ...queryOptions, limit(rowsPerPage));

      const musicsSnapshot = await getDocs(musicsQuery);
      const incomingIds = musicsSnapshot.docs.flatMap((doc) => doc.id);
      setData((prev) => [...prev.filter((prevMusic) => !incomingIds.includes(prevMusic.id)), ...musicsSnapshot.docs]);

      if (!loadOneMorePage) {
        const musicsCount = query(musicsCollectionRef, ...queryOptions);
        const totalCount = await getCountFromServer(musicsCount);
        setDataTotal(totalCount.data().count);
      }

      isFetching = false;
    }
  };

  useEffect(() => {
    if (currentUser && orderBy && order && rowsPerPage && !loading) {
      handleFetch().finally(() => (loading = false));
    }
  }, [currentUser, orderBy, order, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <CustomTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={dataTotal}
            />
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>{isFetching ? "LOADING..." : "EMPTY LIST"}</TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(String(row.id));
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, String(row.id))}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{row.genre}</TableCell>
                      <TableCell align="right">{row.duration}</TableCell>
                      <TableCell align="right">
                        {
                          <IconButton onClick={(event) => handleEditClick(event, row as IMusic)}>
                            <EditIcon />
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataTotal}
          rowsPerPage={rowsPerPage}
          page={rowsPerPage >= dataTotal ? 0 : page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {editFormData.current && <EditMusicForm open={editFormOpen} setState={setEditFormOpen} data={editFormData.current} />}
    </Box>
  );
}

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TblHead from "./TblHead";
import axios from "axios";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CloseIcon from "@mui/icons-material/Close";
import ActionButtons from "./ActionButtons";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Input from "./Input";
import Button from "./Button";
import EmployeeForm from "./EmployeeForm";
import Popup from "./Popup";
import { nanoid } from "nanoid";
import ConfirmDialog from "./ConfirmDialog";

const HeadCells = [
  { id: "fullName", label: "Name" },
  { id: "address", label: "Address" },
  { id: "phoneNumber", label: "Phone number" },
  { id: "email", label: "Email" },
  { id: "actions", label: "Actions" },
];

const initialValue = {
  fullName: "",
  address: "",
  phoneNumber: "",
  email: "",
};

export default function Employee() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState([]);
  const [values, setValues] = useState(initialValue);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [formState, setFormState] = useState(null);
  const [filterFn, setFilterFn] = useState("");

  const pages = [5, 10, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const closeModal = () => {
    setOpenPopup(false);
    setRecordForEdit(null);
    setValues(initialValue);
  };

  const baseURL = "http://localhost:3004/users";

  const fetchData = () => {
    axios.get(baseURL).then((response) => {
      setRecords(response.data);
      setFilter(response.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;

    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const insertEmployee = () => {
    const newContact = {
      id: nanoid(),
      fullName: values.fullName,
      address: values.address,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    axios.post(baseURL, newContact).then((response) => {
      setRecords((state) => [...state, response.data]);
    });

    resetForm();
    setOpenPopup(false);
  };

  const updateEmployee = (updateValues) => {
    const editContact = {
      fullName: values.fullName,
      address: values.address,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    axios.put(`${baseURL}/${updateValues.id}`, editContact).then((response) => {
      setRecords((state) =>
        state.map((record) => {
          if (record.id === updateValues.id) {
            return response.data;
          }
          return record;
        })
      );
    });

    closeModal();
  };

  const onDelete = (recordId) => {
    setConfirmDialog({
      isOpen: false,
    });

    axios.delete(`${baseURL}/${recordId}`).then(() => {
      setRecords((state) => state.filter((record) => record.id !== recordId));
    });
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const resetForm = () => {
    setValues(initialValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const recordsAfterPaging = (data) => {
    return data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(data, comparator) {
    const stabilizedThis = data.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const keys = ["fullName", "address", "email"];

  const handleSearch = (data) => {
    const filtered = data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(filterFn))
    );

    return filtered;
  };

  return (
    <>
      <Paper>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Input
            label="Search Empolyees"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setFilterFn(e.target.value)}
          />
          <Button
            text="Add new"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true);
              setFormState("create");
            }}
          />
        </Toolbar>

        <Table sx={{ marginTop: "24px" }}>
          <TblHead
            HeadCells={HeadCells}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />

          <TableBody>
            {handleSearch(records).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <ActionButtons color="primary">
                    <ModeEditOutlineIcon
                      fontSize="small"
                      onClick={() => {
                        openInPopup(item);
                        setFormState("edit");
                      }}
                    />
                  </ActionButtons>
                  <ActionButtons color="error">
                    <CloseIcon
                      fontSize="small"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure?",
                          subTitle: "You cant undo this!",
                          onConfirm: () => {
                            onDelete(item.id);
                          },
                        })
                      }
                    />
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TablePagination
                page={page}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                count={records.length}
                rowsPerPageOptions={pages}
                onPageChange={handleChangePage}
              />
            </TableRow>
          </TableBody>
        </Table>
        <Popup
          title="Employee Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          resetForm={resetForm}
          closeModal={closeModal}
        >
          <EmployeeForm
            values={values}
            resetForm={resetForm}
            handleInputChange={handleInputChange}
            insertEmployee={insertEmployee}
            setValues={setValues}
            recordForEdit={recordForEdit}
            updateEmployee={updateEmployee}
            formState={formState}
          />
        </Popup>
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </Paper>
    </>
  );
}

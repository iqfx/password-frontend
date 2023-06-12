import { Alert, AlertTitle, Box, Snackbar, Typography } from "@mui/material";
import {
  GridRow,
  GridColumnHeaders,
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback, memo } from "react";
import EditPasswords from "@/components/EditModal";
import DeleteModal from "./DeleteModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import AddPasswordModal from "./AddPasswordModal";
import { decryptData } from "./decryptDataUtil";
import PasswordPromptModal from "./PasswordPromptModal";
export default function PasswordTable() {
  const { user, error, isLoading } = useUser();
  const [copiedData, setCopiedData] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] =
    useState(false);
  const [userHasSetMasterPassword, setUserHasSetMasterPassword] =
    useState(false);

  useEffect(() => {
    let fetchMasterPasswordBoolean = async () => {
      try {
        const response = await fetch("/api/user", {method: "GET"});
        const data = await response.json();
        setShowMasterPasswordPrompt(data.hasSetMasterPassword);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMasterPasswordBoolean();
  });

  // pagination
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const getCookie = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      const cookieName = cookie[0];
      const cookieValue = cookie[1];

      if (cookieName === "token") {
        return cookieValue;
      }
    }

    return null;
  };
  const cookie = getCookie();
  const HandlePaginationModelChange = async (params: any) => {
    setPaginationModel(params);
    await fetchData();
  };

  let fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/password?pageNumber=" +
          paginationModel.page +
          "&pageSize=" +
          paginationModel.pageSize
      );
      const jsonData = await response.json();
      setData(jsonData.passwords);
      setTotalRows(jsonData.totalRows);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: false,
    },
    {
      field: "userName",
      headerName: "Username",
      flex: 1,
      editable: false,
    },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      editable: false,
      renderCell: (params) => {
        try {
          return <p>{decryptData(params.row.password, cookie ?? "")}</p>;
        } catch (error) {
          setShowMasterPasswordPrompt(true);
        }
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        try {
          return <EditPasswords password={params} fetchData={fetchData} />;
        } catch (error) {
          setShowMasterPasswordPrompt(true);
        }
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return <DeleteModal password={params} fetchData={fetchData} />;
      },
    },
  ];

  const handleOpen = (data: string) => {
    setCopiedData(data);
    setOpen(true);
  };
  function DataGridTitle() {
    return (
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Welcome, {user?.name}</Typography>
      </Box>
    );
  }
  const handleClose = () => setOpen(false);

  const MemoizedRow = memo(GridRow);
  const MemoizedColumnHeaders = memo(GridColumnHeaders);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {showMasterPasswordPrompt && (
        <PasswordPromptModal handleFinish={fetchData} />
      )}

      <AddPasswordModal fetchData={fetchData} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => {
            handleClose();
          }}
          severity="info"
        >
          <AlertTitle>Copied data:</AlertTitle>
          <code
            style={{
              display: "block",
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-line",
            }}
          >
            {copiedData}
          </code>
        </Alert>
      </Snackbar>

      <Box
        sx={{
          height: 600,
          width: "70%",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DataGrid
          slots={{
            row: MemoizedRow,
            columnHeaders: MemoizedColumnHeaders,
          }}
          rows={data}
          components={{ Toolbar: DataGridTitle }}
          onClipboardCopy={(copiedString) => handleOpen(copiedString)}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={HandlePaginationModelChange}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}

// components/ButtonWithDialog.tsx
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { IoClose } from "react-icons/io5";

interface ButtonWithDialogProps {
    buttonText: string;
    title: string;
    label: string;
    type: string;
    multiple?: boolean;
    onSubmit: (inputValue: string) => void;
    success: string;
    setSuccess: (success: string) => void;
    error: string;
    setError: (error: string) => void;
}

const ButtonWithDialog: React.FC<ButtonWithDialogProps> = ({
    buttonText,
    title,
    label,
    type,
    multiple = false,
    onSubmit,
    success,
    setSuccess,
    error,
    setError,
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Hàm mở dialog
    const handleOpen = () => {
        setOpen(true);
    };
    
    // Hàm đóng dialog
    const handleClose = () => {
        setOpen(false);
        setInputValue("");
        setSuccess("");
        setError("");
    };

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setSuccess("");
        setError("");
    };

    // Hàm xử lý khi nhấn nút submit
    const handleSubmit = () => {
        onSubmit(inputValue);
        setError("");
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                {buttonText}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                PaperProps={{
                    style: {
                        padding: "0.5rem 0.5rem 0.75rem",
                    }
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        top: "0rem",
                        right: "0rem",
                        borderRadius: "0%",
                        ":hover": {
                            backgroundColor: "var(--close-bg)",
                        }
                    }}
                >
                    <IoClose />
                </IconButton>

                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={label}
                        type={type}
                        multiline={multiple}
                        rows={multiple ? 5 : 1}
                        fullWidth
                        variant="outlined"
                        value={inputValue}
                        onChange={handleChange}
                    />
                </DialogContent>

                {success !== "" && (
                    <p
                        style={{
                            padding: "0 1.75rem 0.5rem",
                            color: "#4caf50",
                        }}
                    >
                        {success}
                    </p>
                )}

                {error !== "" && (
                    <p
                        style={{
                            padding: "0 1.75rem 0.5rem",
                            color: "#f85149",
                        }}
                    >
                        {error}
                    </p>
                )}

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={inputValue === "" || success !== ""}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ButtonWithDialog;

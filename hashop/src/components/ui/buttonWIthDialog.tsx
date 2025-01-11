// components/ButtonWithDialog.tsx
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface ButtonWithDialogProps {
    buttonText: string;
    title: string;
    label: string;
    onSubmit: (inputValue: string) => void;
    success: string;
    setSuccess: (success: string) => void;
    error: string;
}

const ButtonWithDialog: React.FC<ButtonWithDialogProps> = ({
    buttonText,
    title,
    label,
    onSubmit,
    success,
    setSuccess,
    error,
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
    };

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setSuccess("");
    };

    // Hàm xử lý khi nhấn nút submit
    const handleSubmit = () => {
        onSubmit(inputValue);
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
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={label}
                        type="text"
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

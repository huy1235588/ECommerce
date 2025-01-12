// components/ButtonWithDialog.tsx
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { IoClose } from "react-icons/io5";
import LoadingCube from "../loading/loadingCube";
import { useNotification } from "@/context/NotificationContext";
import { v4 as uuidv4 } from "uuid";

type SuccessLink = {
    href: string;
    text: string;
    color?: string | "#4caf50";
};

interface ButtonWithDialogProps {
    buttonText: string;
    title: string;
    label: string;
    type: string;
    multiple?: boolean;
    onSubmit: (inputValue: string) => void;
    success: string;
    successLinks?: {
        title: { text: string; color?: string | "#4caf50" };
        links: SuccessLink[];
    };
    setSuccess: (success: string) => void;
    error: string;
    setError: (error: string) => void;
    loading?: string;
    setLoading?: (loading: string) => void;
}

const ButtonWithDialog: React.FC<ButtonWithDialogProps> = ({
    buttonText,
    title,
    label,
    type,
    multiple = false,
    onSubmit,
    success,
    successLinks,
    setSuccess,
    error,
    setError,
    loading,
    setLoading,
}) => {
    const { notificationDispatch } = useNotification();

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Hàm reset state
    const resetStates = () => {
        setInputValue("");
        setSuccess("");
        setError("");
        setLoading?.("");
        successLinks = undefined;
    };

    // Hàm mở dialog
    const handleOpen = () => {
        setOpen(true);
        resetStates();
    };

    // Hàm đóng dialog
    const handleClose = () => {
        setOpen(false);
        resetStates();
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
                        error={error !== ""}
                    />
                </DialogContent>

                {success && (
                    <div style={{ padding: "0 1.75rem 0.5rem", color: "#4caf50" }}>
                        <p>{success}</p>
                        {successLinks && successLinks.links.length !== 0 && (
                            <>
                                <span
                                    style={{
                                        color: successLinks.title.color || "#4caf50",
                                        fontWeight: "bold",
                                        marginRight: "0.5rem",
                                    }}
                                >
                                    {successLinks.title.text}
                                </span>

                                {successLinks.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: link.color,
                                            textDecoration: "underline",
                                            marginRight: "0.5rem",
                                        }}
                                    >
                                        {link.text}
                                    </a>
                                ))}

                                {/* Copy all Link button */}
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={async () => {
                                        try {
                                            // Lấy danh sách các liên kết từ successLinks.links
                                            const links = successLinks?.links?.map((link) => link.href).join("\n") || '';

                                            // Sao chép vào clipboard
                                            await navigator.clipboard.writeText(links);

                                            // Thông báo
                                            notificationDispatch({
                                                type: "ADD_NOTIFICATION",
                                                payload: {
                                                    id: `copied-all-links-${uuidv4()}`,
                                                    message: "Copied all links to clipboard!",
                                                    type: "success",
                                                    duration: 3000,
                                                },
                                            });

                                        } catch (error) {
                                            console.error('Failed to copy links:', error);
                                        }
                                    }}
                                    sx={{
                                        padding: "0.25rem 0.5rem",
                                        marginLeft: "1rem",
                                        fontSize: "0.75rem",
                                        color: "white",
                                        backgroundColor: "#1769aa",
                                        textTransform: "none",
                                        ":hover": {
                                            backgroundColor: "#1e87db",
                                        }
                                    }}
                                >
                                    Copy all links
                                </Button>
                            </>
                        )}
                    </div>
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

                {loading !== "" && (
                    <p
                        style={{
                            padding: "0 1.75rem 0.5rem",
                            color: "#2196f3",
                        }}
                    >
                        {loading}
                        <LoadingCube
                            style={{
                                width: "4.5rem",
                                height: "1rem",
                            }}
                            color="#2196f3"
                            size="0.5rem"
                        />
                    </p>
                )}

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={!inputValue || !!success}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ButtonWithDialog;

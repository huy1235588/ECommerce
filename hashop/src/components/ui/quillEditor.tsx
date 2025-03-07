import { useEffect, useRef } from "react";
import "@/styles/assets/quill.snow.css";
import Quill from "quill";
import Delta from 'quill-delta';
import { Box, InputLabel } from "@mui/material";

interface QuillEditorProps {
    id: string;
    name: string;
    label: string;
    labelOptional?: string;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    sx?: React.CSSProperties;
    error?: boolean;
    setError: (name: string, value: string) => void;
    errorText?: string;
}

const toolbarQuill = [
    ['bold', 'italic', 'underline', 'strike'], // Chữ đậm, nghiêng, gạch chân, gạch ngang
    [{
        'color': []
    }, {
        'background': []
    }], // Màu chữ và màu nền
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }], // Chỉ số dưới và chỉ số trên
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }], // Tiêu đề
    [{
        'align': []
    }], // Căn lề
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }], // Danh sách có thứ tự và không thứ tự
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }], // Thụt lề
    ['blockquote', 'code-block'], // Trích dẫn và khối mã
    ['link', 'image', 'video', 'customImage'], // Chèn liên kết, hình ảnh, video, hình ảnh từ URL
    ['clean'] // Xóa định dạng
];

const QuillEditor: React.FC<QuillEditorProps> = ({
    id,
    name,
    label,
    labelOptional = "",
    placeholder = "",
    value,
    onChange,
    sx,
    error,
    setError,
    errorText
}) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const quill = useRef<Quill | null>(null);

    useEffect(() => {
        if (quillRef.current) {
            // Khởi tạo Quill
            quill.current = new Quill(quillRef.current, {
                theme: 'snow',
                bounds: quillRef.current,
                placeholder: placeholder,
                modules: {
                    toolbar: {
                        container: toolbarQuill,
                        handlers: {
                            customImage: customImage
                        }
                    }
                }
            });

            // Thêm icon cho customImage
            const customImageButton = document.querySelector('.ql-customImage');
            if (customImageButton) {
                customImageButton.innerHTML = `
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" 
                        viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="18px" width="18px" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="#aaa" d="M40,41H8c-2.2,0-4-1.8-4-4V11c0-2.2,1.8-4,4-4h32c2.2,0,4,1.8,4,4v26C44,39.2,42.2,41,40,41z"></path>
                        <circle fill="#fff" cx="35" cy="16" r="3"></circle>
                        <polygon fill="#ddd" points="20,16 9,32 31,32"></polygon>
                        <polygon fill="#fff" points="31,22 23,32 39,32"></polygon>
                        <circle fill="#43A047" cx="38" cy="38" r="10"></circle>
                        <g fill="#fff">
                            <rect x="36" y="32" width="4" height="12"></rect>
                            <rect x="32" y="36" width="12" height="4"></rect>
                        </g>
                    </svg>
                `;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (quill.current && value !== undefined) {
            // Tách logic so sánh thành hàm riêng
            const shouldUpdate = () => {
                const currentHtml = quill.current!.root.innerHTML;
                return currentHtml !== value;
            };

            if (!shouldUpdate()) return;

            // Lưu vị trí con trỏ hiện tại
            const selection = quill.current.getSelection();

            // Tạm ngắt sự kiện
            quill.current.off("text-change");

            // Cập nhật nội dung
            quill.current.clipboard.dangerouslyPasteHTML(value);

            // Khôi phục vị trí con trỏ
            if (selection) {
                setTimeout(() => quill.current!.setSelection(selection), 0);
            }

            // Bật lại sự kiện
            const handler = () => {/* ... */ };
            quill.current.on("text-change", handler);
        }
    }, [value]);

    // Xử lý sự kiện thay đổi văn bản
    useEffect(() => {
        if (quill.current) {
            // Xử lý khi thay đổi nội dung
            const handler = (delta: Delta, oldDelta: Delta, source: string) => {
                if (source === "user") {
                    const html = quill.current!.root.innerHTML;
                    onChange(html);
                    setError(id, "");
                }
            };

            quill.current.on("text-change", handler);

            // Cleanup khi component unmount
            return () => {
                quill.current!.off("text-change", handler);
            };
        }
    }, [onChange, id, setError]);

    // Xử lý khi có lỗi
    useEffect(() => {
        if (error) {
            quillRef.current?.classList.add('error');
        } else {
            quillRef.current?.classList.remove('error');
        }
    }, [error]);

    // Hàm xử lý custom image
    const customImage = () => {
        if (!quill.current) return;

        // @ts-expect-error: tooltip property is missing type definitions from Quill's theme
        const tooltip = quill.current.theme.tooltip;
        const originalSave = tooltip.save;
        const originalHide = tooltip.hide;

        tooltip.save = function () {
            const range = quill.current?.getSelection(true);
            const value = tooltip.textbox.value;
            if (value && range) {
                quill.current?.insertEmbed(range.index, 'image', value, 'user');
            }
        };

        // Gọi hàm save khi nhấn Enter
        tooltip.hide = function () {
            tooltip.save = originalSave;
            tooltip.hide = originalHide;
            tooltip.hide();
        };

        tooltip.edit('image');
        tooltip.textbox.placeholder = 'Image URL';
    };

    return (
        <Box
            className={name}
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
                ...sx,
            }}
        >
            <InputLabel
                htmlFor={id}
                sx={{
                    display: "inline-block",
                    width: "auto",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    marginLeft: "0.125rem",
                }}
            >
                {label}

                {labelOptional !== "" ? (
                    <span
                        style={{
                            color: "gray",
                            marginLeft: "0.25rem",
                        }}
                    >
                        {labelOptional}
                    </span>
                ) : null}

            </InputLabel>

            <div
                id={id}
                ref={quillRef}
                style={{
                    height: '300px'
                }}
            ></div>

            {error && errorText ? (
                <span
                    style={{
                        color: "red",
                        fontSize: "0.75rem",
                        marginLeft: "0.125rem",
                    }}
                >
                    {errorText}
                </span>
            ) : null}
        </Box>
    );
};

export default QuillEditor;
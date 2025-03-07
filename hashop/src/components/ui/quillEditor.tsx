import { useEffect, useRef } from "react";
import "@/styles/assets/quill.snow.css";
import Quill from "quill";
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
    const quill = useRef<Quill>();

    useEffect(() => {
        if (quillRef.current) {
            // Khởi tạo Quill
            quill.current = new Quill(quillRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                bounds: quillRef.current,
                debug: 'info',
                modules: {
                    toolbar: toolbarQuill
                }
            });

            // Gán giá trị cho Quill
            if (value) {
                quill.current.root.innerHTML = value;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý khi value thay đổi
    useEffect(() => {
        // Xử lý khi thay đổi nội dung
        if (quill.current) {
            quill.current.on('text-change', () => {
                const html = quill.current?.root.innerHTML ?? '';
                onChange(html);
                setError(id, '');
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, onChange]);

    // Xử lý khi có lỗi
    useEffect(() => {
        if (error) {
            quillRef.current?.classList.add('error');
        } else {
            quillRef.current?.classList.remove('error');
        }
    }, [error]);

    return (
        <Box
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
                style={{ height: '300px' }}
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
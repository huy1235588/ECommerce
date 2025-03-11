'use client'

import { GenreData, Product, ProductMovie, TypeData } from "@/types/product";
import { Box, Button, Grid2, SelectChangeEvent } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from "react";
import "@/styles/pages/admin/product.css"
import InputForm from "@/components/ui/inputForm";
import MultipleSelectForm from "@/components/ui/multipleSelectForm";
import DateTimePickerForm from "@/components/ui/dateTimePickerForm";
import axios from "@/config/axios";
import axiosLib from "axios";
import dayjs, { Dayjs } from "dayjs";
import validateProduct from "@/utils/validate";
import UploadImages from "@/components/ui/uploadImages";
import FileUploader from "@/components/ui/fileUploader";
import ButtonWithDialog from "@/components/ui/buttonWIthDialog";
import { useLoading } from "@/context/LoadingContext";
import DynamicInputVideo from "@/components/admin/dynamicInputVideos";
import SelectForm from "@/components/ui/selectForm";
import { useNotification } from "@/context/NotificationContext";
import { v4 as uuidv4 } from "uuid";

type ErrorForm = {
    path: string | null;
    msg: string;
};

// Khởi tạo formData ban đầu
const initialFormData: Product = {
    _id: -1,
    name: '',
    type: '',
    short_description: '',
    price_overview: {
        currency: 'USD',
        initial: 0,
        final: 0,
        discount_percent: 0
    },
    release_date: {
        coming_soon: false,
        date: dayjs()
    },
    developers: [],
    publishers: [],
    genres: [],
    tags: [],
    header_image: "",
    screenshots: [],
    movies: [],
};

function ECommerceAddProductPage() {
    const { notificationDispatch } = useNotification(); // Sử dụng context Notification
    const [errors, setErrors] = useState<ErrorForm[]>([]);
    const { setLoading } = useLoading();
    const [buttonDialogState, setButtonDialogState] = useState({
        loading: "",
        error: "",
        success: "",
        successLinks: {
            title: { text: "", color: "#4caf50" },
            links: [] as {
                href: string;
                text: string;
                color?: string | "#4caf50";
            }[]
        }
    });

    // Form data state
    const [formData, setFormData] = useState<Product>(initialFormData);

    // Xử lý thay đổi dữ liệu form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Xử lý submit form
    const handleSubmit = async () => {
        try {
            // Kiểm tra dữ liệu form
            const formDataErrors = validateProduct(formData);
            if (formDataErrors.length > 0) {
                setErrors(formDataErrors);

                // Hiển thị thông báo lỗi
                notificationDispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: `product-valid-${uuidv4()}`,
                        message: "Failed to add product.",
                        type: "error",
                        duration: 3000,
                    }
                });

                return;
            }

            // Tạo form data mới không chứa ảnh
            const newFormData: Product = {
                ...formData,
                header_image: ""
            };

            // Gửi dữ liệu form lên server
            const response = await axios.post('/api/product/add', newFormData);

            // Tạo form data để upload ảnh
            const formDataImage = new FormData();
            formDataImage.append('id', response.data.id as string);
            formDataImage.append('headerImage', formData.header_image);

            // Upload ảnh lên server
            const headerImage = await axios.post('/api/product/uploadImage',
                formDataImage,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Nếu thành công thì hiển thị thông báo
            if (headerImage.status === 200) {
                const appId = response.data.id;

                notificationDispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: `product-add-${uuidv4()}`,
                        message: `Product ${appId} added successfully!`,
                        type: "success",
                        duration: 3000,
                    }
                });
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                notificationDispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: `product-add-${uuidv4()}`,
                        message: "Failed to add product.",
                        type: "error",
                        duration: 3000,
                    }
                });

                setErrors(error.response.data.errors);
            }
        }
    };

    // Hàm xử lý thay đổi giá trị của MultiSelect
    const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
        // Lấy giá trị mới từ sự kiện
        const { name, value } = e.target;

        // Cập nhật giá trị mới vào form data
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm xóa giá trị khỏi danh sách đã chọn
    const handleDeleteValueSelect = (valueToDelete: string) => {
        // Ensure all platform properties are defined and update the selected one to false
        const currentPlatform = formData.platform || { windows: false, mac: false, linux: false };
        const newValue = {
            windows: valueToDelete === "windows" ? false : currentPlatform.windows,
            mac: valueToDelete === "mac" ? false : currentPlatform.mac,
            linux: valueToDelete === "linux" ? false : currentPlatform.linux
        };

        // Cập nhật giá trị mới vào form data
        setFormData({
            ...formData,
            platform: newValue
        });
    };

    // Hàm xử lý thay đổi giá trị của DateTimePicker
    const handleDateTimeChange = (name: string, value: Dayjs | null) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm xử lý thay đổi giá trị của video
    const handleChangeDynamicInput = (name: string, values: ProductMovie[]) => {
        setFormData({
            ...formData,
            [name]: values
        });
    };

    // Hàm xử lý lỗi
    const handleSetError = (name: string, value: string) => {
        const newErrors = errors.map((error) => {
            if (error.path === name) {
                return {
                    ...error,
                    path: null,
                    msg: value
                };
            }

            return error;
        });

        setErrors(newErrors);
    };

    // Hàm scan data
    const handleScanData = async (inputValue: string) => {
        try {
            // Hiển thị loading
            setLoading(true);

            // Gửi request lên server để crawl dữ liệu
            const response = await axios.get<Product>(`/api/crawl?id=${inputValue}`);

            // Kiểm tra response
            if (response.status === 200) {
                //Xoá dữ liệu cũ
                setFormData(initialFormData);

                // Lấy dữ liệu từ response
                const result = response.data;

                // Cập nhật dữ liệu vào form data
                setFormData((prev) => ({
                    ...prev,
                    name: result.name ? result.name : "",
                    type: result.type ? result.type : "",
                    description: result.short_description ? result.short_description : "",
                    // "$39.99 USD" => 39.99
                    price: result.price_overview.initial ? Number(result.price_overview.initial.toString().replace(/[^0-9.]/g, "")) : 0,
                    // "-10%" => 10
                    discount: result.price_overview.discount_percent ? Number(result.price_overview.discount_percent.toString().replace(/[-%]/g, "")) : 0,
                    releaseDate: dayjs(result.release_date.date),
                    developer: result.developers,
                    publisher: result.publishers,
                    genres: result.genres,
                    tags: result.tags,
                    headerImage: result.header_image,
                    screenshots: result.screenshots,
                    videos: result.movies,
                    systemRequirements: result.pc_requirements
                }));

                // Hiển thị thông báo thành công
                setButtonDialogState((prevState) => ({
                    ...prevState,
                    success: "Scan data successfully!",
                }));

                return result;
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Hiển thị thông báo lỗi
                setButtonDialogState((prevState) => ({
                    ...prevState,
                    error: error.response?.data.message
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm thêm danh sách App ID
    const handleAddList = async (inputValue: string) => {
        try {
            // Hiển thị loading
            setLoading(true);

            // Loại bỏ dấu phẩy và khoảng trắng ở cuối
            inputValue = inputValue.replace(/,\s*$/, "").trim();

            // Gửi request lên server để crawl dữ liệu
            const response = await axios.post('/api/fetch/ids', {
                ids: inputValue
            });

            if (response.status === 200) {
                // Lấy dữ liệu từ response
                const result = response.data;

                // Lấy id của json
                const jsonId = result.jsonId;
                // Lấy danh sách App ID lỗi
                const errorIds = result.errorIds;

                // Hiển thị loading
                setButtonDialogState((prevState) => ({
                    ...prevState,
                    loading: "Adding list",
                }));

                // Gọi API thêm danh sách App ID vào database
                const responseAddList = await axios.post('/api/product/addFromFile', {
                    jsonId: jsonId,
                    errorIds: errorIds,
                });

                // Kiểm tra response
                if (responseAddList.status === 200) {
                    const resultAddList = responseAddList.data;

                    // Hiển thị thông báo thành công
                    setButtonDialogState((prevState) => ({
                        ...prevState,
                        success: resultAddList.message,
                        successLinks: {
                            title: {
                                text: "Error IDs: ",
                                color: "#ff4545"
                            },
                            links: resultAddList.errorIds.map((id: string) => ({
                                href: `https://steamdb.info/app/${id}`,
                                text: id,
                                color: "#ff4545"
                            }))
                        }
                    }));
                }

                return result;
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Hiển thị thông báo lỗi
                setButtonDialogState((prevState) => ({
                    ...prevState,
                    error: error.response?.data.message
                }));
            }
        } finally {
            setLoading(false);
            // Xoá loading
            setButtonDialogState((prevState) => ({
                ...prevState,
                loading: "",
            }));
        }
    };

    return (
        <div className="">
            {/* Page Header */}
            <div className="page-header">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="breadcrumb-nav">
                    <ol className="breadcrumb-list">
                        <li className="breadcrumb-item">
                            <a href="/admin/e-commerce/product">
                                Products
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Add Product
                        </li>
                    </ol>
                </nav>

                <div className="page-header-content">
                    {/* Header */}
                    <h1>Add Product</h1>

                    {/* Action */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem"
                        }}

                    >
                        <ButtonWithDialog
                            buttonText="Scan data"
                            title="Scan data"
                            label="Enter App ID"
                            type="text"
                            onSubmit={handleScanData}
                            success={buttonDialogState.success}
                            successLinks={buttonDialogState.successLinks}
                            setSuccess={(success) =>
                                setButtonDialogState((prevState) => ({ ...prevState, success }))
                            }
                            error={buttonDialogState.error}
                            setError={(error) =>
                                setButtonDialogState((prevState) => ({ ...prevState, error }))
                            }
                            loading={buttonDialogState.loading}
                            setLoading={(loading) =>
                                setButtonDialogState((prevState) => ({ ...prevState, loading }))
                            }
                        />

                        <ButtonWithDialog
                            buttonText="Add list"
                            title="Add list"
                            label="Enter list App ID (separate by comma)"
                            type="text"
                            multiple={true}
                            onSubmit={handleAddList}
                            success={buttonDialogState.success}
                            successLinks={buttonDialogState.successLinks}
                            setSuccess={(success) =>
                                setButtonDialogState((prevState) => ({ ...prevState, success }))
                            }
                            error={buttonDialogState.error}
                            setError={(error) =>
                                setButtonDialogState((prevState) => ({ ...prevState, error }))
                            }
                            loading={buttonDialogState.loading}
                            setLoading={(loading) =>
                                setButtonDialogState((prevState) => ({ ...prevState, loading }))
                            }
                        />
                    </Box>
                </div>
            </div>

            {/* Add Product Form */}
            <form className="form">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* Title */}
                    <InputForm
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Title"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.some((error) => error.path === 'title')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'title')?.msg}
                    />

                    {/* Type */}
                    <SelectForm
                        id="type"
                        name="type"
                        label="Type"
                        placeholder="Select Type"
                        value={formData.type}
                        menuItems={TypeData}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData({ ...formData, [name]: value });
                        }}
                        error={errors.some((error) => error.path === 'type')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'type')?.msg}
                    />

                    {/* Description */}
                    <InputForm
                        id="description"
                        name="description"
                        label="Description"
                        labelOptional="(Optional)"
                        type="text"
                        placeholder="Description"
                        value={formData.short_description}
                        onChange={handleChange}
                        error={errors.some((error) => error.path === 'description')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'description')?.msg}
                    />

                    {/* Price and Discount */}
                    <Grid2
                        container
                        spacing={2}
                        width={"100%"}
                        margin={{
                            xs: "16px 0 8px",
                            sm: "16px 0 8px"
                        }}
                    >
                        {/* Price */}
                        <Grid2
                            size={{
                                xs: 6,
                                sm: 6
                            }}
                        >
                            <InputForm
                                id="price"
                                name="price"
                                label="Price"
                                type="number"
                                placeholder="Price"
                                value={formData.price_overview.initial}
                                sx={{
                                    margin: "0"
                                }}
                                onChange={handleChange}
                                error={errors.some((error) => error.path === 'price')}
                                setError={handleSetError}
                                errorText={errors.find((error) => error.path === 'price')?.msg}
                            />
                        </Grid2>

                        {/* Discount */}
                        <Grid2
                            size={{
                                xs: 6,
                                sm: 6
                            }}
                        >
                            <InputForm
                                id="discount"
                                name="discount"
                                label="Discount"
                                type="number"
                                placeholder="Discount"
                                value={formData.price_overview.discount_percent}
                                onChange={handleChange}
                                sx={{
                                    margin: "0"
                                }}
                                htmlInput={{
                                    min: 0,
                                    max: 100
                                }}
                                error={errors.some((error) => error.path === 'discount')}
                                setError={handleSetError}
                                errorText={errors.find((error) => error.path === 'discount')?.msg}
                            />
                        </Grid2>
                    </Grid2>

                    {/* Release Date */}
                    <DateTimePickerForm
                        name="releaseDate"
                        label="Release Date"
                        value={formData.release_date.date}
                        onChange={handleDateTimeChange}
                        error={errors.some((error) => error.path === 'releaseDate')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'releaseDate')?.msg}
                    />

                    {/* Developer and Publisher */}
                    <Grid2
                        container
                        spacing={2}
                        width={"100%"}
                        margin={{
                            xs: "16px 0 8px",
                            sm: "16px 0 8px"
                        }}
                    >
                        <Grid2
                            size={{
                                xs: 6,
                                sm: 6
                            }}
                        >
                            {/* Developer */}
                            <InputForm
                                id="developer"
                                name="developer"
                                label="Developer"
                                type="text"
                                placeholder="Developer"
                                value={formData.developers}
                                onChange={handleChange}
                                sx={{
                                    margin: "0",
                                }}
                                error={errors.some((error) => error.path === 'developer')}
                                setError={handleSetError}
                                errorText={errors.find((error) => error.path === 'developer')?.msg}
                            />
                        </Grid2>

                        <Grid2
                            size={{
                                xs: 6,
                                sm: 6
                            }}
                        >
                            {/* Publisher */}
                            <InputForm
                                id="publisher"
                                name="publisher"
                                label="Publisher"
                                type="text"
                                placeholder="Publisher"
                                value={formData.publishers}
                                onChange={handleChange}
                                sx={{
                                    margin: "0",
                                }}
                                error={errors.some((error) => error.path === 'publisher')}
                                setError={handleSetError}
                                errorText={errors.find((error) => error.path === 'publisher')?.msg}
                            />
                        </Grid2>
                    </Grid2>

                    {/* Genres */}
                    <MultipleSelectForm
                        id="genres"
                        name="genres"
                        label="Genres"
                        placeholder="Select Genres"
                        value={formData.genres.map((genre) => genre.description)}
                        menuItems={GenreData}
                        onChange={handleSelectChange}
                        onDelete={handleDeleteValueSelect}
                        error={errors.some((error) => error.path === 'genres')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'genres')?.msg}
                    />

                    {/* Tags */}
                    <MultipleSelectForm
                        id="tags"
                        name="tags"
                        label="Tags"
                        placeholder="Select Tags"
                        value={formData.tags}
                        menuItems={GenreData}
                        onChange={handleSelectChange}
                        onDelete={handleDeleteValueSelect}
                        error={errors.some((error) => error.path === 'tags')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'tags')?.msg}
                    />

                    {/* Features */}
                    <MultipleSelectForm
                        id="features"
                        name="features"
                        label="Features"
                        placeholder="Select Features"
                        value={formData.categories?.map((category) => category.description)}
                        menuItems={GenreData}
                        onChange={handleSelectChange}
                        onDelete={handleDeleteValueSelect}
                        error={errors.some((error) => error.path === 'features')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'features')?.msg}
                    />

                    {/* Header Image */}
                    <UploadImages
                        id="header-image"
                        name="headerImage"
                        value={formData.header_image}
                        title={formData.name}
                        label="Header Image"
                        onChange={(url) => setFormData({
                            ...formData,
                            header_image: url?.name || ""
                        })}
                    />

                    {/* Images */}
                    <FileUploader
                        id="images"
                        name="images"
                        values={formData.screenshots.map((screenshot) => screenshot.path_full)}
                        label="Images"
                        acceptFile="image/*"
                        type="img"
                    />

                    {/* Videos */}
                    <DynamicInputVideo
                        name="videos"
                        label="Videos"
                        values={formData.movies.map((video) => video)}
                        onChange={handleChangeDynamicInput}
                    />

                    {/* Submit */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            marginTop: "1rem"
                        }}
                    >
                        Submit
                    </Button>

                </LocalizationProvider>
            </form>
        </div >
    );
}

export default ECommerceAddProductPage;
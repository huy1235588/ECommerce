'use client'

import { GenreData, PlatformData, Product, ProductVideos, TypeData } from "@/types/product";
import { Box, Button, Checkbox, FormControlLabel, Grid2, SelectChangeEvent } from "@mui/material";
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
import DynamicInputRequirements from "@/components/admin/dynamicInputRequirements";
import { useNotification } from "@/context/NotificationContext";
import { v4 as uuidv4 } from "uuid";

type ErrorForm = {
    path: string | null;
    msg: string;
};

// Khởi tạo formData ban đầu
const initialFormData: Product = {
    title: '',
    type: '',
    description: '',
    price: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    releaseDate: null,
    developer: [],
    publisher: [],
    platform: [],
    rating: 0,
    isActive: false,
    genres: [],
    tags: [],
    features: [],
    headerImage: null,
    screenshots: [],
    videos: [{
        thumbnail: '',
        mp4: '',
        webm: ''
    }],
    systemRequirements: {
        win: [
            { title: "OS", minimum: "", recommended: "" },
            { title: "Processor", minimum: "", recommended: "" },
            { title: "Memory", minimum: "", recommended: "" },
            { title: "Graphics", minimum: "", recommended: "" },
            { title: "DirectX", minimum: "", recommended: "" },
            { title: "Storage", minimum: "", recommended: "" },
            { title: "Sound Card", minimum: "", recommended: "" },
            { title: "Additional Notes", minimum: "", recommended: "" },
        ],
    },
};

function ECommerceAddProductPage() {
    const { notificationDispatch } = useNotification(); // Sử dụng context Notification
    const [errors, setErrors] = useState<ErrorForm[]>([]);
    const { setLoading } = useLoading();
    const [errorButtonDialog, setErrorButtonDialog] = useState<string>("");
    const [successButtonDialog, setSuccessButtonDialog] = useState<string>("");

    // Form data state
    const [formData, setFormData] = useState<Product>(initialFormData);

    // Xử lý thay đổi dữ liệu form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Xử lý thay đổi checkbox
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
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
                headerImage: ""
            };

            // Gửi dữ liệu form lên server
            const response = await axios.post('/api/product/add', newFormData);

            // Tạo form data để upload ảnh
            const formDataImage = new FormData();
            formDataImage.append('id', response.data.id as string);
            formDataImage.append('headerImage', formData.headerImage as File);

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
        // Lọc ra các giá trị khác giá trị cần xóa
        const newValue = formData.platform.filter((value) => value !== valueToDelete);

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
    const handleChangeDynamicInput = (name: string, values: ProductVideos[]) => {
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
                    title: result.title ? result.title : "",
                    type: result.type ? result.type : "",
                    description: result.description ? result.description : "",
                    price: result.price ? Number(result.price.toString().replace("$", "")) : 0,
                    discount: result.discount ? Number(result.discount.toString().replace(/[-%]/g, "")) : 0,
                    discountEndDate: result.discountEndDate ? dayjs(result.discountEndDate) : null,
                    releaseDate: dayjs(result.releaseDate),
                    developer: result.developer,
                    publisher: result.publisher,
                    platform: result.platform ? result.platform : [],
                    genres: result.genres,
                    tags: result.tags,
                    features: result.features,
                    headerImage: result.headerImage,
                    screenshots: result.screenshots,
                    videos: result.videos,
                    systemRequirements: result.systemRequirements
                }));

                // Hiển thị thông báo thành công
                setSuccessButtonDialog("Scan data successfully!");
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Hiển thị thông báo lỗi
                setErrorButtonDialog(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm 
    const handleAddList = async (inputValue: string) => {
        try {
            // Hiển thị loading
            setLoading(true);

            // Tách chuỗi thành mảng
            const listAppId = inputValue.split(",");

            const titleList = [];

            // Duyệt qua từng phần tử trong mảng
            for (let i = 0; i < listAppId.length; i++) {
                // Gọi hàm scan data
                await handleScanData(listAppId[i]);

                // Nếu title null thì bỏ qua
                if (!formData.title) {
                    setErrorButtonDialog(`App ID ${listAppId[i]} not found!`);
                    continue;
                }

                // Tạo filter
                const filter = {
                    title: formData.title
                };

                // Kiểm tra tile có tồn tại
                const response = await axios.post('/graphql', {
                    query: `query FilterProducts (
                        $title: String!
                    ) {
                        filterProducts(title: $title) {
                            _id
                            title
                        }
                    }`,
                    variables: filter
                });

                if (response.status === 200) {
                    // Lấy dữ liệu từ response
                    const result = await response.data.data.filterProducts;

                    // Nếu title không tồn tại thì nhấn submit form
                    if (result.length === 0) {
                        setTimeout(() => {
                            handleSubmit();
                        }, 0);
                    }

                    // Nếu title tồn tại thì hiển thị thông báo

                    // TODO: Ý tưởng cho phần else:
                    // 1. Thêm title vào mảng titleList để hiển thị các title đã tồn tại
                    // 2. Reset form data để chuẩn bị cho lần scan tiếp theo
                    // 3. Hiển thị thông báo noti hoặc dialog với danh sách title đã tồn tại
                    // 4. Có thể thêm option để skip hoặc override các title đã tồn tại

                    // else {
                    //     const title = result[0].title;
                    //     titleList.push(`${listAppId[i]}: ${title} already exists!`);
                    // }
                }

                // // Khi xong một vòng lặp thì reset form data, errors và success
                // setFormData(initialFormData);
                // setErrors([]);
                // setErrorButtonDialog("");
                // setSuccessButtonDialog("");
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                // Hiển thị thông báo lỗi
                setErrorButtonDialog(error.response.data.message);
            }
        } finally {
            setLoading(false);
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
                            success={successButtonDialog}
                            setSuccess={setSuccessButtonDialog}
                            error={errorButtonDialog}
                            setError={setErrorButtonDialog}
                        />

                        <ButtonWithDialog
                            buttonText="Add list"
                            title="Add list"
                            label="Enter list App ID (separate by comma)"
                            type="text"
                            multiple={true}
                            onSubmit={handleAddList}
                            success={successButtonDialog}
                            setSuccess={setSuccessButtonDialog}
                            error={errorButtonDialog}
                            setError={setErrorButtonDialog}
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
                        value={formData.title}
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
                        value={formData.description}
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
                                value={formData.price}
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
                                value={formData.discount}
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

                    {/* Discount Date */}
                    {/* Nếu Discount lớn hơn 0 thì hiển thị ngày giảm giá */}
                    {formData.discount && formData.discount > 0 ? (
                        <DateTimePickerForm
                            name="discountEndDate"
                            label="Discount End Date"
                            value={formData.discountEndDate}
                            onChange={handleDateTimeChange}
                            error={errors.some((error) => error.path === 'discountEndDate')}
                            setError={handleSetError}
                            errorText={errors.find((error) => error.path === 'discountEndDate')?.msg}
                        />
                    ) : null}

                    {/* Release Date */}
                    <DateTimePickerForm
                        name="releaseDate"
                        label="Release Date"
                        value={formData.releaseDate}
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
                                value={formData.developer}
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
                                value={formData.publisher}
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

                    {/* Platform */}
                    <MultipleSelectForm
                        id="platform"
                        name="platform"
                        label="Platform"
                        placeholder="Select Platform"
                        value={formData.platform} // Truyền giá trị đã chọn vào
                        menuItems={PlatformData} // Các mục menu để chọn
                        onChange={handleSelectChange} // Hàm xử lý thay đổi giá trị
                        onDelete={handleDeleteValueSelect} // Hàm xử lý xóa giá trị
                        error={errors.some((error) => error.path === 'platform')}
                        setError={handleSetError}
                        errorText={errors.find((error) => error.path === 'platform')?.msg}
                    />

                    {/* Genres */}
                    <MultipleSelectForm
                        id="genres"
                        name="genres"
                        label="Genres"
                        placeholder="Select Genres"
                        value={formData.genres}
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
                        value={formData.features}
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
                        value={formData.headerImage}
                        title={formData.title}
                        label="Header Image"
                        onChange={(url) => setFormData({
                            ...formData,
                            headerImage: url
                        })}
                    />

                    {/* Images */}
                    <FileUploader
                        id="images"
                        name="images"
                        values={formData.screenshots}
                        label="Images"
                        acceptFile="image/*"
                        type="img"
                    />

                    {/* Videos */}
                    <DynamicInputVideo
                        name="videos"
                        label="Videos"
                        values={formData.videos}
                        onChange={handleChangeDynamicInput}
                    />

                    {/* System Requirements */}
                    <DynamicInputRequirements
                        name="systemRequirements"
                        label="System Requirements"
                        values={formData.systemRequirements}
                        onChange={(name, value) => {
                            setFormData({
                                ...formData,
                                [name]: value
                            });
                        }}
                    />

                    {/* Active */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Active"
                        sx={{
                            width: "100%",
                            marginLeft: 0.125
                        }}
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
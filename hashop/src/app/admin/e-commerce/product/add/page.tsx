'use client'

import { GenreData, PlatformData, Product } from "@/types/product";
import { Button, Checkbox, FormControlLabel, Grid2, SelectChangeEvent } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {  useState } from "react";
import "@/styles/pages/admin/product.css"
import InputForm from "@/components/ui/inputForm";
import MultipleSelectForm from "@/components/ui/multipleSelectForm";
import DateTimePickerForm from "@/components/ui/dateTimePickerForm";
import axios from "@/config/axios";
import axiosLib from "axios";
import { Dayjs } from "dayjs";
import validateProduct from "@/utils/validate";
import UploadImages from "@/components/ui/uploadImages";
import FileUploader from "@/components/ui/fileUploader";
import DynamicInput from "@/components/ui/dynamicInput";

type ErrorForm = {
    path: string | null;
    msg: string;
};

function ECommerceAddProductPage() {
    const [errors, setErrors] = useState<ErrorForm[]>([]);

    // Form data state
    const [formData, setFormData] = useState<Product>({
        title: '',
        type: '',
        description: '',
        price: 0,
        discount: 0,
        discountStartDate: null,
        discountEndDate: null,
        releaseDate: null,
        developer: '',
        publisher: '',
        platform: [],
        rating: 0,
        isActive: false,
        genres: [],
        tags: [],
        features: [],
        headerImage: '',
        images: [],
        videos: []
    });

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
                return;
            }

            const response = await axios.post('/api/product/add', formData);

            if (response.status === 200) {
                const result = await response.data;

                console.log(result);
                alert('Product added successfully!');
            }

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                alert('Failed to add product.');

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

    // Hàm xử lý thay đổi giá trị của DynamicInput
    const handleChangeDynamicInput = (name: string, values: string[]) => {
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
                    <InputForm
                        id="type"
                        name="type"
                        label="Type"
                        type="text"
                        placeholder="Type"
                        value={formData.type}
                        onChange={handleChange}
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
                        <Grid2
                            container
                            spacing={2}
                            width={"100%"}
                            margin={{
                                xs: "16px 0 8px",
                                sm: "16px 0 8px"
                            }}
                        >
                            {/* Discount Start Date */}
                            <Grid2
                                size={{
                                    xs: 6,
                                    sm: 6
                                }}
                            >
                                <DateTimePickerForm
                                    label="Discount Start Date"
                                    name="discountStartDate"
                                    value={formData.discountStartDate}
                                    onChange={handleDateTimeChange}
                                    sx={{
                                        margin: "0",
                                    }}
                                    error={errors.some((error) => error.path === 'discountStartDate')}
                                    setError={handleSetError}
                                    errorText={errors.find((error) => error.path === 'discountStartDate')?.msg}
                                />
                            </Grid2>

                            {/* Discount End Date */}
                            <Grid2
                                size={{
                                    xs: 6,
                                    sm: 6
                                }}
                            >
                                <DateTimePickerForm
                                    name="discountEndDate"
                                    label="Discount End Date"
                                    value={formData.discountEndDate}
                                    onChange={handleDateTimeChange}
                                    sx={{
                                        margin: "0",
                                    }}
                                    error={errors.some((error) => error.path === 'discountEndDate')}
                                    setError={handleSetError}
                                    errorText={errors.find((error) => error.path === 'discountEndDate')?.msg}
                                />
                            </Grid2>
                        </Grid2>
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
                        label="Header Image"
                        onChange={(url) => setFormData({ ...formData, headerImage: url })}
                    />

                    {/* Images */}
                    <FileUploader
                        id="images"
                        name="images"
                        label="Images"
                        acceptFile="image/*"
                        type="img"
                    />

                    {/* Videos */}
                    <DynamicInput
                        name="videos"
                        label="Videos"
                        placeholder="Video URL"
                        onChange={handleChangeDynamicInput}
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
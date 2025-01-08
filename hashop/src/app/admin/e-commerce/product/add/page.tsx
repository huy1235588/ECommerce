'use client'

import { GenreData, PlatformData, Product } from "@/types/product";
import { Button, Checkbox, FormControlLabel, Grid2, SelectChangeEvent } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from "react";
import "@/styles/pages/admin/product.css"
import InputForm from "@/components/ui/inputForm";
import MultipleSelectForm from "@/components/ui/multipleSelectForm";
import DateTimePickerForm from "@/components/ui/dateTimePickerForm";

function ECommerceAddProductPage() {
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
        headerImage: '',
        genres: [],
        tags: [],
        features: [],
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
            const response = await fetch('/api/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
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

    return (
        <div className="">
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
                            />
                        </Grid2>
                    </Grid2>

                    {/* Discount Date */}
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
                                value={formData.discountStartDate}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, discountStartDate: newValue })
                                }
                                sx={{
                                    margin: "0",
                                }}
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
                                label="Discount End Date"
                                value={formData.discountEndDate}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, discountEndDate: newValue })
                                }
                                sx={{
                                    margin: "0",
                                }}
                            />
                        </Grid2>
                    </Grid2>

                    {/* Release Date */}
                    <DateTimePickerForm
                        label="Release Date"
                        value={formData.releaseDate}
                        onChange={(newValue) =>
                            setFormData({ ...formData, releaseDate: newValue })
                        }
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

                    {/* Header Image */}


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
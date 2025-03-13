'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputBase, Button, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { BiCart, BiSolidXCircle } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { paginatedProducts } from '@/store/product';
import { unwrapResult } from '@reduxjs/toolkit';
import { convertCurrency } from '@/utils/currencyConverter';

const StyledInput = styled(InputBase)({
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: '0 8px',
    width: '150px',
});

const NavigationBar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [valueSearch, setValueSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const inputRefSearch = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hàm fetch dữ liệu sản phẩm từ API
    const fetchProducts = useCallback(async (search: string): Promise<Product[] | null> => {
        // Nếu giá trị search rỗng thì không làm gì cả
        if (search === "") {
            return null;
        }

        // Fetch data từ API
        // Hàm lấy danh sách sản phẩm
        const getProducts = async () => {
            try {
                // Các trường cần lấy
                const field = `
                    _id
                    name
                    price_overview {
                        final
                        currency
                    }
                    header_image
                `;

                const query = {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                };

                // Lấy danh sách sản phẩm
                const resultAction = await dispatch(paginatedProducts({
                    page: 1,
                    limit: 5,
                    fields: field,
                    query: JSON.stringify(query),
                }));

                // Lấy danh sách sản phẩm thành công
                if (resultAction.meta.requestStatus === "fulfilled") {
                    const fetchedProducts = unwrapResult(resultAction).data.paginatedProducts.products;

                    // Chuyển đổi giá tiền cuối cùng sang USD
                    const convertedProducts = fetchedProducts.map((product: Product) => {
                        if (!product.price_overview?.currency) return product;

                        // Tạo bản sao của product và cập nhật price_overview
                        return {
                            ...product,
                            price_overview: {
                                ...product.price_overview,
                                final: convertCurrency(
                                    product.price_overview.final / 100,
                                    product.price_overview.currency,
                                    'USD'
                                )
                            }
                        };
                    });

                    return convertedProducts;
                }

                return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        }
        // Lấy danh sách sản phẩm
        return await getProducts();
    }, [dispatch]);

    // Hàm useEffect để fetch dữ liệu sản phẩm khi search
    useEffect(() => {
        // Nếu giá trị search rỗng thì không làm gì cả
        if (valueSearch === "") {
            setSearchResults([]);
            return;
        }

        // Hàm useEffect để fetch dữ liệu sản phẩm khi search
        const handler = setTimeout(async () => {
            const products = await fetchProducts(valueSearch);
            setSearchResults(products || []);
            setIsDropdownOpen(true);

        }, 300);

        return () => clearTimeout(handler);

    }, [valueSearch, fetchProducts]);

    // Ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                inputRefSearch.current
                && !inputRefSearch.current.contains(e.target as Node)
                && !dropdownRef.current
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [inputRefSearch]);

    const handleFocus = () => {
        // If there is a search value and results, simply display them
        if (valueSearch && searchResults.length > 0) {
            setIsDropdownOpen(true);
            return;
        }
    }

    // Hàm khi nhập giá trị Search
    const handleChangeSearch = (value: string) => {
        setValueSearch(value);
    };

    return (
        <div className='navbar-container'>
            <div className='navbar-content'>
                {/* Wishlist and Cart */}
                <div className='nav-control'>
                    <Button className='button-wishlist'>
                        Wishlist (103)
                    </Button>
                    <Button className='button-cart' >
                        <BiCart size={20} />
                        Cart (1)
                    </Button>
                </div>

                <nav className='nav-area'>
                    {/* Navigation Links */}
                    <Box className='nav-menu'>
                        <Button className='menu-item' color="inherit">Your Store</Button>
                        <Button className='menu-item' color="inherit">New & Noteworthy</Button>
                        <Button className='menu-item' color="inherit">Categories</Button>
                        <Button className='menu-item' color="inherit">Points Shop</Button>
                        <Button className='menu-item' color="inherit">News</Button>
                        <Button className='menu-item' color="inherit">Labs</Button>
                    </Box>


                    {/* Search Bar */}
                    <div className='search-container'>
                        <StyledInput
                            className='search'
                            placeholder="Search"
                            inputRef={inputRefSearch}
                            value={valueSearch}
                            onChange={(e) => handleChangeSearch(e.target.value)}
                            onFocus={handleFocus}
                        />

                        {/* Clear input */}
                        {valueSearch !== "" && (
                            <IconButton
                                className="button-clear"
                                size="small"
                                onClick={() => {
                                    setValueSearch("");
                                    inputRefSearch.current?.focus();
                                }}
                            >
                                <BiSolidXCircle size={15} />
                            </IconButton>
                        )}

                        {/* Button Search */}
                        <IconButton className='search-icon'>
                            <FaSearch size={15} />
                        </IconButton>

                        {/* Dropdown for Search Results */}
                        {isDropdownOpen && searchResults.length > 0 && (
                            <Box className='search-results'
                                ref={dropdownRef}
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    width: '50%',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#3d4450',
                                    zIndex: 10,
                                }}
                            >
                                {searchResults.map(product => (
                                    <Box className='search-result-item'
                                        key={product._id}
                                    >
                                        <a href={`/app/${product._id}`}
                                            className='search-result-link'
                                        >
                                            <Image className='search-result-image'
                                                src={product.header_image || ''}
                                                alt={product.name}
                                                width={231}
                                                height={87}
                                            />

                                            <Box className='search-result-info'>
                                                <span className='search-result-title'>
                                                    {product.name}
                                                </span>
                                                <span className='search-result-price'>
                                                    {product.price_overview.final != null
                                                        ? `$${product.price_overview.final.toFixed(2)}`
                                                        : 'Free'
                                                    }
                                                </span>
                                            </Box>
                                        </a>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavigationBar;

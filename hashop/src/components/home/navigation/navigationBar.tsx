import React, { useRef, useState } from 'react';
import { InputBase, Button, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { BiCart, BiSolidXCircle } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';

const StyledInput = styled(InputBase)({
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: '0 8px',
    width: '150px',
});

const NavigationBar: React.FC = () => {
    const inputRefSearch = useRef<HTMLInputElement>(null);
    const [valueSearch, setValueSearch] = useState("");

    // Hàm khi nhập giá trị Search
    const handleChangeSearch = (value: string) => {
        // // Kiểm tra nếu giá trị nhập vào không phải là số thì không làm gì
        // if (!/^\d*$/.test(value)) {
        //     return;
        // }

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
                                <BiSolidXCircle size={15}/>
                            </IconButton>
                        )}

                        {/* Button Search */}
                        <IconButton className='search-icon'>
                            <FaSearch size={15} />
                        </IconButton>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavigationBar;

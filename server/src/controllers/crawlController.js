const puppeteer = require('puppeteer');
const fs = require('fs');
const { readDataFromJson, addDataToJson } = require('../utils/interactJson');

// Craw dữ liệu từ URL
const crawlByURL = async (req, res) => {
    try {
        const id = req.query.id;

        // Kiểm tra xem id có tồn tại và là số không
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        // Kiểm tra id có trong tệp JSON không thì trả về dữ liệu từ tệp
        if (fs.existsSync('data.json')) {
            const fileContent = fs.readFileSync('data.json', 'utf8');
            const data = JSON.parse(fileContent);

            const item = data.find(item => item.appId === parseInt(id));
            if (item) {
                return res.json(item);
            }
        }

        const url = `https://store.steampowered.com/app/${id}?cc=en`;

        console.log('Đang crawl dữ liệu từ:', url);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (x11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.67778.204 Safari/537.36');
        await page.goto(url);

        // Xử lý nếu có cổng yêu cầu xác nhận tuổi
        const isAgeGate = await page.$('#ageYear');

        if (isAgeGate) {
            console.log('Xác định cổng xác nhận tuổi.');

            // Chọn năm sinh trong thẻ select có id 'ageYear'
            // Chọn ngẫu nhiên một năm từ 1980 đến 2003
            const ageYear = Math.floor(Math.random() * (2003 - 1980 + 1)) + 1980;
            await page.select('#ageYear', ageYear.toString());

            // Nhấn nút xác nhận trong thẻ a có id 'view_product_page_btn'
            await page.click('#view_product_page_btn');

            // Chờ thêm thời gian để đảm bảo thao tác hoàn tất
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Lấy URL sau khi chuyển hướng
            let currentUrl = await page.url();
            console.log('URL sau khi chuyển hướng: ' + currentUrl);

            // Thêm tham số ?cc=en vào URL nếu chưa có
            if (!currentUrl.includes('?')) {
                currentUrl += '?cc=en';
            } else {
                currentUrl += '&cc=en';
            }

            // Điều hướng đến URL mới với tham số cc=en
            await page.goto(currentUrl);
            console.log('URL mới sau khi thêm cc=en: ' + currentUrl);
        }

        // Hàm lấy text từ selector
        const data = await page.evaluate((id) => {
            // Hàm làm sạch văn bản (loại bỏ khoảng trắng, dấu xuống dòng, tab)
            const cleanText = (text) => {
                return text
                    ? text.trim().replace(/\n/g, '').replace(/\t/g, '')
                    : null;
            };

            // Hàm lấy text từ selector
            const getText = (selector) => {
                const element = document.querySelector(selector);
                return element
                    ? cleanText(element.innerText)
                    : null;
            };

            // Hàm lấy text từ element
            const getElementText = (element) => {
                return element
                    ? cleanText(element.innerText)
                    : null;
            }

            // Hàm lấy danh sách từ selector
            const getListText = (selector, childSelector) => {
                const container = document.querySelector(selector);
                if (!container) return [];

                return Array.from(container.querySelectorAll(childSelector))
                    .map(link =>
                        cleanText(link.innerText)
                    );
            };

            // Hàm lấy src từ selector
            const getSrc = (selector) => {
                const element = document.querySelector(selector);
                return element
                    ? element.src
                    : null;
            };

            // Hàm lấy danh sách src từ selector
            const getListSrc = (
                selector,
                childSelector,
                Attribute
            ) => {
                const container = document.querySelector(selector);
                if (!container) return [];

                return Array.from(container.querySelectorAll(childSelector))
                    .map(link => {
                        if (Attribute === "src") {
                            return link.src;
                        }
                        else if (Attribute === "href") {
                            return link.href;
                        }
                    });
            };

            // Hàm lấy video từ selector
            const getVideo = (
                videoSelector,
                videoChildSelector,
            ) => {
                const videoContainer = document.querySelector(videoSelector);
                if (!videoContainer) return [];

                return Array.from(videoContainer.querySelectorAll(videoChildSelector))
                    .map(video => {
                        const { dataset } = video;

                        console.log(dataset);

                        return {
                            thumbnail: dataset.poster || null,
                            mp4: dataset.mp4Source || null,
                            webm: dataset.webmSource || null,
                        };
                    })
            };

            // Hàm chuyển thành số từ chuỗi
            const getNumber = (price) => {
                return Number(price.toString().replace(/[^0-9.]/g, ""));
            }

            // Xác định giá và giảm giá
            let price = 0, discount = 0, discountStartDate, discountEndDate;

            // Kiểm tra miễn phí
            const isFree = document.querySelector('#freeGameBtn');
            if (!isFree) {
                // Lấy container chính của thông tin mua game
                const purchaseWrappers = document.querySelector("#game_area_purchase div[data-price-final]");

                // Kiểm tra purchaseWrappers có tồn tại không
                if (purchaseWrappers) {
                    // Kiểm tra purchaseWrappers có class game_purchase_price price
                    const hasPrice = purchaseWrappers.classList.contains("game_purchase_price", "price");

                    // Kiểm tra có class discount_block 
                    const hasDiscount = purchaseWrappers.classList.contains("discount_block");

                    // Nếu có thuộc tính data-price-final thì lấy giá từ đó
                    if (hasDiscount) {
                        // Kiểm tra có class no_discount
                        const hasNoDiscount = purchaseWrappers.classList.contains("no_discount");

                        // Nếu có class no_discount thì giảm giá là 0
                        if (hasNoDiscount) {
                            price = getElementText(purchaseWrappers.querySelector("div.discount_prices > div.discount_final_price"));
                        }

                        // Nếu không có class no_discount thì lấy giảm giá
                        else {
                            price = getElementText(purchaseWrappers.querySelector("div.discount_prices > div.discount_original_price"));
                            discount = getElementText(purchaseWrappers.querySelector("div.discount_pct"));
                            discountStartDate = Date.now();
                            discountEndDate = `${getElementText(document.querySelector("p.game_purchase_discount_countdown"))} ${new Date().getFullYear()}`;
                        }

                    }
                    // Nếu không có giảm giá, lấy giá gốc
                    else if (hasPrice) {
                        price = getElementText(purchaseWrappers);
                    }
                }
            }

            // Lấy thông tin hệ thống yêu cầu
            const getSystemRequirements = () => {
                const requirements = {};
                const sysReqSections = document.querySelectorAll('.game_area_sys_req');

                sysReqSections.forEach(section => {
                    const os = section.getAttribute('data-os');
                    if (os) {
                        requirements[os] = parseRequirements(section);
                    } else {
                        // Nếu không có sysreq_tabs, giả định là chỉ có Windows
                        requirements['windows'] = parseRequirements(section);
                    }
                });

                return requirements;
            };

            // Hàm phân tích yêu cầu hệ thống
            const parseRequirements = (section) => {
                const requirements = [];

                // Lấy danh sách các mục trong phần tối thiểu và đề xuất
                const minimumItems = Array.from(section.querySelectorAll('.game_area_sys_req_leftCol ul.bb_ul li'));
                const recommendedItems = Array.from(section.querySelectorAll('.game_area_sys_req_rightCol ul.bb_ul li'));

                // Danh sách các tiêu đề cần lấy
                const titles = ['OS', 'Processor', 'Memory', 'Graphics', 'DirectX', 'Network', 'Storage', 'Additional Notes'];

                titles.forEach((title) => {
                    // Tìm mục tương ứng trong danh sách tối thiểu và đề xuất
                    const minimum = minimumItems.find(item => item.textContent.startsWith(`${title}:`))
                        ?.textContent.replace(/.*:\s*/, '').trim() || '';
                    const recommended = recommendedItems.find(item => item.textContent.startsWith(`${title}:`))
                        ?.textContent.replace(/.*:\s*/, '').trim() || '';

                    requirements.push({
                        title,
                        minimum,
                        recommended
                    });
                });

                return requirements;
            };

            return {
                appId: parseInt(id),
                title: getText('#appHubAppName'),
                type: "Game",
                // $14.99 USD => 14.99
                price: getNumber(price),
                // -50% => 50
                discount: getNumber(discount),
                discountStartDate: discountStartDate,
                discountEndDate: discountEndDate,
                description: getText('#game_highlights > div.rightcol > div > div.game_description_snippet'),
                releaseDate: getText('#game_highlights > div.rightcol > div > div.glance_ctn_responsive_left > div.release_date > div.date'),
                developer: getListText(
                    '#developers_list',
                    'a'
                ),
                publisher: getListText(
                    '#game_highlights > div.rightcol > div > div.glance_ctn_responsive_left > div:nth-child(4) > div.summary.column',
                    'a'
                ),
                platform: [
                    "Windows",
                ],
                tags: getListText(
                    '#glanceCtnResponsiveRight > div.glance_tags_ctn.popular_tags_ctn > div.glance_tags.popular_tags',
                    'a'
                ),
                genres: getListText(
                    '#genresAndManufacturer > span',
                    'a'
                ),
                features: getListText(
                    '#category_block > div.game_area_features_list_ctn',
                    'a > div.label'
                ),
                headerImage: getSrc('#gameHeaderImageCtn > img'),
                screenshots: getListSrc(
                    '#highlight_player_area',
                    '.highlight_player_item.highlight_screenshot > div.screenshot_holder > .highlight_screenshot_link',
                    "href"
                ),
                videos: getVideo(
                    "#highlight_player_area",
                    "div.highlight_player_item.highlight_movie",
                ),
                systemRequirements: getSystemRequirements(),
            };
        }, id);

        await browser.close();

        // Ghi vào file mảng json
        addDataToJson('data.json', data);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Craw dữ liệu từ nhiều ID
const crawlByMultipleId = async (req, res) => {
    try {
        const ids = req.body.listAppId;
        let jsonId = req.body.jsonId;

        // Kiểm tra xem ids có tồn tại không
        if (!ids) {
            return res.status(400).json({ message: 'Invalid IDs' });
        }

        // Chuyển ids từ chuỗi thành mảng và xoá newline
        const idList = ids.split(',').map(id => id.replace(/\n/g, ''));

        /**
         *   Nếu có jsonId thì sẽ lấy dữ liệu từ file json
         *   Nếu không có jsonId thì sẽ tạo file json mới
         */
        let fileJSONName;
        if (jsonId) {
            jsonId = jsonId.replace(/\n/g, '');
            fileJSONName = `data-${jsonId}.json`;
        }
        else {
            // Tạo id cho file json
            const date = new Date();
            const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
            jsonId = timestamp;

            // Tạo tên file json
            fileJSONName = `data-${jsonId}.json`;

            // Kiểm tra xem file json đã tồn tại chưa
            if (!fs.existsSync(`json/${fileJSONName}`)) {
                fs.writeFileSync(`json/${fileJSONName}`, '[]', 'utf8');
            }
        }

        // Lấy dữ liệu từ tệp JSON
        const data = readDataFromJson(`json/${fileJSONName}`);

        // Lọc dữ liệu từ mảng ids không có trong tệp JSON
        const idsNotInData = idList.filter(id => !data.some(item => item.appId === parseInt(id)));

        // Khởi tạo trình duyệt
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (x11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.67778.204 Safari/537.36');

        // Duyệt qua mảng ids không có trong tệp JSON
        for (const id of idsNotInData) {
            const url = `https://store.steampowered.com/app/${id}?cc=en`;

            console.log('Đang crawl dữ liệu từ:', url);

            try {
                // Truy cập vào trang web
                await page.goto(url);

                // Xử lý nếu có cổng yêu cầu xác nhận tuổi
                const isAgeGate = await page.$('#ageYear');

                if (isAgeGate) {
                    console.log('Xác định cổng xác nhận tuổi.');

                    // Chọn năm sinh trong thẻ select có id 'ageYear'
                    // Chọn ngẫu nhiên một năm từ 1980 đến 2003
                    const ageYear = Math.floor(Math.random() * (2003 - 1980 + 1)) + 1980;
                    await page.select('#ageYear', ageYear.toString());

                    // Nhấn nút xác nhận trong thẻ a có id 'view_product_page_btn'
                    await page.click('#view_product_page_btn');

                    // Chờ thêm thời gian để đảm bảo thao tác hoàn tất
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Lấy URL sau khi chuyển hướng
                    let currentUrl = await page.url();
                    console.log('URL sau khi chuyển hướng: ' + currentUrl);

                    // Thêm tham số ?cc=en vào URL nếu chưa có
                    if (!currentUrl.includes('?')) {
                        currentUrl += '?cc=en';
                    } else {
                        currentUrl += '&cc=en';
                    }

                    // Điều hướng đến URL mới với tham số cc=en
                    await page.goto(currentUrl);
                    console.log('URL mới sau khi thêm cc=en: ' + currentUrl);
                }

                // Hàm lấy text từ selector
                const data = await page.evaluate((id) => {
                    // Hàm làm sạch văn bản (loại bỏ khoảng trắng, dấu xuống dòng, tab)
                    const cleanText = (text) => {
                        return text
                            ? text.trim().replace(/\n/g, '').replace(/\t/g, '')
                            : null;
                    };

                    // Hàm lấy text từ selector
                    const getText = (selector) => {
                        const element = document.querySelector(selector);
                        return element
                            ? cleanText(element.innerText)
                            : null;
                    };

                    // Hàm lấy text từ element
                    const getElementText = (element) => {
                        return element
                            ? cleanText(element.innerText)
                            : null;
                    }

                    // Hàm lấy danh sách từ selector
                    const getListText = (selector, childSelector) => {
                        const container = document.querySelector(selector);
                        if (!container) return [];

                        return Array.from(container.querySelectorAll(childSelector))
                            .map(link =>
                                cleanText(link.innerText)
                            );
                    };

                    // Hàm lấy src từ selector
                    const getSrc = (selector) => {
                        const element = document.querySelector(selector);
                        return element
                            ? element.src
                            : null;
                    };

                    // Hàm lấy danh sách src từ selector
                    const getListSrc = (
                        selector,
                        childSelector,
                        Attribute
                    ) => {
                        const container = document.querySelector(selector);
                        if (!container) return [];

                        return Array.from(container.querySelectorAll(childSelector))
                            .map(link => {
                                if (Attribute === "src") {
                                    return link.src;
                                }
                                else if (Attribute === "href") {
                                    return link.href;
                                }
                            });
                    };

                    // Hàm lấy video từ selector
                    const getVideo = (
                        videoSelector,
                        videoChildSelector,
                    ) => {
                        const videoContainer = document.querySelector(videoSelector);
                        if (!videoContainer) return [];

                        return Array.from(videoContainer.querySelectorAll(videoChildSelector))
                            .map(video => {
                                const { dataset } = video;

                                console.log(dataset);

                                return {
                                    thumbnail: dataset.poster || null,
                                    mp4: dataset.mp4Source || null,
                                    webm: dataset.webmSource || null,
                                };
                            })
                    };

                    // Hàm chuyển thành số từ chuỗi
                    const getNumber = (price) => {
                        return Number(price.toString().replace(/[^0-9.]/g, ""));
                    }

                    // Xác định giá và giảm giá
                    let price = 0, discount = 0, discountStartDate, discountEndDate;

                    // Kiểm tra miễn phí
                    const isFree = document.querySelector('#freeGameBtn');
                    if (!isFree) {
                        // Lấy container chính của thông tin mua game
                        const purchaseWrappers = document.querySelector("#game_area_purchase div[data-price-final]");

                        // Kiểm tra purchaseWrappers có tồn tại không
                        if (purchaseWrappers) {
                            // Kiểm tra purchaseWrappers có class game_purchase_price price
                            const hasPrice = purchaseWrappers.classList.contains("game_purchase_price", "price");

                            // Kiểm tra có class discount_block 
                            const hasDiscount = purchaseWrappers.classList.contains("discount_block");

                            // Nếu có thuộc tính data-price-final thì lấy giá từ đó
                            if (hasDiscount) {
                                // Kiểm tra có class no_discount
                                const hasNoDiscount = purchaseWrappers.classList.contains("no_discount");

                                // Nếu có class no_discount thì giảm giá là 0
                                if (hasNoDiscount) {
                                    price = getElementText(purchaseWrappers.querySelector("div.discount_prices > div.discount_final_price"));
                                }

                                // Nếu không có class no_discount thì lấy giảm giá
                                else {
                                    price = getElementText(purchaseWrappers.querySelector("div.discount_prices > div.discount_original_price"));
                                    discount = getElementText(purchaseWrappers.querySelector("div.discount_pct"));
                                    discountStartDate = Date.now();
                                    discountEndDate = `${getElementText(document.querySelector("p.game_purchase_discount_countdown"))} ${new Date().getFullYear()}`;
                                }

                            }
                            // Nếu không có giảm giá, lấy giá gốc
                            else if (hasPrice) {
                                price = getElementText(purchaseWrappers);
                            }
                        }
                    }

                    // Lấy thông tin hệ thống yêu cầu
                    const getSystemRequirements = () => {
                        const requirements = {};
                        const sysReqSections = document.querySelectorAll('.game_area_sys_req');

                        sysReqSections.forEach(section => {
                            const os = section.getAttribute('data-os');
                            if (os) {
                                requirements[os] = parseRequirements(section);
                            } else {
                                // Nếu không có sysreq_tabs, giả định là chỉ có Windows
                                requirements['windows'] = parseRequirements(section);
                            }
                        });

                        return requirements;
                    };

                    // Hàm phân tích yêu cầu hệ thống
                    const parseRequirements = (section) => {
                        const requirements = [];

                        // Lấy danh sách các mục trong phần tối thiểu và đề xuất
                        const minimumItems = Array.from(section.querySelectorAll('.game_area_sys_req_leftCol ul.bb_ul li'));
                        const recommendedItems = Array.from(section.querySelectorAll('.game_area_sys_req_rightCol ul.bb_ul li'));

                        // Danh sách các tiêu đề cần lấy
                        const titles = ['OS', 'Processor', 'Memory', 'Graphics', 'DirectX', 'Network', 'Storage', 'Additional Notes'];

                        titles.forEach((title) => {
                            // Tìm mục tương ứng trong danh sách tối thiểu và đề xuất
                            const minimum = minimumItems.find(item => item.textContent.startsWith(`${title}:`))
                                ?.textContent.replace(/.*:\s*/, '').trim() || '';
                            const recommended = recommendedItems.find(item => item.textContent.startsWith(`${title}:`))
                                ?.textContent.replace(/.*:\s*/, '').trim() || '';

                            requirements.push({
                                title,
                                minimum,
                                recommended
                            });
                        });

                        return requirements;
                    };

                    return {
                        appId: parseInt(id),
                        title: getText('#appHubAppName'),
                        type: "Game",
                        // $14.99 USD => 14.99
                        price: getNumber(price),
                        // -50% => 50
                        discount: getNumber(discount),
                        discountStartDate: discountStartDate,
                        discountEndDate: discountEndDate,
                        description: getText('#game_highlights > div.rightcol > div > div.game_description_snippet'),
                        releaseDate: getText('#game_highlights > div.rightcol > div > div.glance_ctn_responsive_left > div.release_date > div.date'),
                        developer: getListText(
                            '#developers_list',
                            'a'
                        ),
                        publisher: getListText(
                            '#game_highlights > div.rightcol > div > div.glance_ctn_responsive_left > div:nth-child(4) > div.summary.column',
                            'a'
                        ),
                        platform: [
                            "Windows",
                        ],
                        tags: getListText(
                            '#glanceCtnResponsiveRight > div.glance_tags_ctn.popular_tags_ctn > div.glance_tags.popular_tags',
                            'a'
                        ),
                        genres: getListText(
                            '#genresAndManufacturer > span',
                            'a'
                        ),
                        features: getListText(
                            '#category_block > div.game_area_features_list_ctn',
                            'a > div.label'
                        ),
                        headerImage: getSrc('#gameHeaderImageCtn > img'),
                        screenshots: getListSrc(
                            '#highlight_player_area',
                            '.highlight_player_item.highlight_screenshot > div.screenshot_holder > .highlight_screenshot_link',
                            "href"
                        ),
                        videos: getVideo(
                            "#highlight_player_area",
                            "div.highlight_player_item.highlight_movie",
                        ),
                        systemRequirements: getSystemRequirements(),
                    };
                }, id);

                // Ghi vào file mảng json
                addDataToJson(`json/${fileJSONName}`, data);

            } catch (error) {
                console.error(`Lỗi khi crawl dữ liệu từ ID ${id}:`, error);
            }
        };

        // Đóng trình duyệt
        await browser.close();

        // Đọc dữ liệu từ tệp JSON đã cập nhật
        const dataUpdated = readDataFromJson(`json/${fileJSONName}`);

        // Lấy ra các id có title null trong file json
        const errorIds = dataUpdated.filter(item => item.title === null).map(item => item.appId);

        res.json({
            message: 'Crawl data successfully!',
            errorIds: errorIds,
            jsonId: jsonId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    crawlByURL,
    crawlByMultipleId
}
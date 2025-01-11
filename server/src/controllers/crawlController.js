const puppeteer = require('puppeteer');
const fs = require('fs');
const { type } = require('os');

// Hàm thêm dữ liệu vào tệp JSON
function addDataToJson(filePath, newData) {
    try {
        // Đọc nội dung của tệp JSON
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            data = JSON.parse(fileContent); // Chuyển đổi từ chuỗi JSON sang đối tượng
        }

        // Kiểm tra nếu dữ liệu là mảng
        if (!Array.isArray(data)) {
            console.error('Dữ liệu trong tệp không phải là một mảng!');
            return;
        }

        // Kiểm tra xem dữ liệu mới có tồn tại trong mảng không
        const isExist = data.some(item => item.appId === newData.appId);
        if (isExist) {
            console.error('Dữ liệu mới đã tồn tại trong mảng!');
            return;
        }

        // Thêm đối tượng mới vào mảng
        data.push(newData);

        // Ghi lại dữ liệu cập nhật vào tệp JSON
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Đã thêm dữ liệu mới vào tệp JSON!');
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    }
}

const crawlByURL = async (req, res) => {
    try {
        const id = req.query.id;

        // Kiểm tra xem id có tồn tại và là số không
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const url = `https://store.steampowered.com/app/${id}?cc=us`;

        console.log('Đang crawl dữ liệu từ:', url);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (x11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.67778.204 Safari/537.36');
        await page.goto(url);

        // Kiểm tra xem trang web có yêu cầu tuổi không
        const isAgeGate = await page.$('#ageYear');

        if (isAgeGate) {
            console.log('Đã xác định tuổi người dùng!');

            // Chọn năm sinh trong thẻ select có id 'ageYear'
            // Chọn ngẫu nhiên một năm từ 1980 đến 2003
            const ageYear = Math.floor(Math.random() * (2003 - 1980 + 1)) + 1980;
            await page.select('#ageYear', ageYear.toString());

            // Nhấn nút xác nhận trong thẻ a có id 'view_product_page_btn'
            await page.click('#view_product_page_btn');

            // Chờ thêm thời gian để đảm bảo thao tác hoàn tất
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Lấy URL sau khi chuyển hướng
            let currentUrl = await page.url();
            console.log('URL sau khi chuyển hướng: ' + currentUrl);

            // Thêm tham số ?cc=us vào URL nếu chưa có
            if (!currentUrl.includes('?')) {
                currentUrl += '?cc=us';
            } else {
                currentUrl += '&cc=us';
            }

            // Điều hướng đến URL mới với tham số cc=us
            await page.goto(currentUrl);
            console.log('URL mới sau khi thêm cc=us: ' + currentUrl);
        }

        let html = await page.content();
        // fs.writeFileSync('test.html', html, 'utf8');

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

            // Xác định giá và giảm giá
            let price, discount, discountStartDate, discountEndDate;

            // Lấy container chính của thông tin mua game
            const purchaseContainer = "#game_area_purchase > div.game_area_purchase_game_wrapper:nth-child(2) > div.game_area_purchase_game";

            // Kiểm tra trường hợp giá có giảm
            const discountBlock = `${purchaseContainer} > div.game_purchase_action > div > div.discount_block.game_purchase_discount`;

            // Lấy element của block giảm giá
            const discountBlockElement = document.querySelector(discountBlock);

            // Nếu có giảm giá
            if (discountBlockElement) {
                price = getText(`${discountBlock} > div.discount_prices > div.discount_original_price`);
                discount = getText(`${discountBlock} > div.discount_pct`);
                discountStartDate = Date.now();
                discountEndDate = getText(`${purchaseContainer} > p.game_purchase_discount_countdown`);
            } else {
                // Nếu không có giảm giá, lấy giá gốc
                price = getText(`${purchaseContainer} > div.game_purchase_action > div.game_purchase_action_bg > div.game_purchase_price.price`);
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
                appId: id,
                title: getText('#appHubAppName'),
                type: "Game",
                price: price,
                discount: discount,
                discountStartDate: discountStartDate,
                discountEndDate: `${discountEndDate} ${new Date().getFullYear()}`,
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

module.exports = {
    crawlByURL,
}
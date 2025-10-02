'use client'

interface AreaDescriptionProps {
    detailed_description: string;
    about_the_game: string;
}

const AreaDescription: React.FC<AreaDescriptionProps> = ({
    detailed_description,
    about_the_game
}) => {
    // Xử lý khi click xem thêm
    const handleClickReadMore = (id: string) => {
        const productDetail = document.getElementById(id);

        if (productDetail) {
            productDetail.classList.toggle('collapsed');
        }
    }

    return (
        <>
            <div className="product-detail-container collapsed" id="detailDescription">
                <div className="product-detail-auto-collapse">
                    <div className="product-detail-area"
                        dangerouslySetInnerHTML={{ 
                            __html: detailed_description.split('<h1>About the Game</h1>')[0]
                            || "" 
                        }}
                    />
                </div>

                {/* Nút xem thêm */}
                <div className="product-detail-toggle">
                    <div className='product-detail-toggle-button'
                        onClick={() => handleClickReadMore('detailDescription')}
                    >
                        Show More
                    </div>
                </div>
            </div>

            <div className="product-detail-container collapsed" id="aboutTheGame">
                <div className="product-detail-auto-collapse">
                    <div className="product-detail-area"
                        dangerouslySetInnerHTML={{ __html: "<h1>About the Game</h1>" + about_the_game || "" }}
                    />
                </div>

                {/* Nút xem thêm */}
                <div className="product-detail-toggle">
                    <div className='product-detail-toggle-button'
                        onClick={() => handleClickReadMore('aboutTheGame')}
                    >
                        Show More
                    </div>
                </div>
            </div>
        </>
    );
}

export default AreaDescription;


function ShoppingHeader() {
    return (
        <header className="fixed w-full z-10 opacity-95">
            <nav className="flex  justify-between items-center max-w-5xl mx-auto h-12">
                <ul className="flex items-center w-3/5 h-full">
                    <a href="/shop" className="flex items-center justify-center w-full h-3/5 mr-5">
                        <img src="../../logo.png" className="w-16" alt="" />
                    </a>
                </ul>
            </nav>
        </header>
    );
}

export default ShoppingHeader;
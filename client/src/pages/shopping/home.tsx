import ShoppingHomeAside from "@/components/shopping/aside/aside";
import CategoriesSection from "@/components/shopping/section/categoriesSection";
import ReleasesSection from "@/components/shopping/section/releasesSection";

function ShoppingHome() {
    return (
        <main className="flex flex-col w-full">
            <ShoppingHomeAside />

            <article className="mt-10">
                <ReleasesSection />
                <CategoriesSection />
            </article>
        </main>
    );
}

export default ShoppingHome;
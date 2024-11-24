import ShoppingHomeAside from "@/components/shopping/aside/aside";
import CategoriesSection from "@/components/shopping/section/categoriesSection";
import DiscoverSection from "@/components/shopping/section/discoverSection";
import ReleasesSection from "@/components/shopping/section/releasesSection";
import GameShowcase from "@/components/shopping/section/game-showcase/gameShowcase";

function ShoppingHome() {
    return (
        <main className="flex flex-col w-full">
            <ShoppingHomeAside />

            <article className="">
                <ReleasesSection />
                <DiscoverSection />
                <CategoriesSection />
                <GameShowcase />
            </article>
        </main>
    );
}

export default ShoppingHome;
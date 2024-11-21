import ShoppingHomeAside from "@/components/shopping/aside/aside";

interface NewReleases {
    src: string;
    title: string;
}

function ShoppingHome() {
    const newReleases: NewReleases[] = [
        {
            src: "/new-releases/black-myth-wukong.webp",
            title: "Black Myth: Wukong",
        },
        {
            src: "/new-releases/dark-and-darker.jpg",
            title: "Call of Duty®: Black Ops 6",
        },
        {
            src: "/new-releases/dragons-dogma-2.webp",
            title: "Final Fantasy VII Rebirth",
        },
        {
            src: "/new-releases/final-fantasy-vii-rebirth.webp",
            title: "God of War™ Ragnarok",
        },
        {
            src: "/new-releases/god-of-war-ragnarök.jpg",
            title: "Hades II",
        },
        {
            src: "/new-releases/hades-ii.png",
            title: "The Last of Us Part II Remastered",
        },
        {
            src: "/new-releases/resident-evil-village.jpg",
            title: "Resident Evil Village",
        },
        {
            src: "/new-releases/rise-of-the-ronin.webp",
            title: "Dragon's Dogma 2",
        },
        {
            src: "/new-releases/stellar-blade.webp",
            title: "Rise of the Ronin",
        },
        {
            src: "/new-releases/tekken-8.jpg",
            title: "Stellar Blade™",
        },
        {
            src: "/new-releases/The-last-of-us-part-ii.webp",
            title: "TEKKEN 8",
        },

    ];

    return (
        <main className="flex flex-col w-full">
            <ShoppingHomeAside />

            <article className="mt-10">
                <section className="relative w-full mb-16">
                    <h2 className="mb-16 text-center text-4xl">
                        New Releases or Comming soon
                    </h2>

                    <ul className="relative flex flex-wrap justify-center gap-y-6">
                        {newReleases.map((newRelease, index) => (
                            <li
                                key={index}
                                className={`flex-shrink-0 ml-4`}
                                style={{
                                    width: "calc(calc(calc( (100vw - 17px) - 42px - 42px + 14px ) / 12) * 2 - 14px)"
                                }}
                            >
                                <a href="">
                                    {/* Image */}
                                    <img src={newRelease.src} className="w-full" alt="" />
                                    {/* Title */}
                                    <p className="mt-3 text-base text-center">
                                        {newRelease.title}
                                    </p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </article>
        </main>
    );
}

export default ShoppingHome;
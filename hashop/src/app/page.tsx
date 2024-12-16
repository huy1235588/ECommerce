import HomeHeader from "@/components/home/header";
import styles from "@/styles/home.module.css";

export default function Home() {
    return (
        <div className={styles.root}>
            <HomeHeader
                active="ha"
            />
            <main>
                main
            </main>
        </div>
    );
}

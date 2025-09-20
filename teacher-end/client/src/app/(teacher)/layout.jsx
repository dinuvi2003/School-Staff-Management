import Header from "@/components/layout/global/Header";

export default function Layout({ children }) {
    return (
        <div>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <main className="body-content">
                {children}
            </main>
        </div>
    );
}
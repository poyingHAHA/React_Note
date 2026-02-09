import { Outlet } from "react-router-dom"
import MainNavigation from "../components/MainNavigation"

export default function RootLayout() {
    // Outlet is a special component that will render the matched child route element
    return <>
        <MainNavigation />
        <Outlet />
    </>
}
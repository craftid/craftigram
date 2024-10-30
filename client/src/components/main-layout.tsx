import { Outlet } from "react-router-dom"

import LeftSidebar from "./left-sidebar"

const MainLayout = () => {
	return (
		<div>
			<LeftSidebar />
			<div>
				<Outlet />
			</div>
		</div>
	)
}

export default MainLayout

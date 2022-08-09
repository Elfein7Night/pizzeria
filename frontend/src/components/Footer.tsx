import { Link, useLocation } from 'react-router-dom'

export default function Footer() {

    const location = useLocation();

    return (
        < footer >
            {
                location.pathname !== '/completed' &&
                <Link to='/completed'>Show Completed Batches Report</Link>
            }
        </footer >
    )
}

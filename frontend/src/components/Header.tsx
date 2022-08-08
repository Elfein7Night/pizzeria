import Button from "./Button";
import { useLocation } from "react-router-dom";

type HeaderProps = {
    onClick: () => void;
    showingBatchForm: boolean;
    title?: string;
}

export default function Header({ onClick, showingBatchForm: showingAddButton, title = 'Pizzeria' }: HeaderProps) {
    const location = useLocation();

    return (
        <header className="header">
            <h2>{title}</h2>
            {
                location.pathname === '/' &&
                <
                    Button
                    color={showingAddButton ? 'red' : 'green'}
                    text={showingAddButton ? 'Cancel' : 'Add Order Batch'}
                    onClick={onClick}
                />
            }
        </header>
    );
}

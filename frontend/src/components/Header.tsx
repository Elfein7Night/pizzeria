import Button from "./Button";
import { useLocation } from "react-router-dom";
import { BTN_COLOR, BTN_COLOR_CRIT } from "../App.constants";

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
                    color={showingAddButton ? BTN_COLOR : BTN_COLOR_CRIT}
                    text={showingAddButton ? 'Cancel' : 'Add Order Batch'}
                    onClick={onClick}
                />
            }
        </header>
    );
}

import { styled } from "@mui/material/styles";
import { StyleVariables } from "helpers/Constants";

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: 0,
    marginRight: 0,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

export const DebouncedInputWrapper = styled('div')(({ theme }) => ({
    color: "inherit",
    opacity: 0.6,
    "& div *": {
        padding: theme.spacing(0, 0, 0, 0),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));


export const PaginationButtonStyle = {
    mx: {
        ":disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
            backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
            boxShadow: StyleVariables.INPUT_SHADOW,
            color: StyleVariables.TEXT_NORMAL,
        },
        ":hover": {
            backgroundColor: StyleVariables.TEXT_ACCENT_HOVER,
        },
        backgroundColor: StyleVariables.TEXT_ACCENT,
    }
}

export const MenuButtonStyle = {
    sx: {
        color: StyleVariables.TEXT_ACCENT_HOVER,
    }
}
import { alpha, styled } from "@mui/material/styles";
import { StyleVariables } from "helpers/Constants";

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const DebouncedInputWrapper = styled('div')(({ theme }) => ({
    color: "inherit",
    opacity: 0.6,
    "& div *": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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
        },
        ":hover": {
            backgroundColor: StyleVariables.TEXT_ACCENT_HOVER,
        },
        backgroundColor: StyleVariables.TEXT_ACCENT,
    }
}
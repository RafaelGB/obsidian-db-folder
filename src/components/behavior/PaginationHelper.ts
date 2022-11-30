import { PageButton } from "cdm/MenuBarModel";
import { PaginationRenderOptions } from "helpers/Constants";

/**
   * Manages which page to show when the user clicks on the next page button
   * @param page
   * @param total
   * @returns
   */
export const getVisiblePages = (
    currentPage: number,
    total: number
): PageButton[] => {
    if (total < 7) {
        return Array.from(Array(total).keys()).map((i) => {
            return {
                page: i + 1,
                type: PaginationRenderOptions.BASIC,
            };
        });
    } else {
        if (currentPage % 5 >= 0 && currentPage > 4 && currentPage + 2 < total) {
            return [
                {
                    page: 1,
                    type: PaginationRenderOptions.INITIAL,
                },
                {
                    page: currentPage - 1,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: currentPage,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: currentPage + 1,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: total,
                    type: PaginationRenderOptions.FINAL
                },
            ];
        } else if (
            currentPage % 5 >= 0 &&
            currentPage > 4 &&
            currentPage + 2 >= total
        ) {
            return [
                {
                    page: 1,
                    type: PaginationRenderOptions.INITIAL,
                },
                {
                    page: total - 3,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: total - 2,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: total - 1,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: total,
                    type: PaginationRenderOptions.BASIC,
                },
            ];
        } else {
            return [
                {
                    page: 1,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: 2,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: 3,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: 4,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: 5,
                    type: PaginationRenderOptions.BASIC,
                },
                {
                    page: total,
                    type: PaginationRenderOptions.FINAL
                },
            ];
        }
    }
};

export const drawPaginationBehavior = (button: PageButton) => {
    switch (button.type) {
        case PaginationRenderOptions.BASIC:
            return `${button.page}`;
        case PaginationRenderOptions.INITIAL:
            return `${button.page}...`;
        case PaginationRenderOptions.FINAL:
            return `...${button.page}`;
    }
};
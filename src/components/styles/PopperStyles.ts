export const PopperTypesStyleModifiers = () => {
    return [
        {
            name: 'flip',
            enabled: true,
            options: {
                altBoundary: true,
                rootBoundary: 'document',
                padding: 8,
            },
        },
        {
            name: 'preventOverflow',
            enabled: true,
            options: {
                altAxis: true,
                altBoundary: false,
                tether: true,
                rootBoundary: 'document',
                padding: 8,
            },
        },
        {
            name: 'arrow',
            enabled: true,
        }
    ]
}
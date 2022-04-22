const getColumnWidthStyle = (rows:any, accessor:any, headerText:string) => {
    const maxWidth = 400
    const magicSpacing = 10
    const cellLength = Math.max(
      ...rows.map((row:any) => (`${row[accessor]}` || '').length),
      headerText.length,
    )
    return Math.min(maxWidth, cellLength * magicSpacing)
  }

export default getColumnWidthStyle;
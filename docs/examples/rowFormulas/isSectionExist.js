/**
 * Determine if a section exists in a note by checking the headings.
 * 
 * Formula: ${db.js.isSectionExist(row,"my section")}
 * @param {*} row 
 * @param {*} sectionString 
 * @returns 
 */
function isSectionExist(row,sectionString){
  const headings = app.metadataCache.getFileCache(row.__note__.getFile()).headings;
  return headings.some(h => h.heading===sectionString);
}

module.exports = isSectionExist
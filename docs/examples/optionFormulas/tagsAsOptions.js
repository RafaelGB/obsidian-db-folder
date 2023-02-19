/**
 * Generate a list of options in function of the tags of Obsidian
 * 
 * Formula: ${db.js.tagsAsOptions(db)}
 */
function tagsAsOptions(db) {
    options = [];
    tagArray = app.metadataCache.getTags(); // Record<string, number>
    Object.keys(tagArray).forEach(tag => {
        options.push({
            value: tag,
            label: tag.slice(1),
            color: db.colors.randomColor()
        })
    });
    return options;
}

module.exports = tagsAsOptions
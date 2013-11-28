module.exports = {
	/**
	 * Searches backwards through str starting at index to find the character char. Returns the index
	 * within str when it stops.
	 */
	findReverse: function(str, index, char) {
		index--;

		while (index > 0 && str.charAt(index) != char) {
			index--;
		}

		return index;
	},

	/**
	 * Replaces the center of str (from startIX to endIX) with contents.
	 */
	replaceMidWith: function(str, startIX, endIX, contents) {
		var ret = str.substr(0, startIX);
		ret += contents;
		ret += str.substr(endIX, str.length);

		return ret;
	},
	/**
	 * Returns the spaces and / or tabs preceding the specified index within fileContents after the preceding newline
	 * character.
	 */
	getFormatPrefixAtPoint: function(fileContents, index) {
		var prefix = "";
		index--;

		while (index > 0 && fileContents.charAt(index) == " " || fileContents.charAt(index) == "\t") {
			prefix = fileContents.charAt(index) + prefix;
			index--;
		}

		return prefix;
	},
	endsWith: function(str, value) {
		return str.indexOf(value) == str.length - value.length;
	}
};
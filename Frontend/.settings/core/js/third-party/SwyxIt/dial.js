function syxClickToDial(item, row, cell){
	return "<a onclick='window.doNotShowConfirmation = true;' href='swyx:// " + item.replace(/ /g, "") + "'>" + item + "</a>";
}
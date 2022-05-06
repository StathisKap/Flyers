// find all folders in /Users/stathis/Pictures/Events/May-10th-Charity-Event/
var folder = Folder("/Users/stathis/Pictures/Events/May-10th-Charity-Event/");
var files = folder.getFiles();
var fileNames = [];

// if the file starts with a ., skip it
// if the file is a folder with only 2 files, excluding the .DS_Store file, add it to the list
for (var i = 0; i < files.length; i++) {
	if (files[i].name.charAt(0) == ".")
		continue;
	var folder_contents = files[i].getFiles();
	var number_of_files = 0;
	for (var j = 0; j < folder_contents.length; j++) {
		if (folder_contents[j].name.charAt(0) == ".")
			continue;

		number_of_files++;
		if (number_of_files > 2)
			break;
	}
	if (number_of_files == 2)
		fileNames.push(files[i].name);
}

alert(fileNames);

// loop through the list of folders, and open the psd file in each folder
for (var i = 0; i < fileNames.length; i++) {
	var folder = Folder("/Users/stathis/Pictures/Events/May-10th-Charity-Event/" + fileNames[i]);
	var files = folder.getFiles();
	for (var j = 0; j < files.length; j++) {
		if (files[j].name.charAt(0) == ".")
			continue;
		if (files[j].name.indexOf(".psd") != -1) {
			app.open(files[j]);
			Change_Name_and_SaveJpeg(fileNames[i]);
			app.activeDocument.close(SaveOptions.SAVECHANGES);
		}
	}
}

function Change_Name_and_SaveJpeg(name) {
	var doc = app.activeDocument;
	var file = new File(doc.path + '/' + name + '.jpg');
	var titleGroup = doc.layerSets.getByName('Text');
	var titleLayer = titleGroup.layers.getByName('Name');
	titleLayer.textItem.contents = name.replace(/%20/g, " ");
	Change_Pic(doc, name);
	var opts = new JPEGSaveOptions();
	// add options to make the file size smaller
	opts.quality = 6;
	opts.embedColorProfile = true;
	opts.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
	removeXMP();
	doc.saveAs(file, opts, true, Extension.LOWERCASE);
	//doc.saveAs(file,opts,true);
}

function Change_Pic(doc, name) {
	var ImageGroup = doc.layerSets.getByName('Main-Pic');
	var ImageLayer = ImageGroup.layers[0];
	ImageLayer = replaceContents(doc.path + '/' + name + '.jpeg', ImageLayer);
	app.activeDocument.activeLayer = ImageLayer;
	doAction('Transform', 'Flyers');
}

function replaceContents(newFile, theSO) {
	app.activeDocument.activeLayer = theSO;
	var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
	var desc3 = new ActionDescriptor();
	var idnull = charIDToTypeID("null");
	desc3.putPath(idnull, new File(newFile));
	var idPgNm = charIDToTypeID("PgNm");
	desc3.putInteger(idPgNm, 1);
	executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
	return app.activeDocument.activeLayer
};

function removeXMP() {
	if (!documents.length) return;
	if (ExternalObject.AdobeXMPScript == undefined)
	ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
	var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
	XMPUtils.removeProperties(xmp, "", "", XMPConst.REMOVE_ALL_PROPERTIES);
	app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}

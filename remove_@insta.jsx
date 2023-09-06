var baseFolder = new Folder("/Users/stathis/Pictures/Events/Crown Gala/Animal Charity 26th Sept 2023/Done");

processFolder(baseFolder);

function processFolder(folder) {
    var files = folder.getFiles("*.psd");

    // Loop through all PSD files in the folder
    for (var i = 0; i < files.length; i++) {
        var doc = app.open(files[i]);

        // Loop through layers
        for (var j = 0; j < doc.layers.length; j++) {
            var layer = doc.layers[j];
            if (layer.kind === LayerKind.TEXT) {
                var text = layer.textItem.contents;
                if (text.charAt(0) === '@') {
                    layer.remove();
                }
            }
        }

        // Save as JPEG
        saveAsJPEG(doc, files[i]);

        // app.activeDocument.close(SaveOptions.SAVECHANGES);
        doc.close();
    }

    // Loop through subfolders
    var subfolders = folder.getFiles(function(file) {
        return file instanceof Folder;
    });
    for (var i = 0; i < subfolders.length; i++) {
        processFolder(subfolders[i]);
    }
}

function saveAsJPEG(doc, file) {
    var opts = new JPEGSaveOptions();
    opts.quality = 6;
    opts.embedColorProfile = true;
    opts.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
    removeXMP();
    var jpegName = file.absoluteURI.replace(/\.[^\.]+$/, ".jpg");
    doc.saveAs(new File(jpegName), opts, true, Extension.LOWERCASE);
}

function removeXMP() {
    if (!documents.length) return;
    if (ExternalObject.AdobeXMPScript == undefined)
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
    XMPUtils.removeProperties(xmp, "", "", XMPConst.REMOVE_ALL_PROPERTIES);
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}

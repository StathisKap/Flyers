/**
 *
 * Get the path to the current script
 * Build a path to the data.txt file relative to the script's location
 *
 */
var scriptPath = File($.fileName).path;
var targetFile = File(scriptPath + "/data.txt");

// Check if the file exists
if (targetFile.exists) {
    var dataFile = new File(targetFile);
    dataFile.open('r');
    var directory_path = dataFile.read();
    dataFile.close();

} else {
    alert("Error: data.txt not found!");
}

/**
 *
 * Implementing startsWith for older JS environments
 *
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

/**
 *
 * Implementing endsWith for older JS environments
 *
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

// Get the list of folders in the directory
alert("Working Dir:\n" + directory_path);
var folder = Folder(directory_path);
var subfolders = folder.getFiles(function (item) {
    if (item instanceof Folder && !item.name.startsWith('.')) {
        item.name = item.name;
        return true;
    }
    return false;
});

/**
 *
 * When this script runs, the output is an edited jpeg.
 * The file type of the input image is always jpg.
 * So we only find the folders without a jpeg to make sure we're
 * only editing the flyers that haven't completed yet
 */
var folders = getFoldersWithoutJpeg(subfolders);
alert("Folders in Dir: \n" + folders.join(',\n'));


/**
 *
 * Here's where all the editing happens
 *
 */
for (var i = 0; i < folders.length; i++) {
    var folder = folders[i];
    processPSDFilesInFolder(directory_path + folder);
}
alert("Done!")


/**
 *
 * EDITING FUNCTION
 *
 */
function processPSDFilesInFolder(folderPath) {
    var folder = Folder(encodeURIComponent(folderPath));
    var files = folder.getFiles();
    /**
     *
     *
     * 
     */
    //  var baseNames = []; // Just used for printing out the names of the files
    //  for (var i = 0; i < files.length; i++) {
    //      var file = files[i];
    //      var baseName = file.name;  // This gets you just the filename part
    //      baseNames.push(baseName);
    //  }
     
    //  alert("Base names of files: \n" + baseNames.join('\n'));
    /**
     *
     *
     * 
     */

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Ignore hidden files (those starting with ".")
        if (file.name.charAt(0) === ".") continue;

        // Check for PSD files and process them
        if (file.name.toLowerCase().endsWith(".psd")) {
            app.open(file);
            // file name: /Users/stathis/Pictures/Events/Crown Gala/Animal Charity 26th Sept 2023/Ambassadors/@_chloeroberta_%ChloeRoberta/@_chloeroberta_%ChloeRoberta(1).jpeg
            // file name: /Users/stathis/Pictures/Events/Crown Gala/Animal Charity 26th Sept 2023/Ambassadors/@kacey.jayne_%Kacey_Jayne/@kacey.jayne_%Kacey_Jayne.jpeg 
            // Make a variable file name, that is just the name of the file without the extension
            var file_name = file.name.split('/').pop()
            var file_name = file_name.substr(0, file_name.lastIndexOf('.')) || file_name;

            // alert("file_name: \n" + file_name)
            Change_Name_and_SaveJpeg(file_name);
            app.activeDocument.close(SaveOptions.SAVECHANGES);
        }
    }
}


/**
 * Returns a list of folder names from the provided subfolders
 * which do not contain any .jpeg files.
 *
 * @param {Array} subfolders - An array of Folder objects to be checked.
 * @returns {Array} - An array of folder names without .jpeg files.
 */
function getFoldersWithoutJpeg(subfolders) {
    var fileNamesWithoutJpeg = [];

    for (var i = 0; i < subfolders.length; i++) {
        var subfolder = subfolders[i];

        // Ignore the "Template" directory
        if (subfolder.name === "Templates") {
            continue;  // skip to the next iteration of the loop
        }

        var filesInSubfolder = subfolder.getFiles(function (file) {
            return file.name.toLowerCase().endsWith('.jpg');
        });

        if (filesInSubfolder.length === 0) {
            fileNamesWithoutJpeg.push(decodeURIComponent(subfolder.name));
        }
    }

    return fileNamesWithoutJpeg;
}


/**
 *
 *
 * 
 */
function splitName(inputStr) {
    // Remove the file extension
    var cleanedStr = inputStr.replace(/\.(jpeg|jpg|png)$/, '');

    // Split the string into handle and name by the '%' symbol
    var splitArr = cleanedStr.split('%');

    // Further process the handle to make it Instagram-friendly
    var instaTag = splitArr[0];

    // Further process the name to make it human-readable
    var name = splitArr[1].replace(/_/g, ' ') // Replace '_' with ' '
                        //   .replace(/-/g, ' ') // Replace '-' with ' '
                          .replace(/\(\d+\)/g, '') // Remove '(1)', '(2)', etc.
                          .replace(/^25/, '') // Remove '25' from the start of the string
                          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space between first and last name 
                          // Capitalize the first letter of each word
                          .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
                          ;


    alert("\ninstaTag: " + instaTag + "\nname: " + name + "\n")

    return [instaTag, name];
}


/**
 *
 *
 *
 */
function Change_Name_and_SaveJpeg(name) {
    var doc = app.activeDocument;
    // alert("Using Doc: " + doc.name);
    // alert("Using Path: " + doc.path);
    var file = new File(doc.path + '/' + name + '.jpg');
    result = splitName(name);
    // For 'Name' layer
    try {
        var nameLayer = doc.layers.getByName('Name');
        nameLayer.textItem.contents = result[1];
    } catch (e) {}

    // For '@insta' layer
    try {
        var tagLayer = doc.layers.getByName('@insta');
        tagLayer.textItem.contents = result[0];
    } catch (e) {}

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

/**
 *
 *
 *
 */
function Change_Pic(doc, name) {
    alert("Using Pic: " + name)
    var ImageLayer = doc.layers.getByName('Main-Pic');
    ImageLayer = replaceContents(doc.path + '/' + name + '.jpeg', ImageLayer);
    app.activeDocument.activeLayer = ImageLayer;
    // Open the smart object (frame content)
    // executeAction(stringIDToTypeID('placedLayerEditContents'), undefined, 
    // The layer is made of a frame and an Embedded Smart Object. Select the Embedded smart object
    var theSO = app.activeDocument.activeLayer.layers[0];
    // Select the Embedded Smart Object
    app.activeDocument.activeLayer = theSO;

    try {
        doAction('Transform', 'Flyers');
    }
    catch (error) {
        // alert("No Changes Made\n" + error);
    }
}

/**
 *
 *
 *
 */
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

/**
 *
 *
 *
 */
function removeXMP() {
    if (!documents.length) return;
    if (ExternalObject.AdobeXMPScript == undefined)
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
    XMPUtils.removeProperties(xmp, "", "", XMPConst.REMOVE_ALL_PROPERTIES);
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}

#! /usr/bin/env python3
import shutil
import glob
import os
import sys
import tkinter as tk
from tkinter.filedialog import askdirectory

#################################
######## CHANGE THIS ############
#################################
default_path = "/Change/This/Path/"
#################################

print("Select the Folder with the JPEGS", end="\n\n")

# if the user has provided the f flag, the set directory to the one provided
if len(sys.argv) > 1 and sys.argv[1] == '-f':
    directory = default_path
elif len(sys.argv) > 1:
# if the user has provided a directory, use it
    directory = sys.argv[1]
else:
    root = tk.Tk()
    root.withdraw()
    # get the directory
    directory = askdirectory()
    if directory == "":
        directory = default_path
if not directory.endswith("/"):
    directory = directory +"/"

original = directory + 'Templates/Template.psd'
names = glob.glob(directory + "*.jpeg")
print(directory)
print(original)
print("Found " + str(len(names)) + " Pictures", end="\n\n")

for name in names:
    New_Directory_Path = name[0:(name.find(".jpeg"))]
    Ambassador_name = os.path.basename(New_Directory_Path)
    print(Ambassador_name + ": " + New_Directory_Path)
    os.mkdir(New_Directory_Path)
    target = New_Directory_Path + "/" + Ambassador_name
    print(target, end="\n\n")
    shutil.copyfile(original, target + '.psd')
    shutil.copyfile(name, target + '.jpeg')
    os.remove(name)

# run the edit_PS.jsx script
os.system("open -a 'Adobe Photoshop 2023' ./edit_PS.jsx")

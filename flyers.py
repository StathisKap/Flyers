#! /usr/bin/env python3
import shutil
import glob
import os
import sys 
import tkinter.filedialog
import tkinter as tk

# if the user has provided the f flag, the set directory to the one provided
if len(sys.argv) > 1 and sys.argv[1] == '-f':
    directory = "/Users/stathis/Pictures/Events/May-10th-Charity-Event/"
elif len(sys.argv) > 1:
# if the user has provided a directory, use it
    directory = sys.argv[1]
else:
    root = tk.Tk()
    root.withdraw()
    # get the directory
    directory = tk.filedialog.askdirectory()
    if directory == "":
        directory = "/Users/stathis/Pictures/Events/May-10th-Charity-Event/"
    else:
        exit()

#directory = '/Users/stathis/Pictures/Events/May-10th-Charity-Event/'
original = directory + 'Flyer Templates _ Originals/' + 'Ambassadors.psd'
names = glob.glob(directory + "*.jpeg")

for name in names:
    New_Directory_Path = name[0:(name.find(".jpeg"))]
    Ambassador_name = os.path.basename(New_Directory_Path)
    print(New_Directory_Path)
    print(Ambassador_name)
    os.mkdir(New_Directory_Path)
    target = New_Directory_Path + "/" + Ambassador_name
    print(target)
    shutil.copyfile(original, target + '.psd')
    shutil.copyfile(name, target + '.jpeg')
    os.remove(name)

# run the edit_PS.jsx script
os.system("open -a 'Adobe Photoshop 2022' ./edit_PS.jsx")
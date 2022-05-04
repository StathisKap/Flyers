#! /usr/bin/env python3
import shutil
import glob
import os
directory = '/Users/stathis/Pictures/Events/May-10th-Charity-Event/'
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
import shutil
import glob
import os 
directory = '/mnt/d/Stathis/Events/Charity Event/May 10th 2022 _ Charity Event -20220416T081555Z-001/May 10th 2022 _ Charity Event/'
original = directory + 'Taylor McTaggart/Taylor McTaggart.psd'
names = glob.glob(directory + "*.jpg")

for name in names:
    New_Directory_Path = name[0:(name.find(".jpg"))] 
    Ambassador_name = os.path.basename(New_Directory_Path)
    print(New_Directory_Path)
    print(Ambassador_name)
    os.mkdir(New_Directory_Path)
    target = New_Directory_Path + "/" + Ambassador_name
    print(target)
    shutil.copyfile(original, target + '.psd')
    shutil.copyfile(name, target + '.jpeg')
    os.remove(name)
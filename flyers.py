#! /usr/bin/env python3
import shutil
import glob
import os
import re
import argparse
import tkinter as tk
from tkinter.filedialog import askdirectory
from PIL import Image

#################################
######## CHANGE THIS ############
#################################
default_path = "/Change/This/Path/"
#################################
data_file = "data.txt"

def save_last_path(path):
    with open(data_file, 'w') as f:
        f.write(path)

def get_last_path():
    try:
        with open(data_file, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return None

def select_directory_with_gui(default):
    root = tk.Tk()
    root.withdraw()

    # Use the last path as the initial directory if it exists
    initialdir = get_last_path() or default
    directory = askdirectory(initialdir=initialdir)
    root.destroy()

    if not directory:
        return default

    if not directory.endswith("/"):
        directory += "/"

    # Save the selected directory as the last path
    save_last_path(directory)

    return directory


def convert_to_jpeg_and_rename(folder_path):
    for filename in os.listdir(folder_path):
        # Ensure the file is an image before processing
        if filename.lower().endswith(('.png', '.jpeg', '.jpg', '.tiff', '.bmp', '.gif')):
            
            # Remove spaces, replace '_Picture' with '_photo', and any other required renamings
            new_filename = filename.replace(" ", "").replace("_Picture", "_photo")
            
            # Remove any other extension that might already exist
            if re.search(r'\.[^_]{3,4}\.[^_]{3,4}$', new_filename):
                base_name = new_filename.rsplit('.', 2)[0]
            else:
                base_name, _ = os.path.splitext(new_filename)
            jpeg_path = os.path.join(folder_path, base_name + '.jpeg')
            
            img_path = os.path.join(folder_path, filename)
            img = Image.open(img_path)
            img.save(jpeg_path, "JPEG")

            # If the original name isn't the new name or if the original wasn't saved as a .jpeg, remove the original image
            if filename != new_filename or not filename.endswith('.jpeg'):
                os.remove(img_path)

def main():
    parser = argparse.ArgumentParser(description="Process JPEGs in a directory.")
    parser.add_argument("-f", "--folder", help="Use default folder path", action="store_true")
    parser.add_argument("-l", "--last", help="Use path in data.txt", action="store_true")
    parser.add_argument("directory", nargs="?", default=None, help="Directory containing JPEGs")
    args = parser.parse_args()

    if args.folder:
        directory = default_path
    elif args.directory:
        directory = args.directory
    elif args.last:
        directory = get_last_path()
        if not directory:
            print("No last path found. Exiting.")
            return
    else:
        directory = select_directory_with_gui(default_path)

    if not directory:
        print("No directory selected. Exiting.")
        return

    if not directory.endswith("/"):
        directory += "/"

    ##### Converting all the images #####
    convert_to_jpeg_and_rename(directory)

    original = directory + 'Templates/Template.psd'
    names = glob.glob(directory + "*.jpeg")
    print(f"\nDIR Selected: '{directory}'")
    print(f"Using Template: '{original}'\n")
    print(f"Found {len(names)} Pictures\n")

    for name in names:
        ##### Determine the extension ##### 
        ext = '.jpeg'

        ##### Extract path without extension #####
        path_without_ext = name.rsplit(ext, 1)[0]

        ##### Extract ambassador name by cutting off the '_photo' part #####
        # Ambassador_name = os.path.basename(path_without_ext.rsplit('_photo', 1)[0])
        ##### Remove any (1), (2), (3) etc. #####
        Ambassador_name = re.sub(r'\(\d+\)', '', path_without_ext)
        print(f"Ambassador: {Ambassador_name}")

        ##### Create a directory for the ambassador if it doesn't exist #####
        ambassador_directory = os.path.join(directory, Ambassador_name)
        if not os.path.exists(ambassador_directory):
            os.mkdir(ambassador_directory)

        ##### Copy the files to the ambassador's directory #####
        photo_name = os.path.basename(path_without_ext)  # This keeps the '_photo' suffix
        target_psd = os.path.join(ambassador_directory, photo_name + '.psd')
        target_photo = os.path.join(ambassador_directory, photo_name + ext)

        print(f"Copying to: {target_photo}\n")
        shutil.copyfile(original, target_psd)
        shutil.copyfile(name, target_photo)
        os.remove(name)



    if len(names) == 0:
        print("No files found. Exiting.")
        return
    else:
        # run the edit_PS.jsx script
        os.system("open -a 'Adobe Photoshop 2023' ./edit_PS.jsx")

if __name__ == "__main__":
    main()

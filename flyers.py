#! /usr/bin/env python3
import shutil
import glob
import os
import argparse
import tkinter as tk
from tkinter.filedialog import askdirectory

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


def main():
    parser = argparse.ArgumentParser(description="Process JPEGs in a directory.")
    parser.add_argument("-f", "--folder", help="Use default folder path", action="store_true")
    parser.add_argument("directory", nargs="?", default=None, help="Directory containing JPEGs")
    args = parser.parse_args()

    if args.folder:
        directory = default_path
    elif args.directory:
        directory = args.directory
    else:
        directory = select_directory_with_gui(default_path)

    if not directory:
        print("No directory selected. Exiting.")
        return

    if not directory.endswith("/"):
        directory += "/"

    original = directory + 'Templates/Template.psd'
    names = glob.glob(directory + "*.jpeg") + glob.glob(directory + "*.jpg")
    print(f"\nDIR Selected: '{directory}'")
    print(f"Using Template: '{original}'\n")
    print(f"Found {len(names)} Pictures\n")

    for name in names:
        ##### Determine the extension ##### 
        ext = '.jpeg' if name.endswith('.jpeg') else '.jpg'

        ##### Extract path without extension #####
        path_without_ext = name.rsplit(ext, 1)[0]

        ##### Extract ambassador name by cutting off the '_photo' part #####
        Ambassador_name = os.path.basename(path_without_ext.rsplit('_photo', 1)[0])
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

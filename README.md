# Flyers
---
## Setup
- First add the action file (`Flyers.atn`) to **Photoshop**. Do this by going to Window > Actions (Or hiting Option + F9) and on the window that pops up, click on the 3 lines on the top right corner, and **"Load    Actions"**.
- Go into the `edit_PS.jsx` file and change the variable `default_path` to the path of the the directory with your project as well.
- Make sure the template that you are using has a picture layer that will be getting replaced that is named `Main-Pic` and the text layer named `Name`
- open up a terminal and run `./setup.py`
- (Optional) Go into the `flyers.py` file and change the variable `default_path` to the path of the the directory with your project.
**Done**
---

## How to Use
1. Add all your jpegs into your directory
2. Run `./flyers.py`
3. A window will pop up. Since we configured the default path in the setup step you can press cancel, or navigate to the directory and selected. You can also just run `./flyers.py -f` which will use the default directory straight away.
4. A photoshop alert will pop up. Press ok
5. Move the picture around like normal, and press the tick to confirm changes 

import os
import re
import sys
import json
from PIL import Image

regexFileType: str = '[0-9a-z]+$'                         # png, jpg, jmm etc.
regexLangKey: str = '(?!.+_[^0-9@.])(?:_[^0-9@._]+)'      # _en, _fr, _ho etc.
# regexLangKeyOld: str = '(?!.+_)(?:[^0-9@.]+)'           # _en, _fr, _ho etc.
regexLang: str = '.+(?:_)(?:([^0-9@._]+))'                # en, fr, ho etc.

def getColorDepth(image):
	mode_to_bpp = {'1':1, 'L':8, 'P':8, 'RGB':24, 'RGBA':32, 'CMYK':32, 'YCbCr':24, 'I':32, 'F':32}
	bpp = mode_to_bpp[image.mode]
	return bpp

listOFSupportedTypes = ["png", "jpg", "jpeg"]
def isImage(fileFormat):
    return fileFormat in listOFSupportedTypes


def toFilesTree(path):
    targetObj = {'fileName': os.path.basename(path)}
    targetObj['folderPath'] = re.sub(targetObj['fileName'], '', path, 1)
    if os.path.isdir(path):
        targetObj['type'] = "directory"
        targetObj['children'] = [toFilesTree(os.path.join(path, x)) for x in os.listdir(path)]
    else:
        targetObj['type'] = re.search(regexFileType, targetObj['fileName']).group()
        langKey = re.search(regexLang, targetObj['fileName'])
        if langKey:
            targetObj['lang'] = langKey.groups()[-1]
            targetObj['groupName'] = re.sub(regexLangKey, '', targetObj['fileName'], 1)
        else:
            targetObj['groupName'] = targetObj['fileName']
        if isImage(targetObj['type']):
            image = Image.open(path)
            targetObj['imageDimension'] = image.size
            targetObj['colorDepth'] = getColorDepth(image)
    return targetObj

args = json.loads(sys.argv[1])
print(json.dumps(toFilesTree(args["path"])))

# print(json.dumps(toFilesTree('C:\\repositories\\branch\\games-gpas\\thunderbirds\\assets\\src\\main\\resources\\assets\\translations\\images\\common\\dwb\\big_win')))
# print(json.dumps(toFilesTree('C:\\repositories\\branch\\games-gpas\\thunderbirds\\assets\\src\\main\\resources\\assets\\translations\\images')))
# print(json.dumps(toFilesTree('C:\\repositories\\branch\\games-gpas\\thunderbirds\\assets\\src\\main\\resources\\assets\\translations\\images\\common\\free_games\\popup\\outro_win')))
# toFilesTree('C:\\repositories\\branch\\games-gpas\\thunderbirds\\assets\\src\\main\\resources\\assets\\translations\\images')
# renameFiles('C:\\repositories\\trunk\\rubikscube\\assets\\src\\main\\resources\\assets\\translations\\images\\mobile')
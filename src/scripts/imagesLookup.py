from PIL import Image
from PIL.ExifTags import TAGS
def get_exif(fn):
    ret = {}
    i = Image.open(fn)
    info = i._getexif()
    for tag, value in info.items():
        decoded = TAGS.get(tag, tag)
        ret[decoded] = value
    return ret
# path to the image or video
imagename = "C:\\repositories\\branch\\aog_god_of_storm\\aeolus\\desktop_aeolus\\assets\\src\\main\\resources\\assets\\generic\\images\\backgrounds\\bg_feature.jpeg"
res = get_exif(imagename)

print(res)
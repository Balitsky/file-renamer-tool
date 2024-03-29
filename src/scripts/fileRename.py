import os, re, sys, json

regexLang: str = ".+(?=_%s[^a-zA-Z])"
languages: [] = ["bg", "ch", "cs", "da", "de", "el", "en", "es", "es-mx", "et", "fi", "fr", "fr-ca", "hu", "hr", "it", 
                 "ja", "ko", "ms", "no", "nl", "pl", "pt", "pt-br", "ro", "ru", "sk", "sv", "th", "tr", "zh-cn"]

def getPath(name): return os.getcwd() + '\\' + name

def renameFiles(address: str, namePattern: str):
    os.chdir(address)
    for file in os.listdir(os.getcwd()):
        if not os.path.isdir(file):
            file = file.lower()
            for lang in languages:
                if re.search(regexLang % lang, file):
                    newName = re.sub(regexLang % lang, namePattern, file)
                    os.rename(getPath(file), getPath(newName))

# object -> json
# res = json.dumps(sys.argv[1])

# json -> object
# res = json.loads(sys.argv[1])
args = json.loads(sys.argv[1])
renameFiles(args["path"], args["name"])
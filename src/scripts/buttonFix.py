import os, re, sys, json

regexNumber: str = "(_0[1-4])(?=[^a-zA-Z])"

def getPath(name): return os.getcwd() + '\\' + name
def extractNumber(file): return int(re.findall(regexNumber, file)[0][2:])

def getStatesArray(states: {}):
    result: [str] = []
    for st in states:
        if states[st]:
            result.append('@' + st)
    if result[0] == '@regular':
        result[0] = ''
    return result

def buttonStateFix(address: str, states: {}):
    os.chdir(address)
    states = getStatesArray(states)
    for file in os.listdir(os.getcwd()):
        if not os.path.isdir(file) and re.search(regexNumber, file):
            newName = re.sub(regexNumber, states[extractNumber(file)-1], file)
            os.rename(getPath(file), getPath(newName))

args = json.loads(sys.argv[1])
buttonStateFix(args["path"], args["states"])
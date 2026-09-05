import re

def check_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # We can try to look for obvious undefined things like 'THREE.foo' that doesn't exist,
    # or just variables that aren't let/const/var and aren't in scope.
    # It's better to just use a real parser. Node is available.

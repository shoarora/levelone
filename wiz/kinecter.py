import requests
import sys

if __name__ == '__main__':
    p1 = 0
    while True:
        for line in sys.stdin:
            val = float(line)
            if val < 0.3:
                new_p1 = 0
            elif val < 0.7:
                new_p1 = 1
            elif val < 1.5:
                new_p1 = 2
            if new_p1 != p1:
                p1 = new_p1
                requests.get('http://myth14.stanford.edu:5000/update/'+str(p1))

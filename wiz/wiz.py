import requests

if __name__ == '__main__':
    p1 = 0
    ascending = True
    while True:
        x = raw_input()
        if p1 != 2 and ascending:
            p1 += 1
        if p1 != 0 and not ascending:
            p1 -= 1
        if p1 == 0 or p1 == 2:
            ascending = not ascending
        requests.get('http://myth3.stanford.edu:5000/update/'+str(p1))

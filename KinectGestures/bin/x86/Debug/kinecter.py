import requests
from subprocess import Popen, PIPE, STDOUT


def launch_kinect(command):
    p = Popen(command, stdout=PIPE,
              stderr=STDOUT, shell=True)
    return p


def send_kinect_outputs(p):
    p1 = 0
    while True:
        line = p.stdout.readline()
        if not line:
            break
        try:
            val = float(line)
            if val < 0.3:
                new_p1 = 0
            elif val < 0.7:
                new_p1 = 1
            elif val < 1.5:
                new_p1 = 2
            if new_p1 != p1:
                p1 = new_p1
                requests.get('http://myth3.stanford.edu:5000/update/'+str(p1))
                #print p1
        except ValueError:
            pass


if __name__ == '__main__':
    command = ''  # TODO
    p = launch_kinect('DiscreteGestureBasics-WPF.exe')
    send_kinect_outputs(p)

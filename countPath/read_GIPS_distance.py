import serial
import binascii
import numpy as np
import pandas as pd
import dotenv
import random

COM_PORT = '/dev/ttyUSB0'  # for rpi/wsl
# COM_PORT = 'COM4'   # for computer

anchor_IDs = ['0241000000000000','0341000000000000','0541000000000000']
BAUD_RATES = 57600    

# anchor position
x0,  y0  = 25.017662, 121.544473    # CRS coordinate of anchor 6
x02, y02 = 25.017740, 121.544447    # CRS coordinate of anchor 7
x03, y03 = 25.017656, 121.544656    # CRS coordinate of anchor 9
x_multiplier = 111000               # unit:(m/longitude)
y_multiplier = 100000               # unit:(m/latitude)
x1, y1 = 0, 0                       # anchor 6
x2, y2 = (x02 - x0) * x_multiplier, (y02 - y0) * y_multiplier   # anchor 7
x3, y3 = (x03 - x0) * x_multiplier, (y03 - y0) * y_multiplier   # anchor 9


def swapEndianness(hexstring):
	ba = bytearray.fromhex(hexstring)
	ba.reverse()
	return ba.hex()

class UWBpos:
    def __init__(self):
        print("initializing UWB...")
        try:
            self.ser_UWB = serial.Serial(COM_PORT, BAUD_RATES) 
            self.ser_success = True
        except:
            print("Cannot connect to {}.".format(COM_PORT))
            self.ser_success = False

        self.X = np.array([x1, x2, x3])
        self.Y = np.array([y1, y2, y3])
        self.XY = np.cross(self.X,self.Y).dot(np.array([1, 1, 1]))
        self.C0 = np.array([(x1*x1 + y1*y1), (x2*x2 + y2*y2), (x3*x3 + y3*y3)])
        self.diss = np.zeros(4)
        print("UWB initialized successfully.")
        print("anchor 6 coordinate:({}, {})".format(x0, y0))
                
    def UWB_read(self):
        if self.ser_success:
            rx = self.ser_UWB.read(66 * len(anchor_IDs))
            rx = binascii.hexlify(rx).decode('utf-8')
            
            for index, anchor_ID in enumerate(anchor_IDs):
                if( rx != ' ' and rx.find(anchor_ID) >= 0 and rx.find(anchor_ID) <= (len(rx)-24)):
                    dis_index = rx.find(anchor_ID) 
                    dis = rx[dis_index + 16 : dis_index + 24] # ToF distance
                    dis = swapEndianness(dis)

                    if dis != "":
                        dis = int(dis,16)
                        if dis >= 32768:      # solve sign
                            dis = 0
                    else:
                       dis = 0
                else:
                    dis = 0
                self.diss[index] = dis / 100

        return self.diss

    def fake_read(self):
        random.seed()
        self.diss[0] = 100 * random.random()
        self.diss[1] = 100 * random.random()
        self.diss[2] = 100 * random.random()

    def compute_relative(self):
        r1 = self.diss[1]
        r2 = self.diss[2]
        r3 = self.diss[3]
        C = self.C0 - np.array([r1*r1, r2*r2, r3*r3])
        CY = np.cross(C,self.Y).dot(np.array([1, 1, 1]))
        XC = np.cross(self.X,C).dot(np.array([1, 1, 1]))
        x = CY / self.XY / 2
        y = XC / self.XY / 2
        return x, y

    def compute_CRS(self):
        x, y = self.compute_relative()
        return (x0 + x / x_multiplier, y0 + y / y_multiplier)

    def recalibrate(self):
        print("hold tag close to anchor 6")
        d2, d3 = 0, 0
        for count in range(10):
            diss = self.UWB_read()
            if diss[0] < 10:
                print(f"taking test value {count}/10...")
                d2 += diss[1]
                d3 += diss[2]
        d2 /= 10
        d3 /= 10
        x2, y2 = x02 - x0, y02 - y0
        x3, y3 = x03 - x0, y03 - y0

        delta   = np.linalg.det([[x2*x2, y2*y2], [x3*x3, y3*y3]])
        delta_x = np.linalg.det([[d2*d2, y2*y2], [d3*d3, y3*y3]])
        delta_y = np.linalg.det([[x2*x2, d2*d2], [x3*x3, d3*d3]])
        x_multiplier = (delta_x / delta)**(0.5)
        y_multiplier = (delta_y / delta)**(0.5)
        print("recalibration completed! new multipliers:")
        print(f"x = {x_multiplier}")
        print(f"y = {y_multiplier}")

    def get_anchor_CRS(self, idx):
        if idx == '6':
            return x0, y0
        elif idx == '7':
            return x02, y02
        elif idx == '9':
            return x03, y03
        else:
            return -1, -1
        
if __name__ == '__main__':  
    try:
        uwbpos = UWBpos()
        for i in range(10):
            dis_to_tag = uwbpos.UWB_read()
            print("anchor ID 6: " + str(dis_to_tag[0]), end="\t")
            print("anchor ID 7: " + str(dis_to_tag[1]), end="\t")
            print("anchor ID 9: " + str(dis_to_tag[2]))
            x, y = uwbpos.UWB_compute()
            print("(x, y) = ({}, {})".format(x, y))
            
    except KeyboardInterrupt:
        pass 

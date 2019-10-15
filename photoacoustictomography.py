import serial
import struct
from tkinter import *
from tkinter import Label, Button

ser = serial.Serial('COM3', 9600)    #connect ke arduino

window = Tk()
window.geometry('500x500')
window.title('Tkinter and Arduino')

def enter ():
    frek = inputfrek.get()
    duty = inputduty.get()
    
    ser.write(struct.pack('>BB', frek, duty))  #mengirim informasi ke arduino

    print('asolole')
    #label1 = Label(text=frek).pack()
    #label11 = Label(text=duty).pack()


inputfrek = IntVar()
inputduty = IntVar()

label1 = Label(text='Frekuensi').pack()
textfrek = Entry(textvariable = inputfrek).pack()
label2 = Label(text='Duty Cycle').pack()
textduty = Entry(textvariable = inputduty).pack()
button1 = Button(text='enter', command = enter).pack()


window.mainloop()
# DO NOT KEEP THE KEYS HELD DOWN WHEN PLAYING

from pynput.keyboard import Key, Controller
import time

teclas = ["k","e","f","b","o","k","b","y","r","k","e","f","b","n","o","k","r","b","y","i","o","0","o","i","f","t","y","8","h","f","t","n","8","8","j","7","8","i","8","j","x","d","f","t","y","t","b","1","x","d","r","y","v","d","1","y","7","j","6","g","m","a","4","i","y","j","j","x","4","y","i","c","j","x","d","f","t","1","x","d","r","6","b","w","e","f","t","r","t","n","u","4","5","h","j","c","v","n","y","d","f","6","7","k","e","f","b","n","o","k","b","y","r","k","e","f","b","o","k","r","b","y","i","o","0","o","i","f","t","y","8","h","f","t","n","8","8","j","7","8","i","8","j","x","d","f","t","y","h","t","b","1","x","d","r","y","v","d","1","y","7","j","m","g","a","6","4","i","y","j","j","x","4","y","i","c","j","x","d","f","t","1","x","d","r","6","b","w","e","f","t"]
tiempos = [2152,2610,2634,2709,2793,3918,4861,4868,4892,6448,7143,7209,7278,7339,7423,8768,9427,9511,9538,9610,9664,10066,10464,11307,11900,11959,12024,12083,13514,14082,14162,14261,15897,16273,16633,16986,17057,17456,17842,18388,19119,19322,19518,19688,19975,20772,21155,21639,22056,22230,22433,22663,24097,24103,24121,24693,24994,25328,25848,25854,25860,25866,25897,26361,26734,26761,28008,28533,28566,28618,28700,29421,29961,30440,30485,30563,30637,31382,31879,31937,31979,32018,32381,33085,33157,33184,33232,35405,35450,35505,35567,36081,36132,36167,36216,36680,36728,36748,36807,37221,37270,37315,37377,38373,39037,39093,39160,39221,39239,41068,41742,41753,41765,43718,44243,44297,44354,44445,46090,46789,46894,46918,46999,47073,47429,47836,48798,49396,49455,49520,49599,51422,52008,52057,52173,52823,53216,53563,53904,53958,54393,54859,55327,55996,56180,56362,56526,56760,56870,58033,58336,58867,59034,59242,59483,59753,61356,61377,61386,61975,62323,62667,63220,63229,63236,63243,63252,63702,64123,64129,65338,65897,65936,65996,66069,66788,67358,67808,67912,68028,68130,68870,69579,69615,69737,69818,70362,71033,71082,71145,71217]

time.sleep(2) # time to change my screen to the table of notes
keyboard = Controller()

tiempos.insert(len(tiempos),tiempos[-1]) # add last element to new last position, so that the last key gets released
tiempos = [tiempos[i+1] - tiempos[i] for i in range(len(tiempos)-1) ]

scale_velocity =  1     # 1: regular speed    0.5: double speed

for i in range(len(teclas)) :
    keyboard.press(teclas[i])
    time.sleep(tiempos[i]*0.001*scale_velocity)
    keyboard.release(teclas[i])
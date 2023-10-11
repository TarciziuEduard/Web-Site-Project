import socket
import os
import gzip
from threading import Thread
import json

tipExtensie = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'json': 'application/json',
    'xml': 'application/xml'
}

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
serversocket.bind(('', 5678))
serversocket.listen(5)
def tratare_cerere(clientsocket,address):
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        if len(data) == 0:
            break
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + '#####')
            numeResursa = linieDeStart.split(' ')[1]
            if numeResursa=='/':
                numeResursa = '/index.html'
            print('S-a cerut resursa: ' + numeResursa)
            
            if linieDeStart.startswith('POST'):
                
                pozitie = cerere.find('\r\n\r\n')
                continut = cerere[pozitie+4:]
                elemente = continut.split('&')
                cerere_dict = {}
                for element in elemente:
                    cheie_valoare = element.split('=')
                    cerere_dict[cheie_valoare[0]] = cheie_valoare[1]

                username = cerere_dict['username']
                password = cerere_dict['password']
                obiect_json = {'utilizator': username, 'parola': password}

                with open('../continut/resurse/utilizatori.json', 'r') as f:
                    lista_utilizatori = json.load(f)

               
                lista_utilizatori.append(obiect_json)

                
                with open('../continut/resurse/utilizatori.json', 'w') as f:
                    json.dump(lista_utilizatori, f)
                    f.write('\n')

                # Trimitere raspuns
                raspuns = 'HTTP/1.1 302 Found\r\nLocation:/index.html\r\n\r\n'
                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
            else:
                 
                extensie = numeResursa.split('.')[-1]
                tipMedia = tipExtensie.get(extensie, 'application/octet-stream')
                # determina calea completa catre fisierul cerut
                pathFile = os.path.join('../continut', numeResursa[1:])
                print(pathFile)
                try:
                    if os.path.exists(pathFile):
                        # citeste continutul fisierului
                        with open(pathFile, 'rb') as fisier:
                            continutFisier = fisier.read()
                        # comprima continutul fisierului folosind gzip
                        continutComprimat = gzip.compress(continutFisier)
                        lungimeContinut = str(len(continutComprimat))
                        raspuns = 'HTTP/1.1 200 OK\r\nContent-Type: '+tipMedia+'\r\nContent-Encoding: gzip\r\nContent-Length: '+lungimeContinut+'\r\n\r\n'
                        raspuns = raspuns.encode() + continutComprimat 
                        clientsocket.sendall(raspuns)
                    else:
                        
                        raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 43\r\n\r\nFisierul cerut nu a putut fi gasit!'
                        clientsocket.sendall(raspuns.encode())
                    
                    fisier.close()
                except FileNotFoundError:
               
                    raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 43\r\n\r\nFisierul cerut nu a putut fi gasit!'
                    clientsocket.sendall(raspuns.encode())
                except Exception as e:
                
                    raspuns = 'HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\nContent-Length: '+str(len(str(e)))+'\r\n\r\nEroare la citirea fisierului: ' + str(e)
                    clientsocket.sendall(raspuns.encode())
                    clientsocket.close()
                break
    print('S-a terminat cititrea.')
    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')
while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
   
    (clientsocket, address) = serversocket.accept()
    t = Thread(target=tratare_cerere, args=(clientsocket, address))
    t.start()
    t.join()

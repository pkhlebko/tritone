"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpServer = void 0;
const net_1 = __importDefault(require("net"));
class TcpServer {
    constructor(port) {
        this._port = parseInt(port, 10) || 2222;
    }
    start() {
        this._server = net_1.default.createServer();
        this._server.on('close', this.onClose); // emitted when server closes ...not emitted until all connections closes.
        this._server.on('connection', this._onConnection.bind(this)); // emitted when new client connects
        this._server.on('error', this.onError); // emits when any error occurs -> calls closed event immediately after this.
        this._server.on('listening', this.onListening); // emits when server is bound with server.listen
        this._server.maxConnections = 10;
        this._server.listen(this._port); // static port allocation
        const islistening = this._server.listening;
        if (islistening) {
            console.log('Server is listening');
        }
        else {
            console.log('Server is not listening');
        }
    }
    stop() {
        this._server.close();
    }
    _onConnection(socket) {
        // this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
        // Users who experience large or growing bufferSize should attempt to 'throttle' the data flows in their program with pause() and resume().
        console.log('Buffer size : ' + socket.bufferSize);
        console.log('---------server details -----------------');
        const { port, family, address } = this._server.address();
        console.log('Server is listening at port' + port);
        console.log('Server ip :' + address);
        console.log('Server is IP4/IP6 : ' + family);
        const { localPort, localAddress } = socket;
        console.log('Server is listening at LOCAL port' + localPort);
        console.log('Server LOCAL ip :' + localAddress);
        console.log('------------remote client info --------------');
        const { remotePort, remoteAddress, remoteFamily } = socket;
        console.log('REMOTE Socket is listening at port' + remotePort);
        console.log('REMOTE Socket ip :' + remoteAddress);
        console.log('REMOTE Socket is IP4/IP6 : ' + remoteFamily);
        console.log('--------------------------------------------');
        // var no_of_connections =  server.getConnections(); // sychronous version
        this._server.getConnections((error, count) => console.log('Number of concurrent connections to the server : ' + count));
        socket.setEncoding('utf8');
        socket.setTimeout(800000, () => {
            // called after timeout -> same as socket.on('timeout')
            // it just tells that soket timed out => its ur job to end or destroy the socket.
            // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
            // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
            console.log('Socket timed out');
        });
        socket.on('data', (data) => {
            const { bytesRead, bytesWritten } = socket;
            console.log('Bytes read : ' + bytesRead);
            console.log('Bytes written : ' + bytesWritten);
            console.log('Data sent to server : ' + data);
            // echo data
            const isKernelBufferFull = socket.write('Data ::' + data);
            if (isKernelBufferFull) {
                console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
            }
            else {
                socket.pause();
            }
        });
        socket.on('drain', () => {
            console.log('write buffer is empty now .. u can resume the writable stream');
            socket.resume();
        });
        socket.on('error', (error) => console.log('Error : ' + error));
        socket.on('timeout', () => {
            console.log('Socket timed out !');
            socket.end('Timed out!');
            // can call socket.destroy() here too.
        });
        socket.on('end', function (data) {
            console.log('Socket ended from other end!');
            console.log('End data : ' + data);
        });
        socket.on('close', function (error) {
            var bread = socket.bytesRead;
            var bwrite = socket.bytesWritten;
            console.log('Bytes read : ' + bread);
            console.log('Bytes written : ' + bwrite);
            console.log('Socket closed!');
            if (error) {
                console.log('Socket was closed coz of transmission error');
            }
        });
        setTimeout(() => {
            const { destroyed } = socket;
            console.log('Socket destroyed:' + destroyed);
            socket.destroy();
        }, 1200000);
    }
    onClose() {
        console.info('Server closed !');
    }
    onError(error) {
        console.error('Error: ' + error);
    }
    onListening() {
        console.info('Server is listening!');
    }
}
exports.TcpServer = TcpServer;
//# sourceMappingURL=tcp-server.js.map
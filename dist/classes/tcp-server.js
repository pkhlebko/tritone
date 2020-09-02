"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpServer = void 0;
const net_1 = require("net");
class TcpServer {
    constructor(port) {
        this.port = parseInt(port, 10) || 2222;
    }
    start() {
        this.server = new net_1.Server();
        this.server.on('close', this.onClose); // emitted when server closes ...not emitted until all connections closes.
        this.server.on('connection', this.onConnection.bind(this)); // emitted when new client connects
        this.server.on('error', this.onError); // emits when any error occurs -> calls closed event immediately after this.
        this.server.on('listening', this.onListening); // emits when server is bound with server.listen
        this.server.maxConnections = 10;
        this.server.listen(this.port); // static port allocation
        const islistening = this.server.listening;
        if (islistening) {
            console.log('Server is listening');
        }
        else {
            console.log('Server is not listening');
        }
    }
    stop() {
        this.server.close();
    }
    onConnection(socket) {
        const { port, family, address } = this.server.address();
        const { localPort, localAddress, remotePort, remoteAddress, remoteFamily } = socket;
        console.info(`Server is listening at ${address}:${port} ${family}`);
        console.info(`Server is listening at local ${localAddress}:${localPort}`);
        console.info(`REMOTE Socket is listening at ${remoteAddress}:${remotePort} ${remoteFamily}`);
        this.server.getConnections((error, count) => console.log('Number of concurrent connections to the server : ' + count));
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
            console.info(`Bytes read: ${bytesRead} | Bytes written: ${bytesWritten}, Data sent to server: ${data}`);
            // echo data
            const isKernelBufferFull = socket.write('Data ::' + data);
            if (isKernelBufferFull) {
                console.info('Data was flushed successfully from kernel buffer i.e written successfully!');
            }
            else {
                socket.pause();
            }
        });
        socket.on('drain', () => {
            console.info('write buffer is empty now .. u can resume the writable stream');
            socket.resume();
        });
        socket.on('error', (error) => console.log('Error : ' + error));
        socket.on('timeout', () => {
            console.log('Socket timed out!');
            socket.end('Timed out!');
        });
        socket.on('end', (data) => {
            console.log('Socket ended from other end!');
            console.log('End data: ${data}');
        });
        socket.on('close', (error) => {
            const { bytesRead, bytesWritten } = socket;
            console.info(`Bytes read: ${bytesRead} | Bytes written: ${bytesWritten} | Socket closed!`);
            if (error) {
                console.error('Socket was closed coz of transmission error');
            }
        });
        setTimeout(() => {
            console.info(`Socket destroyed: ${socket.destroyed}`);
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
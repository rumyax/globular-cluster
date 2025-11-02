export const socket = {
    data: {
        meta: { mass: 0, time: 0, densityCenter: { x: 0, y: 0, z: 0 }, halfMassRadius: 0 },
        display: { scale: 0, cell: 0, x: 0, y: 0, grid: true },
        stars: []
    },

    init: fun => {
        const ws = new WebSocket(`ws://${location.host}/`);

        ws.onmessage = msg => {
            socket.data = JSON.parse(msg.data);
            if (fun) fun();
        };
    }
};

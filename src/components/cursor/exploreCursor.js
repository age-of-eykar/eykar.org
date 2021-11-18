import { useEffect, useRef } from 'react';
import { MListeners } from '../map/grid/listeners'

function Cursor({ setCell, setCoord, coordinatesPerId, setBiome, voronoi, topLeft }) {
    const canvasRef = useRef(null)

    useEffect(() => {

        const scale = window.devicePixelRatio;
        const canvas = canvasRef.current;
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
        const context = canvas.getContext('2d')
        context.scale(scale, scale);

        let drew;
        const listeners = new MListeners(context, voronoi, drew, canvas, topLeft, setCell, setCoord, setBiome);

        const listenMouseOut = listeners.handleMouseOut.bind(listeners);
        const listenMouseMove = listeners.handleMouseMove.bind(listeners);

        canvas.addEventListener('mousemove', listenMouseMove);
        canvas.addEventListener('mouseout', listenMouseOut);

        return () => {
            canvas.removeEventListener('mousemove', listenMouseMove)
            canvas.removeEventListener('mouseout', listenMouseOut)
        }
    }, [coordinatesPerId, setCell, setCoord, setBiome, voronoi, topLeft]);

    return <canvas className="cursorCanvas" ref={canvasRef} />
}

export default Cursor;
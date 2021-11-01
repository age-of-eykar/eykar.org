import React, { useEffect, useRef } from "react";
import { perlin1 } from "../../utils/perlinNoise"
import "./biomes.css"

function BiomeCanvas() {
    
    const canvasRef = useRef(null);

    useEffect(()  => {
        const layerB = canvasRef.current
        layerB.width = layerB.clientWidth
        layerB.height = layerB.clientHeight
        const ctx = layerB.getContext('2d')
        let tab = []
        let r, g, b;
        let t = 20;
        for (let i = 0; i < layerB.width/t; i++) {
            for (let j = 0; j < layerB.height/t; j++) {
                r = g = b = (perlin1(3, 0.01, 0.1, i*t, j*t)+0.5)*255
                tab.push(r)
                ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")"
                ctx.fillRect(i*t, j*t, t, t);
            }
        }
    }, [])

    return <canvas className="biomes" ref={canvasRef}/>
}

export default BiomeCanvas;
export function useTxMessage(metadata) {

    switch (metadata.type) {

        case 'mint':
            return ["Minting", `Foundation of a new colony called ${metadata.name}.`];

        case 'conquer':
            const loc = "(" + metadata.target[0] + ", " + metadata.target[1] + ")"
            const title = "Conquering " + loc;
            if (metadata.name)
                return [title, `Your convoy of identifier ${metadata.convoyId} is conquering plot ${loc} for ${metadata.name}.`];
            else
                return [title, `Your convoy of identifier ${metadata.convoyId} is conquering plot ${loc}.`];

        case 'expand':
            return ["Expanding", `Your convoy of identifier ${metadata.convoyId} is expanding an existing colony from (${metadata.source[0]}, ${metadata.source[1]}) to (${metadata.target[0]}, ${metadata.target[1]}).`];

        case 'move_convoy':
            return [`Moving to (${metadata.target[0]}, ${metadata.target[1]})`, `Moving your convoy of identifier ${metadata.convoyId} is from (${metadata.source[0]}, ${metadata.source[1]}) to (${metadata.target[0]}, ${metadata.target[1]}).`];


        case 'transform':
            return ["Transforming", `Transforming ${metadata.input_size} source convoy${metadata.input_size > 1 ? "s" : ""} to ${metadata.output_size} new convoy${metadata.output_size > 1 ? "s" : ""}.`];

        case 'harvest':
            return ["Harvesting", `Your convoy of identifier ${metadata.convoyId} is harvesting resources on (${metadata.target[0]}, ${metadata.target[1]}).`];

        default:
            return ["Moving convoy", "Convoy of 10 humans from (-4, 3) to (5, 6). Travel time estimated to 5 hours."];
    }

}
export default function Cesar(input, offset, viering, back) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    // console.log("pos = ", alphabet.indexOf(input));
    // console.log("let = ", viering[(alphabet.indexOf(input) + offset) % 26]);
    if (back) {
        const index = viering.indexOf(alphabet[(input + offset) % 26]);
        return (index - offset + 26) % 26;
    }
    const index = alphabet.indexOf(viering[(input + offset) % 26]);
    // console.log(input, "-->", alphabet[(index - offset + 26) % 26], index)
    return (index - offset + 26) % 26;
}

export function Substitution(input, alphabet) {
    const alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const index = alphabet.indexOf(input);
    if (index % 2 === 0) {
        return alp.indexOf(alphabet[index + 1]);
    }
    return alp.indexOf(alphabet[index - 1]);
}

export function Substitution2(input, alphabet) {
    const index = alphabet.indexOf(input);
    return alphabet[alphabet.length - 1 - index];
}

export function Substitution3(input, alphabet1, alphabet2) {
    const index = alphabet1.indexOf(input);
    return alphabet2[index];
}
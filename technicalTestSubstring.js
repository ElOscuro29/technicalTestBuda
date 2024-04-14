const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const hash = (string) => {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}

const findString = async () => {
    while (true) {
        var testString = randomString(5);
        var hashResult = await hash(testString);
        console.log(`Probando la cadena: ${testString}, hash: ${hashResult}`);
        if (hashResult.includes('b00da')) {
            return console.log({ string: testString, hash: hashResult });
        }
    }
}

findString().catch(error => {
    console.error(`Hubo un error al buscar la cadena: ${error}`);
});
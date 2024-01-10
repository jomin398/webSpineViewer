export default function readFileAsync(file, format) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        if (format === 'base64') {
            reader.readAsDataURL(file);
        } else if (format === 'text') {
            reader.readAsText(file);
        }
        else {
            //if (format === 'arraybuffer')
            reader.readAsArrayBuffer(file);
        }
    });
}

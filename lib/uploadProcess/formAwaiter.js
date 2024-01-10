
/**
 * form action Awaiter
 * @export
 * @async
 * @param {HTMLFormElement} f
 * @returns {Promise<HTMLFormElement>}
 */
export default async function formAwaiter(f) {
    await new Promise(r => {
        window.FormAct = () => r(true);
        f.action = 'javascript:FormAct()';
    })
    return f;
};
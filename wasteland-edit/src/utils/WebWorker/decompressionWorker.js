export default function MyWorker(args) {
    let onmessage =  (e) => {
        console.log('test')
        if (e && e.data && e.data.msg === 'incApple') {
            const newCounter = incApple(e.data.countApple);
            postMessage(newCounter);
        }

        postMessage('test');
    };
    function incApple(countApple) {
        const start = Date.now();
        while (Date.now() < start + 5000) {
        }
        return countApple + 1;
    }
}
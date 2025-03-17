async function downloadAndMergeSegments() {
    try {
        const video = document.querySelectorAll('video')[(document.querySelectorAll('video')).length - 1];
        const base_url = (video.poster).replace('preview.webp','');
        let index = 1;
        const segments = [];
        const segmentUrls = [];

        let isAvailable = true;
        while (isAvailable) {
            const url = base_url + index + '.ts';
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                segments.push(blob);
                if (response.status === 404) {
                    console.log('Ресурс не найден (404). Завершение цикла.');
                    isAvailable = false;
                } else {
                    segmentUrls.push(url);
                    index += 1;
                    console.log(`Ресурс доступен. Статус: ${response.status}`);
                }
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
                isAvailable = false;
            }

        }
        const fileContents = [];
    for (const url of segmentUrls) {
        try {
            const content = await fetchFile(url);
            fileContents.push(content);
        } catch (error) {
            document.getElementById('status').innerText = `Error fetching ${url}: ${error.message}`;
            return;
        }
    }

    const concatenatedBuffer = concatenateBuffers(fileContents);
    const concatenatedBlob = new Blob([concatenatedBuffer], { type: 'video/mp2t' });
    const url = URL.createObjectURL(concatenatedBlob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = 'test.ts';
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Ошибка при скачивании и склеивании сегментов:', error);
    }
}

async function fetchFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}

function concatenateBuffers(buffers) {
    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
    const concatenatedBuffer = new Uint8Array(totalLength);
    let offset = 0;

    for (const buffer of buffers) {
        concatenatedBuffer.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }

    return concatenatedBuffer;
}

downloadAndMergeSegments();

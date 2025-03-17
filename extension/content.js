function sendVideoUrl() {
    const now = new Date();

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const formattedDate = now.toLocaleString('ru-RU', options);

    alert(`Запустить скачивание? ${formattedDate}`);

    const video = document.querySelectorAll('video')[(document.querySelectorAll('video')).length - 1];

    if (video) {
        const videoUrl = video.poster;
        fetch("http://localhost:5000/download-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: videoUrl })
        })
        .then(response => response.json())
        .then(data => {
            console.log("videoUrl" + videoUrl);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } else {
        console.log("Video element not found.");
    }
    
}
sendVideoUrl();
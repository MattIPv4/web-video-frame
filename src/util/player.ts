const create = (src: string) => {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "auto";

    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";

    video.appendChild(source);
    document.body.appendChild(video);
    return video;
};

const metadata = (video: HTMLVideoElement) => {
    const promise = new Promise(resolve => {
        video.requestVideoFrameCallback((now, metadata) => {
            resolve(metadata);
        })
    });
    if (video.paused) video.currentTime += Number.EPSILON;
    return promise;
};

const frame = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("2d context not supported");
    
    context.drawImage(video, 0, 0);
    return Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data);
};

document.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(window.location.search);
    const src = query.get("src");
    if (!src) return;

    const video = create(src);
    (window as any).test = { metadata: () => metadata(video), frame: () => frame(video) };
});

const create = (src: string) => {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "auto";
    video.src = src;

    document.body.appendChild(video);
    return video;
};

const frame = (video: HTMLVideoElement) => new Promise(resolve => {
    video.requestVideoFrameCallback((now, metadata) => {
        resolve(metadata.mediaTime);
    })
});

document.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(window.location.search);
    const src = query.get("src");
    if (!src) return;

    const video = create(src);
    (window as any).test = { video, frame: () => frame(video) };
});

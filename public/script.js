const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");

const examplePrompts = [
    "A serene landscape with mountains and a lake",
    "A futuristic city skyline at sunset",
    "A cozy cabin in a snowy forest",
    "A vibrant underwater scene with colorful fish",
    "A mystical forest with glowing mushrooms",
    "A bustling market in a medieval town",
    "A surreal dreamscape with floating islands",
    "A majestic castle on a hilltop",
    "A peaceful beach with palm trees and clear water",
    "A dramatic stormy sky over a desert landscape"
];

(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
})();

const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};

const getImageDimension = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
   const scaleFactor = baseSize / Math.sqrt(width * height);

   let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    calculatedWidth = Math.floor(calculatedWidth / 16) * 16; 
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

    return { width: calculatedWidth, height: calculatedHeight };
};

const generateImages = async (selectModel, imageCount, aspectRatio, promptText) => {
  const { width, height } = getImageDimension(aspectRatio);
  const size = `${width}x${height}`;

  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    const imgCard = document.getElementById(`img-card-${i}`);

    try {
      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptText,
          model: selectModel,
          size: size,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Image generation failed");
      }

      const result = await response.json();
      const imageBase64 = result.data[0]?.b64_json;

      const imgElement = imgCard.querySelector(".result-img");
      imgElement.src = `data:image/png;base64,${imageBase64}`;
      imgCard.classList.remove("loading");
      imgCard.querySelector(".status-container").style.display = "none";
    } catch (error) {
      console.error("Error during fetch:", error);
      imgCard.querySelector(".status-text").textContent = "Failed to load";
      imgCard.classList.remove("loading");
    }
  });

  await Promise.allSettled(imagePromises);
};




 const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio};">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-exclamation-triangle"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                        <img src="https://i.pinimg.com/736x/7c/1a/8d/7c1a8d751d664f37d7cf41a4a5b35132.jpg" class="result-img">
                        <div class="img-overlay">
                <button class="img-download-btn" onclick="downloadImage(${i})">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
                    </div>`;
    }

    generateImages(selectModel, imageCount, aspectRatio, promptText);
};



const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");


    const selectModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();

    createImageCards(selectModel, imageCount, aspectRatio, promptText);
    };

promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
});

promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);

function downloadImage(index) {
    if (event) event .preventDefault();
    const imgElement = document.querySelector(`#img-card-${index} .result-img`);
    const imageSrc = imgElement.src;

    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `generated_image_${index + 1}.png`; // you can customize the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

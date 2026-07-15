// Get the modal and buttons
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const copyButton = document.getElementById("copyButton");
const websiteLink = document.getElementById("websiteLink");

// Open the modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("open");
    }, 10); // Delay adding the "open" class for the animation to work
});

// Close the modal when clicking the close button
closeModalBtn.addEventListener("click", () => {
    modal.classList.add("close");
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("close");
        modal.classList.remove("open"); // Remove the "open" class after the animation
    }, 300); // Delay the removal of "close" class for the animation to finish
});

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.classList.add("close");
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("close");
            modal.classList.remove("open"); // Remove the "open" class after the animation
        }, 300); // Delay the removal of "close" class for the animation to finish
    }
});

// Copy the website link to the clipboard
copyButton.addEventListener("click", () => {

    //try browser share api the url
    if (navigator.share) {
        navigator
            .share({
                title: "Share the website",
                url: websiteLink.value,
            })
            .then(() => {
                console.log("Thanks for sharing!");
            })
            .catch(console.error);
    }
});

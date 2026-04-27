const majorasMask = new Audio("assets/audio/majoras_mask.mp3");
const fnafBells = new Audio("assets/audio/fnaf_bells.mp3");

function getCurrentSemester(now) {
    const y = now.getFullYear();
    const semesters = [
        { name: "Fall",   start: new Date(y, 8, 2),  end: new Date(y, 11, 13) }, // Sep 2 – Dec 13
        { name: "Winter", start: new Date(y, 0, 12), end: new Date(y, 3, 25)  }, // Jan 12 – Apr 25
        { name: "Spring", start: new Date(y, 4, 11), end: new Date(y, 7, 16)  }, // May 11 – Aug 16
    ];
    return semesters.find(s => now >= s.start && now <= s.end) || null;
}

function setOpacityWithDelay(elementId, opacity, delay) {
    setTimeout(() => {
        document.getElementById(elementId).style.opacity = opacity;
    }, delay);
}

function applyBackgroundImage(imageInQuestion) {
    const backgroundWrapper = document.querySelector('.background-wrapper');
    backgroundWrapper.style.backgroundImage = `url('${imageInQuestion}')`;
    setTimeout(() => {
        backgroundWrapper.style.opacity = 1;
    }, 10);
}

function regularClick() {
    if (!semester || daysLeft <= 0) {
        finito();
        return;
    }

    majorasMask.play();

    setOpacityWithDelay("dawn-text", "1", 100);
    setOpacityWithDelay("semester-text", "1", 550);
    setOpacityWithDelay("remaining-days-text", "1", 1800);

    setTimeout(() => {
        document.querySelector(".progress-bar").style.display = "block";
        document.getElementById("dawn-text").innerText = "";
        document.getElementById("semester-text").innerText = `${completionPercentage}% of ${semester.name} Completed`;
    }, 5000);

    document.removeEventListener("click", regularClick);
}

function finito() {
    fnafBells.play();
    setOpacityWithDelay("remaining-days-text", "1", 16000);

    setTimeout(() => {
        applyBackgroundImage("assets/images/worry.jpg");
    }, 16000);

    setTimeout(() => {
        close();
    }, 50000);

    document.removeEventListener("click", regularClick);
}

document.addEventListener("click", regularClick);

const now = new Date(2026,11,1);
const semester = getCurrentSemester(now);

let totalDays = 0, daysLeft = 0, completionPercentage = 0;
if (semester) {
    totalDays = Math.ceil((semester.end - semester.start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now - semester.start) / (1000 * 60 * 60 * 24));
    daysLeft = totalDays - daysPassed;
    completionPercentage = ((daysPassed / totalDays) * 100).toFixed(0);
}

document.documentElement.style.setProperty("--days-left", Math.max(daysLeft, 0));
document.documentElement.style.setProperty("--total-days", totalDays);

if (semester) {
    document.getElementById("dawn-text").innerText = "Dawn of";
    document.getElementById("semester-text").innerText = `The ${semester.name} Semester`;
    document.getElementById("remaining-days-text").innerText = "- " + Math.max(daysLeft, 0) + " Days Remain -";
}
